const db = require('../config/connectDB');
const { processWithAI } = require('../services/clovaStudio');

//If want to change unlimitedly for 1 week,
// change the SQL query, for example: limit 10 to get 10 records ok!
// query
const SQL = {
    GET_SCHEDULE: `
        (SELECT 'Assignment' as type, a.title, a.due_date as time, c.name as course 
         FROM assignments a JOIN courses c ON a.course_id = c.id 
         WHERE c.user_id = ? AND DATE_ADD(NOW(), INTERVAL 7 DAY)
          AND a.status != 'completed')
        UNION ALL
        (SELECT 'Exam' as type, e.title, e.date as time, c.name as course 
         FROM exams e JOIN courses c ON e.course_id = c.id 
         WHERE c.user_id = ? 
         AND e.date >= BETWEEN NOW() AND DATE_AND(NOW() , INTERVAL 7 DAY))
         `,

    GET_COURSES: `SELECT id, name FROM courses WHERE user_id = ?`,

    FIND_EVENT_TO_DELETE: `
        SELECT id, title, 'assignment' as type FROM assignments 
        WHERE title LIKE ? AND course_id IN (SELECT id FROM courses WHERE user_id = ?)
        UNION ALL
        SELECT id, title, 'exam' as type FROM exams 
        WHERE title LIKE ? AND course_id IN (SELECT id FROM courses WHERE user_id = ?)
        LIMIT 1`
};

// Prompt Template
const SYSTEM_PROMPT_TEMPLATE = (contextData, currentTime, courseListString) => `
ROLE: Intelligent Academic Assistant.

CONTEXT:
Current Time: ${currentTime}
Existing Schedule:
${contextData}

VALID COURSES LIST: [${courseListString}]

--- RULES FOR ACTIONS ---

1. **CREATE_EVENT (Add Assignment/Exam):**
   - REQUIRE: Course Name (Match List), Title, Due Date.
   - **MISSING INFO RULE:** If Title or Date/Time or Course is missing/unclear -> **ASK USER** for the missing info. DO NOT output JSON.
   - OUTPUT JSON (Only if ALL info is present): 
     {"action": "CREATE_EVENT", "data": {"type": "assignment"|"exam", "courseName": "EXACT_NAME", "title": "...", "dueDate": "YYYY-MM-DD HH:mm:ss"}}

2. **DELETE_EVENT (Remove Assignment/Exam):**
   - REQUIRE: **Title** (Name of the event).
   - **MISSING INFO RULE:** If Title is missing -> **ASK USER** "Which event do you want to delete?". DO NOT output JSON.
   - OUTPUT JSON: 
     {"action": "DELETE_EVENT", "data": {"title": "...", "courseName": "..."}}

3. **RETRIEVAL / Q and A RULES:**
   - If the user asks for schedule, upcoming exams, or general info:
   - **OUTPUT PLAIN TEXT ONLY.**
   - **DO NOT** output JSON.
   - **DO NOT** use actions like "INFORM_SCHEDULE".
   - Use bullet points and bold text for clarity.

--- JSON FORMAT (Strict) ---
Output a **SINGLE JSON OBJECT** if an action is required. Do NOT wrap in markdown.
{
  "action": "...",
  "data": { ... }
}

--- CHAT RULES ---
If user asks for info/schedule, reply normally based on Context.
`;

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
});


// Helper Function to Parse JSON safely
const safeJsonParse = (text) => {
    try {
        const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (!jsonMatch) return null;
        let parsed = JSON.parse(jsonMatch[0]);
        return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch (e) {
        return null;
    }
};

const handleChat = async (req, res) => {
    try {
        const { userId, message } = req.body;
        const targetUserId = userId || "1";

        if (!message) return res.status(400).json({ success: false, reply: "Message is required." });

        const [rows, courses] = await Promise.all([
            db.execute(SQL.GET_SCHEDULE, [targetUserId, targetUserId]).then(res => res[0]),
            db.execute(SQL.GET_COURSES, [targetUserId]).then(res => res[0])
        ]);



        let contextInfo = rows.length === 0 ? "No upcoming events." :
            rows.map((item, i) => `${i + 1}. [${item.type}] ${item.course}: "${item.title}" (${dateFormatter.format(new Date(item.time))})`).join('\n');

        const courseListString = courses.map(c => c.name).join(", ");
        const currentSystemTime = dateFormatter.format(new Date());

        // 2. Call AI
        const systemPrompt = SYSTEM_PROMPT_TEMPLATE(contextInfo, currentSystemTime, courseListString);
        const aiReply = await processWithAI("", systemPrompt, message);

        // 3. Handle Logic
        const parsedJson = safeJsonParse(aiReply);

        if (parsedJson) {
            const actionType = parsedJson.action || parsedJson.name;
            const eventData = parsedJson.data || parsedJson.arguments?.data;

            if (eventData) {
                if (actionType === "CREATE_EVENT") {
                    const { courseName, title, dueDate, type } = eventData;

                    if (title.includes("?") || title.toLowerCase() === "unknown") {
                        return res.json({ success: true, reply: aiReply.replace(/\{[\s\S]*\}/, "").trim() || "Please provide a valid title." });
                    }

                    const matchedCourse = courses.find(c => c.name === courseName);

                    if (!matchedCourse) {
                        return res.json({ success: true, reply: `Cannot find course "${courseName}". Please double check your course list.` });
                    }

                    const foundCourseId = matchedCourse.id;
                    const eventType = type?.toLowerCase() || "assignment";

                    if (eventType === "exam") {
                        await db.execute(`INSERT INTO exams (id, course_id, title, date, time, created_at) VALUES (UUID(), ?, ?, ?, ?, NOW())`, [foundCourseId, title, dueDate, dueDate]);
                        return res.json({ success: true, reply: `Exam added: ${title} (${courseName}) on ${dueDate}!` });
                    } else {
                        await db.execute(`INSERT INTO assignments (id, course_id, title, due_date, status) VALUES (UUID(), ?, ?, ?, 'pending')`, [foundCourseId, title, dueDate]);
                        return res.json({ success: true, reply: `Assignment added: ${title} (${courseName}) due ${dueDate}!` });
                    }
                }

                else if (actionType === "DELETE_EVENT") {
                    const { title } = eventData;
                    if (!title) return res.json({ success: true, reply: "Please specify the title of the event to delete." });

                    console.log("Deleting:", title);

                    const [foundEvents] = await db.execute(SQL.FIND_EVENT_TO_DELETE, [`%${title}%`, targetUserId, `%${title}%`, targetUserId]);

                    if (foundEvents.length === 0) {
                        return res.json({ success: true, reply: `Not found: "${title}".` });
                    }

                    const itemToDelete = foundEvents[0];
                    const table = itemToDelete.type === 'assignment' ? 'assignments' : 'exams';

                    await db.execute(`DELETE FROM ${table} WHERE id = ?`, [itemToDelete.id]);

                    return res.json({ success: true, reply: `Successfully deleted: **${itemToDelete.title}**.` });
                }
                else if (eventData.reason || eventData.message || eventData.error) {
                    const textResponse = eventData.reason || eventData.message || eventData.error;
                    return res.json({
                        success: true,
                        reply: textResponse
                    });
                }
            }
        }


        return res.json({ success: true, reply: aiReply });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ success: false, reply: "System Error" });
    }
};

module.exports = { handleChat };