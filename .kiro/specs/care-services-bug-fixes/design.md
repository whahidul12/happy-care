# Design Document: Care Services Bug Fixes

## Overview

This design addresses 10 critical bugs in the Next.js care services booking application. The fixes are categorized by priority:

**Critical (Must Fix First):**
- Missing globals.css import in layout.js
- Invalid JSX citation syntax in multiple files
- Hardcoded authentication bypass

**High Priority:**
- NextAuth cookie configuration mismatch
- Missing error handling for service not found
- Missing navigation links

**Medium Priority:**
- Incomplete email invoice functionality
- Missing styling on my-bookings page
- No data persistence for bookings
- Password validation regex mismatch

The design follows a systematic approach to fix each bug while maintaining code quality and ensuring all fixes are testable.

## Architecture

The application follows Next.js 13+ App Router architecture with the following structure:

```
src/
├── app/
│   ├── layout.js              # Root layout (needs CSS import)
│   ├── globals.css            # Tailwind CSS styles
│   ├── page.jsx               # Home page
│   ├── login/page.jsx         # Login page (has invalid JSX)
│   ├── register/page.jsx      # Register page (has invalid JSX)
│   ├── my-bookings/page.jsx   # Bookings list (has invalid JSX, no styling)
│   ├── booking/[service_id]/page.jsx  # Booking form (has invalid JSX, hardcoded auth)
│   ├── service/[service_id]/page.jsx  # Service details
│   └── api/
│       ├── auth/[...nextauth]/route.js  # NextAuth configuration
│       └── send-invoice/route.js        # Email invoice API
├── utils/
│   └── data.js                # Service data
└── middleware.js              # Route protection (wrong cookie name)
```

### Key Components

1. **Layout Component**: Root layout that wraps all pages
2. **Authentication System**: NextAuth with Google OAuth and credentials
3. **Middleware**: Route protection for private pages
4. **Booking System**: Service booking with cost calculation
5. **Email System**: Invoice delivery via nodemailer

## Components and Interfaces

### 1. Layout Component (src/app/layout.js)

**Current Issues:**
- Missing `import './globals.css'`
- Only has "Home" link in navigation
- Uses inline styles instead of Tailwind classes

**Fixed Interface:**
```javascript
import './globals.css';
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="p-5 border-b border-gray-300 flex gap-4">
          <Link href="/" className="text-blue-600 hover:underline">Home</Link>
          <Link href="/my-bookings" className="text-blue-600 hover:underline">My Bookings</Link>
          <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

### 2. JSX Citation Syntax Fixes

**Problem:** Invalid `[cite_start]` and `[cite: X]` markers in JSX comments

**Pattern to Remove:**
```javascript
// INVALID:
[cite_start]{/* Comment text [cite: 7] */}

// VALID:
{/* Comment text */}
```

**Files to Fix:**
- src/app/my-bookings/page.jsx (1 occurrence)
- src/app/login/page.jsx (1 occurrence)
- src/app/register/page.jsx (3 occurrences)
- src/app/booking/[service_id]/page.jsx (8 occurrences)

### 3. Authentication System

#### NextAuth Configuration

**Current Issue:** Middleware checks for `session_token` cookie, but NextAuth uses different cookie names by default.

**NextAuth Cookie Names:**
- Development: `next-auth.session-token`
- Production: `__Secure-next-auth.session-token`

**Fixed Middleware:**
```javascript
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
    // Use NextAuth's getToken to check for valid session
    const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
    });

    const isPrivateRoute =
        request.nextUrl.pathname.startsWith('/booking') ||
        request.nextUrl.pathname.startsWith('/my-bookings');

    if (isPrivateRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/booking/:path*', '/my-bookings/:path*'],
};
```

**Required Environment Variable:**
```
NEXTAUTH_SECRET=<generated-secret>
```

#### Hardcoded Authentication Fix

**Current Issue in booking/[service_id]/page.jsx:**
```javascript
const isAuthenticated = true; // Hardcoded!
```

**Fixed Approach:**
```javascript
import { useSession } from 'next-auth/react';

export default function BookingPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Rest of component...
}
```

**Required:** Wrap app with SessionProvider in layout.js

### 4. Error Handling

**Current Issue:** Booking page doesn't handle missing service properly

**Fixed Pattern (matching service detail page):**
```javascript
import { notFound } from 'next/navigation';

export default function BookingPage({ params }) {
  const service = servicesData.find((s) => s.id === params.service_id);

  if (!service) {
    return notFound();
  }

  // Rest of component...
}
```

### 5. Email Invoice Integration

**Current Issue:** API route exists but is never called (commented out)

**Fixed Integration:**
```javascript
const handleBooking = async () => {
  const bookingData = {
    serviceId: service.id,
    serviceName: service.name,
    duration,
    location,
    totalCost,
    status: "Pending",
  };

  console.log("Booking Saved:", bookingData);

  // Send email invoice
  try {
    const response = await fetch('/api/send-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userEmail: session.user.email,
        serviceName: service.name,
        totalCost,
        duration,
        location,
      }),
    });

    if (response.ok) {
      console.log('Invoice email sent successfully');
    }
  } catch (error) {
    console.error('Failed to send invoice:', error);
  }

  alert("Booking Confirmed!");
  router.push("/my-bookings");
};
```

### 6. My Bookings Page Styling

**Current Issue:** No CSS classes applied

**Fixed Component Structure:**
```javascript
return (
  <div className="container mx-auto p-8">
    <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left">Service Name</th>
            {/* ... other headers */}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-b hover:bg-gray-50">
              {/* ... table cells with styling */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
```

### 7. Data Persistence

**Current Issue:** Bookings only logged to console

**Design Decision:** Use localStorage for client-side persistence (suitable for MVP)

**Storage Interface:**
```javascript
// Save booking
const saveBooking = (bookingData) => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const newBooking = {
    ...bookingData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  return newBooking;
};

// Load bookings
const loadBookings = () => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('bookings') || '[]');
};
```

### 8. Password Validation Fix

**Current Issue:** Regex doesn't match the stated requirements

**Current (Incorrect) Regex:**
```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
```

**Analysis:** This regex is actually correct for the stated requirements (6+ chars, 1 uppercase, 1 lowercase). The issue is that the alert message might be misleading or there's confusion about what's required.

**Verification:** The regex correctly validates:
- `(?=.*[a-z])` - at least one lowercase letter
- `(?=.*[A-Z])` - at least one uppercase letter
- `.{6,}` - at least 6 characters total

**Conclusion:** No fix needed for regex. If there's an issue, it's in how the validation is communicated to users.

## Data Models

### Booking Data Model

```typescript
interface Booking {
  id: number;                    // Unique identifier (timestamp)
  serviceId: string;             // Reference to service
  serviceName: string;           // Service name for display
  duration: number;              // Hours booked
  location: {
    division: string;
    district: string;
    city: string;
    area: string;               // Address
  };
  totalCost: number;            // Calculated cost
  status: 'Pending' | 'Cancelled';
  createdAt: string;            // ISO timestamp
  userEmail?: string;           // User who made booking
}
```

### Service Data Model (Existing)

```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  chargePerHour: number;
}
```

### Session Data Model (NextAuth)

```typescript
interface Session {
  user: {
    name?: string;
    email?: string;
    image?: string;
  };
  expires: string;
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Tailwind CSS Classes Applied

*For any* UI element in the My_Bookings_Page, the rendered output should include appropriate Tailwind CSS class names for styling.

**Validates: Requirements 1.2**

### Property 2: Authenticated Middleware Access

*For any* authenticated user session and any protected route, the middleware should allow the request to proceed without redirection.

**Validates: Requirements 3.2**

### Property 3: Unauthenticated Middleware Redirect

*For any* unauthenticated request to a protected route, the middleware should redirect to the login page.

**Validates: Requirements 3.3**

### Property 4: Email Invoice Content

*For any* booking data, when the invoice API is called, the email should contain the service name, duration, location, and total cost from the booking.

**Validates: Requirements 5.2**

### Property 5: Booking Persistence Round Trip

*For any* valid booking data, saving the booking to storage and then loading bookings should return data that includes the saved booking with all its properties intact.

**Validates: Requirements 6.1, 6.2**

### Property 6: Password Validation Rules

*For any* password string, the validation should accept it if and only if it contains at least 6 characters, at least 1 uppercase letter, and at least 1 lowercase letter.

**Validates: Requirements 7.1, 7.3**

### Example Tests (Not Properties)

The following requirements are best tested with specific examples rather than property-based tests:

**Example 1: CSS Import Exists**
- Verify that layout.js contains `import './globals.css'`
- **Validates: Requirements 1.1**

**Example 2: Navigation Links Present**
- Verify that layout renders links to Home, My Bookings, and Login
- **Validates: Requirements 1.3**

**Example 3: JSX Files Compile**
- Verify that all JSX files compile without syntax errors
- Test files: my-bookings/page.jsx, login/page.jsx, register/page.jsx, booking/[service_id]/page.jsx
- **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

**Example 4: No Hardcoded Authentication**
- Verify that booking page uses `useSession()` instead of hardcoded `isAuthenticated = true`
- **Validates: Requirements 3.4**

**Example 5: Service Not Found Handling**
- Verify that booking page with invalid service ID calls `notFound()`
- **Validates: Requirements 4.1, 4.2**

**Example 6: Invoice API Called**
- Verify that confirming a booking triggers a fetch to `/api/send-invoice`
- **Validates: Requirements 5.1**

**Example 7: Success Logging**
- Verify that successful email send logs to console
- **Validates: Requirements 5.3**

**Example 8: Password Error Message**
- Verify that invalid password shows correct error message
- **Validates: Requirements 7.2**

## Error Handling

### 1. Missing Service Handling

**Error Condition:** User navigates to booking page with invalid service ID

**Handling:**
```javascript
if (!service) {
  return notFound(); // Next.js 404 page
}
```

### 2. Email Sending Failures

**Error Condition:** Email service fails or is misconfigured

**Handling:**
```javascript
try {
  const response = await fetch('/api/send-invoice', { /* ... */ });
  if (response.ok) {
    console.log('Invoice email sent successfully');
  } else {
    console.error('Failed to send invoice email');
    // Don't block booking - email is supplementary
  }
} catch (error) {
  console.error('Failed to send invoice:', error);
  // Don't block booking - email is supplementary
}
```

**Design Decision:** Email failures should not prevent booking completion. The booking is the primary operation; email is a nice-to-have notification.

### 3. Authentication Failures

**Error Condition:** User session expires or is invalid

**Handling:**
- Middleware redirects to login page
- Protected pages check session status and redirect if needed
- Show loading state while checking authentication

### 4. Storage Failures

**Error Condition:** localStorage is unavailable or quota exceeded

**Handling:**
```javascript
const saveBooking = (bookingData) => {
  try {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    return true;
  } catch (error) {
    console.error('Failed to save booking:', error);
    alert('Warning: Booking may not be saved locally');
    return false;
  }
};
```

### 5. Invalid Form Data

**Error Condition:** User submits booking with invalid data

**Handling:**
- Validate duration is positive number
- Validate all location fields are filled
- Show user-friendly error messages
- Prevent submission until valid

## Testing Strategy

### Dual Testing Approach

This project will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library:** We will use `fast-check` for property-based testing in this Next.js/JavaScript project.

**Configuration:**
- Each property test must run a minimum of 100 iterations
- Each test must be tagged with a comment referencing the design property
- Tag format: `// Feature: care-services-bug-fixes, Property {number}: {property_text}`

**Property Test Examples:**

```javascript
// Feature: care-services-bug-fixes, Property 6: Password Validation Rules
test('password validation accepts valid passwords and rejects invalid ones', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 6, maxLength: 20 }),
      fc.boolean(),
      fc.boolean(),
      (baseStr, hasUpper, hasLower) => {
        // Generate password with controlled characteristics
        let password = baseStr;
        if (hasUpper) password += 'A';
        if (hasLower) password += 'a';
        
        const isValid = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
        const shouldBeValid = hasUpper && hasLower && password.length >= 6;
        
        return isValid === shouldBeValid;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Framework:** Jest with React Testing Library

**Focus Areas:**
1. **CSS Import**: Verify layout.js imports globals.css
2. **JSX Compilation**: Verify all files compile without errors
3. **Navigation Links**: Verify correct links in layout
4. **Authentication**: Verify session checks work correctly
5. **Error Handling**: Verify 404 for missing services
6. **Email Integration**: Verify API is called with correct data
7. **Storage**: Verify bookings are saved and loaded correctly

**Unit Test Examples:**

```javascript
describe('Layout Component', () => {
  test('imports globals.css', () => {
    const layoutSource = fs.readFileSync('src/app/layout.js', 'utf-8');
    expect(layoutSource).toContain("import './globals.css'");
  });

  test('renders navigation links', () => {
    render(<RootLayout><div>Test</div></RootLayout>);
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
    expect(screen.getByText('My Bookings')).toHaveAttribute('href', '/my-bookings');
    expect(screen.getByText('Login')).toHaveAttribute('href', '/login');
  });
});

describe('Booking Page', () => {
  test('calls notFound for invalid service', () => {
    const notFoundMock = jest.fn();
    jest.mock('next/navigation', () => ({ notFound: notFoundMock }));
    
    render(<BookingPage params={{ service_id: 'invalid' }} />);
    expect(notFoundMock).toHaveBeenCalled();
  });

  test('calls invoice API on booking confirmation', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
    
    render(<BookingPage params={{ service_id: '1' }} />);
    const confirmButton = screen.getByText('Confirm Booking');
    await userEvent.click(confirmButton);
    
    expect(fetch).toHaveBeenCalledWith('/api/send-invoice', expect.any(Object));
  });
});
```

### Integration Testing

**Focus:** End-to-end flows after all fixes are applied

1. **Authentication Flow**: Login → Access protected page → Verify access
2. **Booking Flow**: Select service → Fill form → Confirm → Verify saved
3. **Email Flow**: Complete booking → Verify email API called
4. **Styling Flow**: Navigate pages → Verify Tailwind styles applied

### Manual Testing Checklist

After implementing all fixes:

1. ✓ Verify Tailwind styles render correctly on all pages
2. ✓ Verify navigation links work from layout
3. ✓ Verify middleware redirects unauthenticated users
4. ✓ Verify authenticated users can access booking page
5. ✓ Verify invalid service ID shows 404
6. ✓ Verify booking saves to localStorage
7. ✓ Verify my-bookings page displays saved bookings
8. ✓ Verify email invoice is sent (check console logs)
9. ✓ Verify password validation works correctly
10. ✓ Verify no JSX syntax errors in console
