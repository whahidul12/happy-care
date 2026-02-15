# Implementation Plan: Care Services Bug Fixes

## Overview

This implementation plan addresses 10 critical bugs in the Next.js care services booking application. The fixes are organized by priority, starting with critical issues that prevent the application from functioning correctly, followed by high-priority functionality gaps, and finally medium-priority enhancements.

The implementation follows a systematic approach: fix critical syntax and configuration issues first, then add missing functionality, and finally enhance the user experience with styling and data persistence.

## Tasks

- [x] 1. Fix critical CSS and JSX syntax issues
  - [x] 1.1 Add globals.css import to layout.js
    - Add `import './globals.css';` at the top of src/app/layout.js
    - Verify Tailwind CSS styles are now applied across the application
    - _Requirements: 1.1_

  - [x] 1.2 Remove invalid JSX citation syntax from all files
    - Remove all `[cite_start]` and `[cite: X]` markers from JSX comments
    - Fix src/app/my-bookings/page.jsx (1 occurrence)
    - Fix src/app/login/page.jsx (1 occurrence)
    - Fix src/app/register/page.jsx (3 occurrences)
    - Fix src/app/booking/[service_id]/page.jsx (8 occurrences)
    - Pattern: Replace `[cite_start]{/* Comment */}` with `{/* Comment */}`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 1.3 Write unit test to verify JSX files compile
    - Test that all fixed JSX files compile without syntax errors
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Fix authentication system
  - [x] 2.1 Update middleware to use NextAuth token checking
    - Replace cookie check with `getToken` from 'next-auth/jwt'
    - Import and use `getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })`
    - Update middleware.js to properly check for NextAuth session
    - _Requirements: 3.1_

  - [x] 2.2 Add NEXTAUTH_SECRET to environment configuration
    - Document the required NEXTAUTH_SECRET environment variable
    - Add example to .env.local.example if it exists
    - _Requirements: 3.1_

  - [x] 2.3 Fix hardcoded authentication in booking page
    - Replace `const isAuthenticated = true;` with `useSession()` hook
    - Import `useSession` from 'next-auth/react'
    - Update authentication check to use `status === 'unauthenticated'`
    - Add loading state handling for `status === 'loading'`
    - _Requirements: 3.4_

  - [x] 2.4 Wrap application with SessionProvider
    - Update layout.js to include NextAuth SessionProvider
    - Ensure SessionProvider wraps the children component
    - _Requirements: 3.1, 3.4_

  - [ ]* 2.5 Write property test for middleware authentication
    - **Property 2: Authenticated Middleware Access**
    - **Property 3: Unauthenticated Middleware Redirect**
    - Test that authenticated requests are allowed and unauthenticated requests are redirected
    - _Requirements: 3.2, 3.3_

- [x] 3. Checkpoint - Ensure authentication works
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Add error handling and navigation
  - [x] 4.1 Add notFound handling to booking page
    - Import `notFound` from 'next/navigation'
    - Add check: `if (!service) return notFound();`
    - Match the pattern used in service/[service_id]/page.jsx
    - _Requirements: 4.1, 4.2_

  - [x] 4.2 Add navigation links to layout
    - Update nav in layout.js to include Home, My Bookings, and Login links
    - Apply Tailwind CSS classes to navigation
    - Replace inline styles with Tailwind classes
    - _Requirements: 1.3_

  - [ ]* 4.3 Write unit tests for error handling and navigation
    - Test that invalid service ID triggers notFound()
    - Test that navigation links are rendered with correct hrefs
    - _Requirements: 1.3, 4.1, 4.2_

- [x] 5. Implement email invoice functionality
  - [x] 5.1 Integrate invoice API call in booking page
    - Uncomment and fix the email invoice code in handleBooking
    - Add fetch call to '/api/send-invoice' with booking data
    - Include userEmail from session.user.email
    - Add error handling with try-catch
    - Log success/failure to console
    - _Requirements: 5.1, 5.3_

  - [ ]* 5.2 Write property test for email invoice content
    - **Property 4: Email Invoice Content**
    - Test that invoice API receives correct booking data
    - Mock the API and verify parameters
    - _Requirements: 5.2_

- [x] 6. Add styling to my-bookings page
  - [x] 6.1 Apply Tailwind CSS classes to my-bookings page
    - Add container and layout classes
    - Style the table with Tailwind classes
    - Add responsive design classes
    - Match styling pattern from service detail page
    - _Requirements: 1.2_

  - [ ]* 6.2 Write property test for CSS classes
    - **Property 1: Tailwind CSS Classes Applied**
    - Test that UI elements have appropriate Tailwind classes
    - _Requirements: 1.2_

- [x] 7. Implement data persistence
  - [x] 7.1 Create localStorage utility functions
    - Create saveBooking function to persist bookings
    - Create loadBookings function to retrieve bookings
    - Add error handling for localStorage failures
    - Generate unique IDs using Date.now()
    - _Requirements: 6.1, 6.2_

  - [x] 7.2 Update booking page to save bookings
    - Call saveBooking in handleBooking function
    - Replace console.log with actual persistence
    - _Requirements: 6.1_

  - [x] 7.3 Update my-bookings page to load from storage
    - Replace initialBookings with loadBookings() call
    - Use useEffect to load bookings on mount
    - Handle empty state when no bookings exist
    - _Requirements: 6.2_

  - [ ]* 7.4 Write property test for booking persistence
    - **Property 5: Booking Persistence Round Trip**
    - Test that saved bookings can be retrieved with all properties intact
    - _Requirements: 6.1, 6.2_

- [x] 8. Verify password validation
  - [x] 8.1 Review and document password validation regex
    - Verify the regex correctly validates 6+ chars, 1 uppercase, 1 lowercase
    - Ensure error message matches validation rules
    - Add comments explaining the regex pattern
    - _Requirements: 7.1, 7.2, 7.3_

  - [ ]* 8.2 Write property test for password validation
    - **Property 6: Password Validation Rules**
    - Test that validation accepts valid passwords and rejects invalid ones
    - Generate various password combinations
    - _Requirements: 7.1, 7.3_

- [x] 9. Final checkpoint - Integration testing
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all bugs are fixed
  - Test authentication flow end-to-end
  - Test booking flow with email and persistence
  - Verify styling on all pages

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Critical fixes (tasks 1-2) should be completed first
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The password validation regex is actually correct; task 8.1 is verification only
