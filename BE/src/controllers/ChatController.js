const db = require('../config/connectDB');
const { processWithAI, streamAIResponse } = require('../services/clovaStudio');

const GET_UPCOMING_SCHEDULE_SQL = `
    (SELECT 
        'Assignment' as type, 
        a.title, 
        a.due_date as time, 
        c.name as course 
     FROM assignments a 
     JOIN courses c ON a.course_id = c.id 
     WHERE c.user_id = ? 
       AND a.due_date >= NOW() 
       AND a.status != 'completed')
    
    UNION ALL

    (SELECT 
        'Exam' as type, 
        e.title, 
        e.date as time, 
        c.name as course 
     FROM exams e 
     JOIN courses c ON e.course_id = c.id 
     WHERE c.user_id = ? 
       AND e.date >= NOW())

    ORDER BY time ASC 
    LIMIT 10;
`;

const SYSTEM_PROMPT_TEMPLATE = (contextData, currentTime) => `
ROLE: Strict Data Retrieval Bot.
TASK: Answer the student's query based ONLY on the provided schedule data.

CONTEXT:
Current System Time: ${currentTime}
Schedule Data:
${contextData}

RULES:
1. NO HALLUCINATIONS: If the answer is not in "Schedule Data", state that no information was found.
2. NO CHIT-CHAT: Do not use greetings or filler words. Go straight to the answer.
3. EXACT MATCH: Only list events related to the specific subject asked.
4. FORMAT: Use bullet points. Be concise.
`;

// Formatter for consistent date display
const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
});

const handleChat = async (req, res) => {
    try {
        const { userId, message } = req.body;

        // setup handle streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (!message) {
            res.write(`data: ${JSON.stringify({ error: "Message is required" })}\n\n`);
            return res.end();
        }

        // get data db
        const targetUserId = userId || "1";
        const [rows] = await db.execute(GET_UPCOMING_SCHEDULE_SQL, [targetUserId, targetUserId]);

        let contextInfo = "";
        if (rows.length === 0) {
            contextInfo = "No upcoming events found.";
        } else {
            contextInfo = rows.map((item, index) => {
                const timeStr = dateFormatter.format(new Date(item.time));
                return `${index + 1}. [${item.type}] ${item.course}: "${item.title}" (${timeStr})`;
            }).join('\n');
        }

        const currentSystemTime = dateFormatter.format(new Date());
        const systemPrompt = SYSTEM_PROMPT_TEMPLATE(contextInfo, currentSystemTime);

        await streamAIResponse(res, systemPrompt, message);

    } catch (error) {
        console.error("Controller Error:", error);

        if (!res.headersSent) {
            res.status(500).json({ success: false });
        } else {

            res.write(`data: ${JSON.stringify({ error: "Internal Server Error" })}\n\n`);
            res.end();
        }
    }
};

module.exports = { handleChat };