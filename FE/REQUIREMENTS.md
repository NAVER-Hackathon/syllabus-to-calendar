# Product Requirements Document (PRD)

## Syllabus to Calendar Application

### Project Overview

A web application that helps undergraduate and graduate students convert course syllabi (PDFs and images) into organized, week-by-week calendar plans with deadlines, assignments, exams, and class schedules.

**Success Criteria:**

- Excellent UI/UX
- Effective use of NAVER AI services

---

## 1. User Personas

### Primary Users

- **Undergraduate Students**: Managing 4-6 courses per semester
- **Graduate Students**: Managing 2-4 courses per semester, often with more complex schedules
- **Single User**: Personal calendar management (no collaboration features)

---

## 2. Core Features

### 2.1 Syllabus Input & Upload

**Requirements:**

- Accept file formats: PDF, Images (screenshots)
- Bulk upload capability (multiple files at once)
- Manual entry fallback if parsing fails
- File validation (type, size limits)
- Upload progress indication

**User Flow:**

1. User drags/drops or selects files
2. System validates files
3. User confirms upload
4. System processes files (no intermediate review step)
5. Binary outcome: Accept → Calendar generated, or Reject → Manual entry option

### 2.2 Parsing & Extraction (NAVER AI)

**Required Data Extraction:**

- ✅ Assignment names and due dates
- ✅ Exam dates
- ✅ Class schedule (meeting times)
- ✅ Project deadlines

**Parsing Behavior:**

- **No review/edit step**: Binary accept/reject model
- If parsing succeeds → Auto-generate calendar
- If parsing fails → Offer manual entry option
- Must leverage NAVER AI services effectively

**Technical Notes:**

- **NAVER AI Services**: CLOVA OCR + CLOVA Studio
- CLOVA OCR for text extraction from images and PDFs
- CLOVA Studio for document understanding and structured data extraction
- Date/time parsing and normalization
- Intelligent assignment and deadline recognition

### 2.3 Week-by-Week Plan Generation

**Requirements:**

- Automatically organize extracted data into weekly breakdown
- Display assignments, exams, and deadlines by week
- Show class meeting times
- Visual week-by-week timeline
- **Week Definition**: Monday-Sunday
- **Display**: Show all weeks at once (scrollable timeline)

**Display Elements:**

- Week number/date range (Monday-Sunday)
- Assignments with due dates
- Exams with dates/times
- Project milestones
- Class schedule (recurring)
- All weeks visible in scrollable view

### 2.4 Calendar Views

**Required Views:**

- ✅ **Month View**: Grid layout showing full month
- ✅ **Week View**: Timeline view for selected week
- ✅ **Agenda View**: List of upcoming items sorted by date
- Color coding by course
- Visual deadline indicators
- Click to view/edit details
- Unified calendar showing all courses together

### 2.5 Deadline Management

**Features:**

- **In-app reminders**: Notifications for upcoming deadlines
- **Status tracking**:
  - Pending
  - In Progress
  - Completed
- **Priority levels**:
  - Low
  - Medium
  - High

**Reminder System:**

- **Reminder Timing**: 3 days before deadline
- Visual indicators in calendar
- Notification center/bell icon
- In-app notification system

### 2.6 Export & Integration

**Export Options:**

- iCal format (.ics file download)
- Google Calendar integration (direct sync)

**Google Calendar Integration:**

- OAuth authentication
- **Two-way real-time sync** (app ↔ Google Calendar)
- Event creation with proper formatting
- Bidirectional updates (changes in either system sync to the other)
- Real-time synchronization
- Conflict resolution for simultaneous edits

---

## 3. Technical Requirements

### 3.1 Platform

- **Web only** (responsive design for mobile browsers)
- No native mobile apps required
- Progressive Web App (PWA) capabilities recommended

### 3.2 Technology Stack

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui
- NAVER AI services integration

### 3.3 Data Storage

- **User accounts required**: Authentication system needed
- **Database persistence**: Cloud database (PostgreSQL, MongoDB, or similar)
- User data stored securely in database
- Session management

---

## 4. User Experience Requirements

### 4.1 UI/UX Principles

- **Clean, intuitive interface**: Minimal learning curve
- **Fast processing**: Quick upload and parsing
- **Clear visual feedback**: Loading states, success/error messages
- **Responsive design**: Works well on desktop and mobile browsers
- **Accessibility**: WCAG AA compliance

### 4.2 Key User Flows

**Flow 1: Upload & Process Syllabus**

1. User lands on dashboard
2. Clicks "Add Course" or "Upload Syllabus"
3. Drags/drops or selects PDF/image files
4. System processes with NAVER AI
5. If successful → Calendar auto-generated
6. If failed → Manual entry form shown

**Flow 2: View & Manage Calendar**

1. User views calendar (month/week/agenda view)
2. Sees unified calendar with all courses color-coded
3. Clicks on item to view/edit details
4. Updates status, priority, or edits parsed data
5. Changes sync automatically to database and Google Calendar (if connected)
6. Can edit any parsed data after initial import

**Flow 3: Export to Google Calendar**

1. User clicks "Export" or "Sync with Google"
2. OAuth flow for Google Calendar
3. Events created in user's Google Calendar
4. Confirmation message shown

---

## 5. NAVER AI Integration Requirements

### 5.1 AI Services to Leverage

- **CLOVA OCR**: Text extraction from images and PDFs
- **CLOVA Studio**: Document understanding and structured data extraction
- **Date/Time Parsing**: Intelligent date recognition
- **Natural Language Processing**: Understand assignment descriptions, extract entities
- **Multi-modal Processing**: Handle both PDF and image formats

### 5.2 Success Metrics for AI Usage

- Accurate extraction rate
- Processing speed
- Handling of various syllabus formats
- Robust error handling

---

## 6. Confirmed Requirements

### 6.1 Feature Clarifications

- ✅ **Week-by-week view**: Monday-Sunday definition, show all weeks at once
- ✅ **Calendar views**: All views (Month, Week, Agenda)
- ✅ **Reminder timing**: 3 days before deadline
- ⚠️ **Reading lists**: Not required (focus on assignments, exams, deadlines)
- ⚠️ **Time estimates**: Not required for MVP
- ⚠️ **Progress tracking**: Not required for MVP
- ⚠️ **Notes**: Not required for MVP

### 6.2 Technical Clarifications

- ✅ **User accounts**: Required
- ✅ **Data persistence**: Database (cloud storage)
- ✅ **Multiple courses**: Unified calendar display
- ✅ **Course editing**: Users can edit parsed data after import
- ⚠️ **Re-upload**: To be determined (can be added if time permits)

### 6.3 Integration Details

- ✅ **Google Calendar sync**: Two-way, real-time
- ✅ **Sync frequency**: Real-time
- ⚠️ **Conflict resolution**: Last-write-wins or timestamp-based (to be implemented)

### 6.4 NAVER AI Specifics

- ✅ **NAVER AI services**: CLOVA OCR + CLOVA Studio
- ⚠️ **API endpoints**: To be confirmed during development
- ⚠️ **Rate limits**: To be checked with NAVER API documentation
- ⚠️ **Cost considerations**: To be verified

### 6.5 Timeline & Scope

- ✅ **MVP deadline**: November 21, 2025
- ✅ **Must-have features**: All core features listed in Section 7
- ⚠️ **Nice-to-have features**: Re-upload, advanced conflict resolution, analytics

---

## 7. Feature Prioritization

### Must-Have (MVP)

1. ✅ User authentication & accounts
2. ✅ File upload (PDF, images, bulk upload)
3. ✅ CLOVA OCR + CLOVA Studio integration
4. ✅ Binary accept/reject parsing (no review step)
5. ✅ Week-by-week view (Monday-Sunday, all weeks visible)
6. ✅ Calendar views (Month, Week, Agenda)
7. ✅ Unified calendar (all courses together)
8. ✅ Edit parsed data after import
9. ✅ Status tracking (pending/in-progress/completed)
10. ✅ Priority levels (low/medium/high)
11. ✅ In-app reminders (3 days before)
12. ✅ iCal export
13. ✅ Google Calendar two-way real-time sync
14. ✅ Database persistence

### Nice-to-Have (If Time Permits)

- [ ] Re-upload updated syllabi
- [ ] Advanced conflict resolution for Google Calendar
- [ ] Search functionality
- [ ] Course deletion
- [ ] Dark mode
- [ ] Analytics/insights dashboard
- [ ] Reading list extraction
- [ ] Time estimates per assignment

---

## 8. Success Metrics

### User Experience Metrics

- Time to upload and process syllabus
- Parsing accuracy rate
- User satisfaction (if measurable)
- Error rate (failed parsing)

### NAVER AI Usage Metrics

- API calls made
- Processing time
- Accuracy of extraction
- Handling of edge cases

---

## 9. Constraints & Assumptions

### Constraints

- Web-only platform
- Single user (no collaboration)
- Must use NAVER AI services
- Hackathon timeline constraints

### Assumptions

- Users have Google accounts (for Google Calendar integration)
- Syllabi are in English (or primary language)
- Standard academic calendar formats
- Internet connection required (no offline mode)

---

## 10. Timeline & Milestones

### Hackathon Deadline: November 21, 2025

### Development Phases

**Phase 1: Foundation (Weeks 1-2)**

- Project setup (Next.js, TypeScript, Tailwind, shadcn/ui)
- Authentication system
- Database setup
- Basic UI components

**Phase 2: Core Features (Weeks 3-4)**

- File upload system
- NAVER AI integration (CLOVA OCR + CLOVA Studio)
- Parsing logic
- Week-by-week view

**Phase 3: Calendar & Management (Weeks 5-6)**

- Calendar views (Month, Week, Agenda)
- Status tracking & priorities
- Reminder system
- Edit functionality

**Phase 4: Integration & Polish (Weeks 7-8)**

- Google Calendar sync (two-way)
- iCal export
- UI/UX refinement
- Testing & bug fixes

---

## Next Steps

1. ✅ **Requirements confirmed** (Section 6)
2. **Confirm NAVER AI API access** and credentials
3. **Create detailed user stories** (see USER_STORIES.md)
4. **Design mockups/wireframes**
5. **Technical architecture refinement** (see ARCHITECTURE.md)
6. **Development sprint planning** (see DEVELOPMENT_PLAN.md)
