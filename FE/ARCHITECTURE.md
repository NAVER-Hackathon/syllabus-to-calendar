# Frontend Architecture Design
## Syllabus to Calendar Application

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **State Management**: React Context + Zustand (for complex state)
- **Form Handling**: React Hook Form + Zod
- **File Upload**: react-dropzone or similar
- **PDF Processing**: pdf.js or similar (client-side preview)
- **Date Management**: date-fns or dayjs
- **Calendar View**: FullCalendar or custom with shadcn/ui components

---

## 1. Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected routes
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard home
│   │   ├── courses/
│   │   │   ├── page.tsx          # Course list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # Course detail
│   │   │   │   └── edit/
│   │   │   └── new/
│   │   │       └── page.tsx      # New course wizard
│   │   ├── calendar/
│   │   │   └── page.tsx          # Calendar view
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── upload/
│   │   ├── parse-syllabus/
│   │   └── courses/
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── CourseForm.tsx
│   │   ├── SyllabusUpload.tsx
│   │   ├── WeekView.tsx
│   │   ├── WeekCard.tsx
│   │   └── AssignmentCard.tsx
│   ├── calendar/
│   │   ├── CalendarView.tsx
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   └── AgendaView.tsx
│   ├── upload/
│   │   ├── FileDropzone.tsx
│   │   ├── PDFPreview.tsx
│   │   └── ImagePreview.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── utils.ts                  # Utility functions
│   ├── cn.ts                     # className utility
│   ├── api.ts                    # API client
│   ├── pdf-parser.ts             # PDF parsing utilities
│   ├── image-processor.ts        # Image processing utilities
│   └── date-utils.ts             # Date manipulation
├── hooks/
│   ├── useCourse.ts
│   ├── useCalendar.ts
│   ├── useFileUpload.ts
│   └── useSyllabusParser.ts
├── store/
│   ├── courseStore.ts            # Zustand store for courses
│   ├── calendarStore.ts          # Calendar state
│   └── uiStore.ts                # UI state (modals, sidebar)
├── types/
│   ├── course.ts
│   ├── calendar.ts
│   ├── syllabus.ts
│   └── api.ts
└── constants/
    ├── routes.ts
    └── config.ts
```

---

## 2. Core Features & User Flows

### Primary User Flow
1. **Upload Syllabus** → Parse → Extract course info
2. **Review & Edit** → Confirm extracted data
3. **Generate Calendar** → Create week-by-week plan
4. **View & Manage** → Calendar view, edit deadlines, add milestones

### Key Features
- **Multi-format Upload**: PDF, images (screenshots), text
- **Intelligent Parsing**: Extract dates, assignments, readings
- **Week-by-Week Breakdown**: Automatic organization
- **Calendar Integration**: Multiple views (month, week, agenda)
- **Deadline Management**: Visual indicators, reminders
- **Milestone Tracking**: Major assignments, exams
- **Export Options**: iCal, Google Calendar, PDF

---

## 3. Component Architecture

### 3.1 Layout Components

**Sidebar Navigation**
- Course list (collapsible)
- Quick filters (upcoming deadlines, this week)
- Calendar view toggle
- Settings link

**Header**
- Search bar
- Notifications (upcoming deadlines)
- User profile menu
- Theme toggle

### 3.2 Course Management Components

**CourseCard**
- Course name, code, term
- Progress indicator
- Quick stats (assignments due, readings)
- Actions (edit, delete, view calendar)

**SyllabusUpload**
- Drag-and-drop zone
- File type validation
- Preview before upload
- Progress indicator
- Error handling

**WeekView**
- Week selector (dropdown or date picker)
- Week cards showing:
  - Dates (Mon-Sun)
  - Assignments with deadlines
  - Readings
  - Milestones
- Expandable details

### 3.3 Calendar Components

**CalendarView** (Main container)
- View switcher (Month/Week/Agenda)
- Date navigation
- Filter options

**MonthView**
- Grid layout with days
- Color-coded courses
- Deadline indicators
- Click to view details

**WeekView**
- Timeline view
- Grouped by day
- Drag-and-drop for rescheduling

**AgendaView**
- List of upcoming items
- Sorted by date
- Grouped by course

---

## 4. State Management Strategy

### Local State (useState)
- Form inputs
- UI toggles (modals, dropdowns)
- Temporary selections

### Context API
- **AuthContext**: User authentication state
- **ThemeContext**: Dark/light mode
- **ToastContext**: Notification system

### Zustand Stores
- **courseStore**: 
  - Courses list
  - Current course
  - CRUD operations
  - Optimistic updates
  
- **calendarStore**:
  - Calendar events
  - Selected date range
  - View preferences
  - Filters

- **uiStore**:
  - Sidebar open/closed
  - Active modals
  - Loading states

### Server State (React Query / SWR)
- API data fetching
- Caching
- Background refetching
- Optimistic updates

---

## 5. Data Models

### Course
```typescript
interface Course {
  id: string;
  name: string;
  code: string;
  term: string;
  instructor: string;
  startDate: Date;
  endDate: Date;
  weeks: Week[];
  color: string; // For calendar visualization
  createdAt: Date;
  updatedAt: Date;
}
```

### Week
```typescript
interface Week {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  assignments: Assignment[];
  readings: Reading[];
  milestones: Milestone[];
  notes?: string;
}
```

### Assignment
```typescript
interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  courseId: string;
  weekNumber: number;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
}
```

### Reading
```typescript
interface Reading {
  id: string;
  title: string;
  type: 'textbook' | 'article' | 'video' | 'other';
  pages?: string;
  url?: string;
  dueDate?: Date;
  weekNumber: number;
  courseId: string;
}
```

---

## 6. Routing Strategy

### App Router Structure
- **Public Routes**: `/login`, `/register`
- **Protected Routes**: All under `(dashboard)` group
- **Dynamic Routes**: `/courses/[id]`, `/courses/[id]/edit`
- **API Routes**: `/api/*` for backend communication

### Route Protection
- Middleware for authentication
- Layout-based protection for dashboard routes
- Redirect to login if unauthenticated

---

## 7. File Upload & Processing Flow

### Upload Component Flow
1. **FileDropzone**: Accept files (PDF, images)
2. **Validation**: Check file type, size
3. **Preview**: Show file preview before processing
4. **Upload**: Send to `/api/upload` endpoint
5. **Processing**: Backend processes and extracts data
6. **Review**: Show extracted data in editable form
7. **Confirm**: Save to database

### Client-Side Processing
- PDF preview using pdf.js
- Image preview and basic OCR (if needed)
- Client-side validation before upload

---

## 8. UI/UX Design Principles

### Visual Hierarchy
- **Primary Actions**: Prominent buttons, clear CTAs
- **Information Density**: Progressive disclosure
- **Color Coding**: Per-course colors for quick identification
- **Status Indicators**: Clear visual feedback for deadlines

### Responsive Design
- **Mobile First**: Optimize for mobile, enhance for desktop
- **Breakpoints**: sm, md, lg, xl (Tailwind defaults)
- **Touch Targets**: Minimum 44x44px for mobile
- **Collapsible Sidebar**: Hidden on mobile, toggleable

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states

### Performance
- **Code Splitting**: Route-based and component-based
- **Lazy Loading**: Heavy components (PDF viewer, calendar)
- **Image Optimization**: Next.js Image component
- **Memoization**: React.memo for expensive components

---

## 9. Key Technical Decisions

### 9.1 Form Management
- **React Hook Form**: For complex forms (course creation, editing)
- **Zod**: Schema validation, type-safe
- **shadcn/ui Form**: Built on RHF, consistent styling

### 9.2 Date Handling
- **date-fns**: Lightweight, tree-shakeable
- **Timezone**: Store in UTC, display in user's timezone
- **Date Pickers**: shadcn/ui Calendar component

### 9.3 PDF Processing
- **Client-side**: pdf.js for preview
- **Server-side**: Actual parsing (Python service or API)
- **Fallback**: Manual entry if parsing fails

### 9.4 Calendar Library
- **Option 1**: FullCalendar (feature-rich, but heavy)
- **Option 2**: Custom with shadcn/ui (lighter, more control)
- **Recommendation**: Start custom, migrate if needed

### 9.5 State Synchronization
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Rollback on failure
- **Background Sync**: Periodic updates for deadlines

---

## 10. API Integration Strategy

### API Client Structure
```typescript
// lib/api.ts
class ApiClient {
  // Courses
  getCourses()
  getCourse(id)
  createCourse(data)
  updateCourse(id, data)
  deleteCourse(id)
  
  // Upload & Parsing
  uploadFile(file)
  parseSyllabus(fileId)
  
  // Calendar
  getCalendarEvents(dateRange)
  updateEvent(eventId, data)
}
```

### Error Handling
- **Global Error Boundary**: Catch React errors
- **API Error Handling**: Consistent error format
- **User Feedback**: Toast notifications for errors
- **Retry Logic**: For failed requests

---

## 11. Styling Approach

### Tailwind Configuration
- **Custom Colors**: Course color palette
- **Spacing Scale**: Consistent spacing system
- **Typography**: Custom font sizes for headings
- **Dark Mode**: Full dark mode support

### Component Styling
- **shadcn/ui Base**: Start with shadcn components
- **Custom Variants**: Extend with Tailwind variants
- **Consistent Spacing**: Use Tailwind spacing scale
- **Responsive Utilities**: Mobile-first approach

---

## 12. Testing Strategy

### Unit Tests
- Utility functions
- Custom hooks
- Pure components

### Integration Tests
- Form submissions
- API interactions
- User flows

### E2E Tests
- Critical paths (upload → parse → view)
- Calendar interactions
- Course management

---

## 13. Performance Optimization

### Code Splitting
- Route-based splitting (automatic with App Router)
- Component lazy loading for heavy components
- Dynamic imports for PDF viewer

### Caching Strategy
- **Static Assets**: Long-term caching
- **API Responses**: React Query cache
- **Client State**: Zustand persistence

### Bundle Size
- **Tree Shaking**: Remove unused code
- **Analyze Bundle**: Regular bundle analysis
- **Optimize Dependencies**: Choose lightweight alternatives

---

## 14. Development Workflow

### Recommended Setup
1. **Next.js 14+** with App Router
2. **TypeScript** strict mode
3. **ESLint + Prettier** for code quality
4. **Husky** for pre-commit hooks
5. **Conventional Commits** for version control

### Component Development
- **Storybook** (optional): For component development
- **Component Library**: shadcn/ui as base
- **Design System**: Document component usage

---

## 15. Future Enhancements

### Phase 2 Features
- **AI-Powered Parsing**: Better extraction accuracy
- **Collaboration**: Share calendars with classmates
- **Notifications**: Email/push notifications for deadlines
- **Analytics**: Time tracking, productivity insights
- **Integrations**: Google Calendar, Notion, etc.

### Scalability Considerations
- **Pagination**: For large course lists
- **Virtualization**: For long calendar views
- **Caching**: Aggressive caching for performance
- **CDN**: For static assets

---

## 16. Implementation Priority

### MVP (Minimum Viable Product)
1. ✅ File upload (PDF, images)
2. ✅ Basic syllabus parsing
3. ✅ Course creation/editing
4. ✅ Week-by-week view
5. ✅ Simple calendar view
6. ✅ Deadline tracking

### Phase 1
1. Enhanced calendar views (month, week, agenda)
2. Drag-and-drop rescheduling
3. Export to iCal
4. Better parsing accuracy

### Phase 2
1. AI-powered extraction
2. Collaboration features
3. Notifications
4. Analytics dashboard

---

## Recommendations Summary

1. **Start Simple**: Build MVP with core features first
2. **Use shadcn/ui**: Leverage existing components, customize as needed
3. **Type Safety**: Strict TypeScript, Zod for runtime validation
4. **State Management**: Start with Context + useState, add Zustand when needed
5. **Performance**: Lazy load heavy components, optimize images
6. **User Experience**: Focus on clear visual hierarchy and feedback
7. **Accessibility**: Build with a11y in mind from the start
8. **Testing**: Write tests for critical paths early

---

This architecture provides a solid foundation for building a scalable, maintainable, and user-friendly application. Adjust based on your specific requirements and constraints.

