# Project Summary
## Syllabus to Calendar Application

### Quick Reference

This document provides a high-level overview of the project. For detailed information, see:
- **REQUIREMENTS.md** - Complete product requirements
- **ARCHITECTURE.md** - Technical architecture and design
- **USER_STORIES.md** - Detailed user stories
- **DEVELOPMENT_PLAN.md** - 8-week development roadmap

---

## Project Overview

**Goal:** Build a web application that converts course syllabi (PDFs/images) into organized, week-by-week calendar plans using NAVER AI.

**Target Users:** Undergraduate and graduate students (single user)

**Tech Stack:**
- Next.js 14+ (App Router)
- React 18+ with TypeScript
- Tailwind CSS + shadcn/ui
- NAVER AI: CLOVA OCR + CLOVA Studio
- Database (PostgreSQL/MongoDB)
- Google Calendar API

**Deadline:** November 21, 2025

---

## Core Features

### 1. Syllabus Processing
- ✅ Upload PDF/images (bulk upload supported)
- ✅ NAVER AI extraction (CLOVA OCR + CLOVA Studio)
- ✅ Binary accept/reject (no review step)
- ✅ Manual entry fallback

### 2. Calendar Generation
- ✅ Week-by-week view (Monday-Sunday, all weeks visible)
- ✅ Month, Week, and Agenda views
- ✅ Unified calendar (all courses together)
- ✅ Color coding by course

### 3. Assignment Management
- ✅ Edit parsed data after import
- ✅ Status tracking (pending/in-progress/completed)
- ✅ Priority levels (low/medium/high)
- ✅ In-app reminders (3 days before)

### 4. Integration & Export
- ✅ iCal export (.ics file)
- ✅ Google Calendar two-way real-time sync
- ✅ OAuth authentication

### 5. User System
- ✅ User accounts required
- ✅ Database persistence
- ✅ Session management

---

## Key Technical Decisions

### State Management
- **Local State:** useState for UI toggles, forms
- **Context API:** Auth, theme, notifications
- **Zustand:** Complex state (courses, calendar, UI)
- **React Query/SWR:** Server state, caching

### Data Extraction
- **CLOVA OCR:** Text extraction from images/PDFs
- **CLOVA Studio:** Structured data extraction
- **Extracted Data:**
  - Assignment names and due dates
  - Exam dates
  - Class schedule (meeting times)
  - Project deadlines

### Calendar Views
- **Month View:** Grid layout, full month overview
- **Week View:** Timeline, focused week
- **Agenda View:** List of upcoming items

### Google Calendar Sync
- **Two-way real-time sync**
- **OAuth authentication**
- **Conflict resolution:** Timestamp-based or last-write-wins

---

## Development Timeline

### Phase 1: Foundation (Weeks 1-2)
- Project setup
- Authentication
- Database schema
- Base UI components

### Phase 2: Core Features (Weeks 3-4)
- File upload
- NAVER AI integration
- Parsing logic
- Week-by-week view

### Phase 3: Calendar & Management (Weeks 5-6)
- Calendar views (Month, Week, Agenda)
- Status & priority tracking
- Reminder system
- Edit functionality

### Phase 4: Integration & Polish (Weeks 7-8)
- Google Calendar sync
- iCal export
- UI/UX polish
- Testing & bug fixes

---

## Success Criteria

### MVP Requirements
1. ✅ User authentication
2. ✅ File upload (PDF/images)
3. ✅ NAVER AI processing
4. ✅ Week-by-week view
5. ✅ Calendar views (all three)
6. ✅ Assignment management
7. ✅ Reminders
8. ✅ iCal export
9. ✅ Google Calendar sync (at least one-way)

### Success Metrics
- **UI/UX:** Clean, intuitive interface
- **NAVER AI Usage:** Effective integration of CLOVA OCR + Studio
- **Functionality:** All core features working
- **Performance:** Fast upload and processing

---

## Risk Areas

1. **NAVER AI Integration**
   - Complex API integration
   - Parsing accuracy
   - **Mitigation:** Early integration, manual entry fallback

2. **Two-Way Google Calendar Sync**
   - Conflict resolution complexity
   - Real-time sync reliability
   - **Mitigation:** Start with one-way, add two-way if time permits

3. **Timeline**
   - 8 weeks is tight for full feature set
   - **Mitigation:** Prioritize MVP features, cut nice-to-haves if needed

---

## File Structure Overview

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── course/           # Course-related components
│   ├── calendar/         # Calendar views
│   └── upload/           # Upload components
├── lib/                  # Utilities, API clients
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
├── types/                # TypeScript types
└── constants/            # Constants and config
```

---

## Next Steps

1. ✅ **Requirements gathered** - Complete
2. ✅ **Architecture designed** - Complete
3. ✅ **User stories defined** - Complete
4. ✅ **Development plan created** - Complete
5. **Set up NAVER Cloud Platform account** - Get API credentials
6. **Initialize project** - Start Phase 1, Week 1
7. **Begin development** - Follow development plan

---

## Key Contacts & Resources

### NAVER AI Services
- **CLOVA OCR:** Document text extraction
- **CLOVA Studio:** Structured data extraction
- **Documentation:** Check NAVER Cloud Platform docs

### Google Calendar API
- **OAuth 2.0:** Authentication
- **Calendar API:** Event creation and sync
- **Documentation:** developers.google.com/calendar

---

## Notes

- Focus on MVP features first
- Test NAVER AI integration early
- Keep UI/UX simple and intuitive
- Prioritize core functionality over nice-to-haves
- Document API integrations well
- Test on multiple browsers and devices

---

**Last Updated:** Based on requirements gathering session
**Status:** Ready for development

