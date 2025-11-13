# Development Plan
## Syllabus to Calendar Application

**Hackathon Deadline:** November 21, 2025

---

## Overview

This development plan breaks down the project into 8 weeks of focused development, organized into 4 phases. Each phase builds upon the previous one, ensuring a working product at each milestone.

---

## Phase 1: Foundation (Weeks 1-2)
**Goal:** Set up project infrastructure and core systems

### Week 1: Project Setup & Authentication

**Day 1-2: Project Initialization**
- [ ] Initialize Next.js 14+ project with TypeScript
- [ ] Set up Tailwind CSS configuration
- [ ] Install and configure shadcn/ui
- [ ] Set up project structure (folders, base components)
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository and initial commit

**Day 3-4: Database & Backend Setup**
- [ ] Choose database (PostgreSQL recommended)
- [ ] Set up database schema
  - Users table
  - Courses table
  - Assignments table
  - Exams table
  - Calendar events table
- [ ] Set up database connection (Prisma or similar ORM)
- [ ] Create API route structure
- [ ] Set up environment variables

**Day 5-7: Authentication System**
- [ ] Implement user registration
- [ ] Implement user login
- [ ] Set up session management (NextAuth.js or similar)
- [ ] Create protected route middleware
- [ ] Build login/register UI pages
- [ ] Test authentication flow

**Deliverables:**
- ✅ Working Next.js application
- ✅ Database schema and connection
- ✅ User authentication (register/login)
- ✅ Protected routes

---

### Week 2: UI Foundation & Layout

**Day 1-3: Layout Components**
- [ ] Create dashboard layout
- [ ] Build sidebar navigation
- [ ] Create header with user menu
- [ ] Implement responsive design (mobile/desktop)
- [ ] Set up routing structure
- [ ] Create empty state components

**Day 4-5: Base UI Components**
- [ ] Set up shadcn/ui components (Button, Card, Input, etc.)
- [ ] Create custom components (LoadingSpinner, ErrorBoundary)
- [ ] Build reusable form components
- [ ] Set up theme/color system
- [ ] Create course color palette

**Day 6-7: Dashboard Homepage**
- [ ] Create dashboard landing page
- [ ] Build "Add Course" button/CTA
- [ ] Create empty state for no courses
- [ ] Add navigation between pages
- [ ] Polish UI/UX

**Deliverables:**
- ✅ Complete layout system
- ✅ Base UI component library
- ✅ Functional dashboard homepage
- ✅ Responsive design working

---

## Phase 2: Core Features (Weeks 3-4)
**Goal:** Implement file upload and NAVER AI integration

### Week 3: File Upload & NAVER AI Integration

**Day 1-2: File Upload System**
- [ ] Create file upload component (drag-and-drop)
- [ ] Implement file validation (type, size)
- [ ] Add bulk upload support
- [ ] Create upload progress indicator
- [ ] Build file preview component
- [ ] Set up file storage (local or cloud)

**Day 3-4: NAVER AI Integration - CLOVA OCR**
- [ ] Research CLOVA OCR API documentation
- [ ] Set up NAVER Cloud Platform account
- [ ] Create API client for CLOVA OCR
- [ ] Implement image/PDF text extraction
- [ ] Test OCR with sample syllabi
- [ ] Error handling for OCR failures

**Day 5-7: NAVER AI Integration - CLOVA Studio**
- [ ] Research CLOVA Studio API documentation
- [ ] Create API client for CLOVA Studio
- [ ] Design prompt for structured data extraction
- [ ] Implement extraction logic:
  - Assignment names and due dates
  - Exam dates
  - Class schedule
  - Project deadlines
- [ ] Test extraction with various syllabus formats
- [ ] Refine prompts for better accuracy

**Deliverables:**
- ✅ File upload working
- ✅ CLOVA OCR integration
- ✅ CLOVA Studio integration
- ✅ Basic data extraction working

---

### Week 4: Parsing Logic & Week-by-Week View

**Day 1-3: Data Processing & Parsing**
- [ ] Create data parsing service
- [ ] Implement date/time normalization
- [ ] Build data validation logic
- [ ] Create data transformation (raw → structured)
- [ ] Implement binary accept/reject logic
- [ ] Create manual entry form (fallback)

**Day 4-5: Week-by-Week Generation**
- [ ] Implement week calculation (Monday-Sunday)
- [ ] Create week breakdown algorithm
- [ ] Organize assignments/exams by week
- [ ] Handle class schedules (recurring events)
- [ ] Create week data structure

**Day 6-7: Week-by-Week UI**
- [ ] Build WeekView component
- [ ] Create WeekCard component
- [ ] Implement scrollable timeline
- [ ] Display all weeks at once
- [ ] Add color coding by course
- [ ] Polish UI/UX

**Deliverables:**
- ✅ Parsing logic complete
- ✅ Week-by-week data generation
- ✅ Week-by-week UI view
- ✅ Manual entry fallback

---

## Phase 3: Calendar & Management (Weeks 5-6)
**Goal:** Build calendar views and assignment management

### Week 5: Calendar Views

**Day 1-2: Month View**
- [ ] Create MonthView component
- [ ] Build calendar grid layout
- [ ] Implement date navigation
- [ ] Display events in month grid
- [ ] Add color coding by course
- [ ] Click to view event details

**Day 3-4: Week View**
- [ ] Create WeekView component
- [ ] Build timeline layout
- [ ] Display events by day/time
- [ ] Implement week navigation
- [ ] Add color coding
- [ ] Click to view event details

**Day 5-7: Agenda View & View Switcher**
- [ ] Create AgendaView component
- [ ] Build list layout
- [ ] Sort events by date
- [ ] Group by course
- [ ] Create view switcher component
- [ ] Implement view state management
- [ ] Polish all calendar views

**Deliverables:**
- ✅ Month view working
- ✅ Week view working
- ✅ Agenda view working
- ✅ View switcher functional

---

### Week 6: Assignment Management & Reminders

**Day 1-2: Assignment Details & Editing**
- [ ] Create AssignmentDetail modal/panel
- [ ] Build edit form for assignments
- [ ] Implement update API endpoints
- [ ] Add form validation
- [ ] Test edit functionality

**Day 3-4: Status & Priority Tracking**
- [ ] Add status field (pending/in-progress/completed)
- [ ] Create status selector component
- [ ] Add priority field (low/medium/high)
- [ ] Create priority selector component
- [ ] Update database schema if needed
- [ ] Visual indicators in calendar

**Day 5-7: Reminder System**
- [ ] Create reminder calculation logic (3 days before)
- [ ] Build notification system
- [ ] Create notification bell icon
- [ ] Build notification center/dropdown
- [ ] Add visual indicators in calendar
- [ ] Implement reminder dismissal
- [ ] Test reminder functionality

**Deliverables:**
- ✅ Assignment editing working
- ✅ Status tracking functional
- ✅ Priority levels working
- ✅ Reminder system complete

---

## Phase 4: Integration & Polish (Weeks 7-8)
**Goal:** Google Calendar sync, export, and final polish

### Week 7: Google Calendar Integration

**Day 1-2: Google OAuth Setup**
- [ ] Set up Google Cloud Console project
- [ ] Configure OAuth credentials
- [ ] Implement OAuth flow
- [ ] Store access tokens securely
- [ ] Create "Connect Google Calendar" UI

**Day 3-4: One-Way Sync (App → Google)**
- [ ] Create Google Calendar API client
- [ ] Implement event creation in Google Calendar
- [ ] Map app events to Google Calendar format
- [ ] Test event creation
- [ ] Handle errors and retries

**Day 5-7: Two-Way Sync (Google → App)**
- [ ] Set up Google Calendar webhook/polling
- [ ] Implement event sync from Google
- [ ] Create conflict detection logic
- [ ] Implement conflict resolution (basic)
- [ ] Test bidirectional sync
- [ ] Handle edge cases

**Deliverables:**
- ✅ Google Calendar OAuth working
- ✅ One-way sync functional
- ✅ Two-way sync working
- ✅ Basic conflict resolution

---

### Week 8: Export, Polish & Testing

**Day 1-2: iCal Export**
- [ ] Research iCal format specification
- [ ] Create iCal generator service
- [ ] Implement .ics file generation
- [ ] Add export button to UI
- [ ] Test iCal import in various calendar apps

**Day 3-4: Course Management**
- [ ] Add edit course functionality
- [ ] Implement course deletion (if time permits)
- [ ] Add course list view improvements
- [ ] Polish course detail pages

**Day 5-6: UI/UX Polish**
- [ ] Review all user flows
- [ ] Fix UI inconsistencies
- [ ] Improve loading states
- [ ] Enhance error messages
- [ ] Add tooltips and help text
- [ ] Mobile responsiveness check
- [ ] Accessibility audit

**Day 7: Testing & Bug Fixes**
- [ ] End-to-end testing
- [ ] Fix critical bugs
- [ ] Performance optimization
- [ ] Final UI polish
- [ ] Prepare demo/presentation

**Deliverables:**
- ✅ iCal export working
- ✅ Polished UI/UX
- ✅ All features tested
- ✅ Ready for submission

---

## Risk Management

### High-Risk Items
1. **NAVER AI Integration Complexity**
   - **Risk:** API complexity or rate limits
   - **Mitigation:** Start integration early, have fallback manual entry

2. **Two-Way Google Calendar Sync**
   - **Risk:** Complex conflict resolution
   - **Mitigation:** Start with one-way sync, add two-way if time permits

3. **Parsing Accuracy**
   - **Risk:** AI extraction may be inaccurate
   - **Mitigation:** Allow editing after import, refine prompts iteratively

### Medium-Risk Items
1. **Real-time Sync Performance**
   - **Risk:** May be slow or unreliable
   - **Mitigation:** Implement polling with reasonable intervals

2. **Mobile Responsiveness**
   - **Risk:** Complex calendar views on mobile
   - **Mitigation:** Test early, simplify mobile views if needed

---

## Success Criteria

### MVP Must-Have Checklist
- [ ] User can register and log in
- [ ] User can upload PDF/image syllabus
- [ ] System processes with NAVER AI (CLOVA OCR + Studio)
- [ ] Calendar auto-generates on successful parse
- [ ] Week-by-week view shows all weeks
- [ ] Month, Week, and Agenda views work
- [ ] User can edit assignments and set status/priority
- [ ] Reminders appear 3 days before deadlines
- [ ] User can export to iCal
- [ ] User can sync with Google Calendar (at least one-way)

### Nice-to-Have (If Time Permits)
- [ ] Two-way Google Calendar sync
- [ ] Advanced conflict resolution
- [ ] Course deletion
- [ ] Search functionality
- [ ] Dark mode

---

## Development Best Practices

### Code Quality
- Write clean, readable code
- Use TypeScript strictly
- Follow Next.js best practices
- Component-based architecture
- Reusable utilities and hooks

### Testing
- Test critical user flows manually
- Test on multiple browsers
- Test on mobile devices
- Test error scenarios

### Documentation
- Comment complex logic
- Document API endpoints
- Keep README updated
- Document NAVER AI integration

### Version Control
- Commit frequently with clear messages
- Use feature branches
- Keep main branch stable

---

## Weekly Checkpoints

**End of Week 2:** Foundation complete, can log in and see dashboard
**End of Week 4:** Can upload and process syllabus, see week-by-week view
**End of Week 6:** Full calendar views and assignment management working
**End of Week 8:** All features complete, ready for submission

---

## Post-Submission (If Time Permits)

- Advanced features (search, analytics)
- Performance optimizations
- Additional integrations
- User feedback incorporation
- Bug fixes and improvements

