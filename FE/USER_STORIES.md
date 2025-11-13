# User Stories
## Syllabus to Calendar Application

### Epic 1: User Authentication & Onboarding

**US-1.1: User Registration**
- **As a** student
- **I want to** create an account with email and password
- **So that** my course data is saved and accessible across devices

**Acceptance Criteria:**
- User can register with email and password
- Email validation and password strength requirements
- Account creation confirmation
- Redirect to dashboard after registration

**US-1.2: User Login**
- **As a** registered student
- **I want to** log in to my account
- **So that** I can access my saved courses and calendar

**Acceptance Criteria:**
- Login with email and password
- Remember me functionality
- Session management
- Redirect to dashboard after login

**US-1.3: User Logout**
- **As a** logged-in user
- **I want to** log out of my account
- **So that** my account remains secure

---

### Epic 2: Syllabus Upload & Processing

**US-2.1: Upload Syllabus Files**
- **As a** student
- **I want to** upload PDF or image files of my syllabus
- **So that** the system can extract course information

**Acceptance Criteria:**
- Drag-and-drop file upload
- File picker option
- Support for PDF and image formats (JPG, PNG)
- Bulk upload (multiple files)
- File validation (type, size limits)
- Upload progress indicator
- Error handling for invalid files

**US-2.2: Process Syllabus with NAVER AI**
- **As a** student
- **I want to** have my syllabus automatically processed using NAVER AI
- **So that** course information is extracted without manual entry

**Acceptance Criteria:**
- Files sent to CLOVA OCR for text extraction
- CLOVA Studio processes extracted text
- Extracts: assignment names, due dates, exam dates, class schedule, project deadlines
- Processing status indicator
- Binary outcome: Success → Calendar generated, or Failure → Manual entry option

**US-2.3: Manual Entry Fallback**
- **As a** student
- **I want to** manually enter course information if parsing fails
- **So that** I can still create my calendar

**Acceptance Criteria:**
- Manual entry form appears if parsing fails
- Form includes: course name, assignments, exams, class schedule
- Can save manually entered data
- Calendar generated from manual entry

---

### Epic 3: Course Management

**US-3.1: View Course List**
- **As a** student
- **I want to** see all my courses
- **So that** I can manage multiple courses

**Acceptance Criteria:**
- List of all courses with course name and code
- Color coding per course
- Quick stats (upcoming deadlines, assignments)
- Click to view course details

**US-3.2: View Course Details**
- **As a** student
- **I want to** view detailed information about a course
- **So that** I can see all assignments and deadlines

**Acceptance Criteria:**
- Course information display
- Week-by-week breakdown
- All assignments, exams, and deadlines listed
- Edit button to modify course data

**US-3.3: Edit Parsed Course Data**
- **As a** student
- **I want to** edit information extracted from my syllabus
- **So that** I can correct any parsing errors or add missing information

**Acceptance Criteria:**
- Edit button on course details page
- Form pre-filled with existing data
- Can modify: assignments, due dates, exam dates, class schedule
- Changes saved to database
- Calendar updates automatically

---

### Epic 4: Week-by-Week View

**US-4.1: View Week-by-Week Plan**
- **As a** student
- **I want to** see my course organized by weeks (Monday-Sunday)
- **So that** I can plan my work week by week

**Acceptance Criteria:**
- Weeks defined as Monday-Sunday
- All weeks displayed in scrollable view
- Each week shows: week number, date range, assignments, exams, deadlines
- Color coding by course
- Unified view showing all courses

**US-4.2: Navigate Through Weeks**
- **As a** student
- **I want to** scroll through all weeks of the semester
- **So that** I can see my entire course schedule

**Acceptance Criteria:**
- Smooth scrolling through weeks
- Week numbers and date ranges clearly visible
- All weeks accessible without pagination

---

### Epic 5: Calendar Views

**US-5.1: View Month Calendar**
- **As a** student
- **I want to** see a month view of my calendar
- **So that** I can get an overview of all deadlines

**Acceptance Criteria:**
- Grid layout showing full month
- All courses displayed in unified calendar
- Color coding by course
- Deadline indicators
- Click to view event details
- Navigate between months

**US-5.2: View Week Calendar**
- **As a** student
- **I want to** see a week view of my calendar
- **So that** I can focus on the current week

**Acceptance Criteria:**
- Timeline view for selected week
- Days displayed horizontally
- Events shown at appropriate times
- Color coding by course
- Navigate between weeks

**US-5.3: View Agenda**
- **As a** student
- **I want to** see a list of upcoming items
- **So that** I can see what's due soon

**Acceptance Criteria:**
- List of upcoming assignments, exams, deadlines
- Sorted by date (soonest first)
- Grouped by course
- Shows: title, due date, course, status
- Scrollable list

**US-5.4: Switch Calendar Views**
- **As a** student
- **I want to** switch between month, week, and agenda views
- **So that** I can view my calendar in the format I prefer

**Acceptance Criteria:**
- View switcher buttons/buttons
- Smooth transition between views
- Current view highlighted
- State persists (remembers last viewed)

---

### Epic 6: Assignment & Deadline Management

**US-6.1: View Assignment Details**
- **As a** student
- **I want to** click on an assignment to see its details
- **So that** I can see all relevant information

**Acceptance Criteria:**
- Click on assignment in calendar or week view
- Modal or detail panel opens
- Shows: title, description, due date, course, status, priority
- Edit and close buttons

**US-6.2: Update Assignment Status**
- **As a** student
- **I want to** mark assignments as pending, in progress, or completed
- **So that** I can track my progress

**Acceptance Criteria:**
- Status dropdown/buttons on assignment details
- Options: Pending, In Progress, Completed
- Visual indicator (color, icon) for each status
- Changes saved immediately
- Status visible in calendar views

**US-6.3: Set Assignment Priority**
- **As a** student
- **I want to** set priority levels for assignments
- **So that** I can focus on important tasks

**Acceptance Criteria:**
- Priority selector on assignment details
- Options: Low, Medium, High
- Visual indicator (color, badge) for priority
- Changes saved immediately
- Priority visible in calendar views

**US-6.4: Receive Deadline Reminders**
- **As a** student
- **I want to** receive in-app reminders 3 days before deadlines
- **So that** I don't miss important assignments

**Acceptance Criteria:**
- Reminders appear 3 days before due date
- Notification bell icon shows count
- Click to view all reminders
- Reminders list shows: assignment, course, days until due
- Dismiss individual reminders
- Visual indicators in calendar (e.g., warning colors)

---

### Epic 7: Google Calendar Integration

**US-7.1: Connect Google Calendar**
- **As a** student
- **I want to** connect my Google Calendar account
- **So that** my course events sync to Google Calendar

**Acceptance Criteria:**
- "Connect Google Calendar" button
- OAuth flow for Google authentication
- Permission request for calendar access
- Connection confirmation
- Disconnect option

**US-7.2: Sync to Google Calendar**
- **As a** student
- **I want to** have my course events automatically sync to Google Calendar
- **So that** I can see them in my existing calendar app

**Acceptance Criteria:**
- Events created in Google Calendar when course is added
- Real-time sync (changes in app reflect in Google Calendar)
- Events include: title, description, due date, course name
- Color coding matches app colors

**US-7.3: Sync from Google Calendar**
- **As a** student
- **I want to** have changes in Google Calendar sync back to the app
- **So that** my app calendar stays updated

**Acceptance Criteria:**
- Real-time sync from Google Calendar
- Changes in Google Calendar (edit, delete) reflect in app
- Conflict resolution (last-write-wins or timestamp-based)
- Sync status indicator

**US-7.4: Handle Sync Conflicts**
- **As a** student
- **I want to** have conflicts resolved when I edit in both places
- **So that** my calendar data remains consistent

**Acceptance Criteria:**
- Detect simultaneous edits
- Conflict resolution strategy (timestamp-based or last-write-wins)
- User notification if conflict occurs
- Option to choose which version to keep (if time permits)

---

### Epic 8: Export Functionality

**US-8.1: Export to iCal**
- **As a** student
- **I want to** export my calendar as an iCal file
- **So that** I can import it into other calendar applications

**Acceptance Criteria:**
- "Export iCal" button
- Generates .ics file
- Includes all courses, assignments, exams, deadlines
- File downloads to user's device
- Can be imported into Apple Calendar, Outlook, etc.

---

### Epic 9: Unified Calendar Experience

**US-9.1: View All Courses Together**
- **As a** student
- **I want to** see all my courses in one unified calendar
- **So that** I can manage my entire semester schedule

**Acceptance Criteria:**
- All courses displayed together in calendar views
- Color coding distinguishes courses
- Can filter by course (if time permits)
- Unified week-by-week view shows all courses

---

## User Story Priority

### P0 (Must Have for MVP)
- US-1.1, US-1.2: Authentication
- US-2.1, US-2.2: Upload & AI Processing
- US-3.1, US-3.2: Course Management
- US-4.1: Week-by-Week View
- US-5.1, US-5.2, US-5.3: Calendar Views
- US-6.1, US-6.2, US-6.3: Assignment Management
- US-6.4: Reminders
- US-7.1, US-7.2: Google Calendar Sync (one-way minimum)
- US-8.1: iCal Export
- US-9.1: Unified Calendar

### P1 (Important but Can Be Simplified)
- US-3.3: Edit Parsed Data (can be basic version)
- US-7.3: Two-way Google Calendar Sync (can be simplified)
- US-7.4: Conflict Resolution (basic version)

### P2 (Nice to Have)
- Advanced filtering
- Search functionality
- Course deletion
- Re-upload functionality
- Analytics dashboard

---

## Definition of Done

For each user story to be considered complete:

1. ✅ Code implemented and reviewed
2. ✅ Unit tests written (if applicable)
3. ✅ UI matches design specifications
4. ✅ Works on desktop and mobile browsers
5. ✅ Accessibility requirements met (keyboard navigation, screen readers)
6. ✅ Error handling implemented
7. ✅ Loading states and feedback provided
8. ✅ Documentation updated (if needed)

