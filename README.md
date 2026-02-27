# LIKELION x NYU — Web Frontend

Frontend repository for the NYU LikeLion community management platform.
Features event management, project showcase, QR-based attendance check-in, and an admin dashboard.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS 3 |
| Calendar | react-big-calendar |
| Date | date-fns |
| QR Code | qrcode |
| Build | Create React App (react-scripts) |
| Font | Zen Kaku Gothic Antique (Google Fonts) |

---

## Project Structure

```
src/
├── components/
│   ├── AdminNav.jsx          # Admin panel navigation with dropdown
│   ├── AdminRoute.jsx        # Protected route wrapper for admin pages
│   └── PublicNav.jsx         # Public navigation bar
│
├── pages/
│   ├── [Public]
│   │   ├── LandingPage.jsx   # Main landing page
│   │   ├── Login.jsx         # Login
│   │   ├── Signup.jsx        # Sign up with validation
│   │   ├── Attendance.jsx    # QR attendance check-in
│   │   ├── ProjectsPage.jsx  # Project showcase
│   │   └── EventsPage.jsx    # Event calendar
│   │
│   └── [Admin] (login + admin role required)
│       ├── AdminPage.jsx         # Admin dashboard home
│       ├── AdminQR.jsx           # Meeting QR code generator
│       ├── AdminUsers.jsx        # User management
│       ├── AdminCalendarPage.jsx # Event CRUD
│       ├── AdminProjects.jsx     # Project management
│       ├── AdminPhotos.jsx       # Photo upload & management
│       ├── AdminAttendance.jsx   # Attendance session tracking
│       └── AdminLanding.jsx      # Landing page content management
│
├── App.js         # Route configuration
├── ScrollToTop.js # Scroll to top on route change
├── index.js
└── index.css
```

---

## Pages & Routes

### Public

| Route | Description |
|-------|-------------|
| `/` | Landing page — admin card carousel, project showcase, footer |
| `/login` | Email & password login |
| `/signup` | User registration with validation |
| `/attendance?meeting_number={n}` | QR code attendance check-in |
| `/projects` | Full project list |
| `/events` | Event calendar (month / week / day / agenda views) |

### Admin (Protected)

| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard home |
| `/admin/qr` | Generate meeting QR codes |
| `/admin/users` | View & edit member accounts |
| `/admin/calendar` | Create / edit / delete events |
| `/admin/projects` | Manage projects |
| `/admin/photos` | Upload photos & link to members |
| `/admin/attendance` | Monitor attendance sessions |
| `/admin/landing` | Manage landing page admin cards |

---

## Key Features

### Landing Page
- LikeLion x NYU branded hero section
- Admin profile **flip cards** with hover animation (reveals description)
- Carousel navigation with arrow controls
- Community photo gallery & Instagram link

### Sign Up Validation
- Korean name: Korean characters only, max 10 chars
- English name: auto-capitalization, max 50 chars
- School email: `.edu` domain required
- Password: no spaces allowed
- Graduation year: 1950–2050
- University: NYU / SVA / Parsons / custom input
- Team: Study / Project / Other

### Event Calendar
Events are color-coded by category:

| Category | Color |
|----------|-------|
| Ideathon | Orange `#FF6000` |
| Project Meeting | Purple `#57068c` |
| Study | Green `#059669` |
| GM | Red `#DC2626` |
| Team Dinner | Blue `#2563EB` |
| Session | Purple `#9333EA` |

### Attendance System
1. Admin generates a QR code for a meeting at `/admin/qr`
2. Member scans QR → lands on `/attendance?meeting_number={n}`
3. Attendance is recorded automatically and a success popup is shown

### Project Showcase
- Project name, status (Planning / In Progress / Completed), team name
- Tech stack tags, team members, GitHub link, thumbnail image

---

## Design System

**Brand Colors**
- NYU Purple: `#57068c`
- LikeLion Orange: `#FF6000`

**Admin Dark Theme**
- Background: `#0a0a0a` / `#1a1a1a` / `#2a2a2a`

**Custom Animations**
- `button-pop` — vertical pop on button click (0.2s)
- `flip` / `flip-back` — 3D card flip (1s)

---

## Authentication & Sessions

- On login, `token`, `user`, and `tokenExpiry` are stored in `localStorage`
- Session duration: **1 hours**
- Admin routes are protected by the `AdminRoute` component (checks `is_admin` flag)
- Redirects to `/login` if session is expired or unauthorized

---

## Getting Started

### 1. Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
REACT_APP_API_URL=http://localhost:3000
```

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start development server (port 3001)
npm start

# Production build
npm run build

# Run tests
npm test
```

> The backend API server must be running before starting the app (default: `http://localhost:3000`).

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | Login |
| `POST` | `/api/user/signup` | Sign up |
| `GET` | `/api/admin-cards` | Fetch admin cards |
| `GET` | `/api/retrieve-all-projects` | Fetch all projects |
| `GET` | `/api/retrieve-all-photos` | Fetch all photos |
| `GET` | `/api/events?start=&end=` | Fetch events by date range |
| `POST` | `/api/attendance` | Record attendance |
| `GET` | `/api/qr-create?meeting_number=` | Create QR record |
| `GET` | `/api/adminpage/members_list` | Member list (admin) |
| `POST` | `/api/photos/upload` | Upload photo |
| `PUT` | `/api/photos/update` | Update photo metadata |
| `DELETE` | `/api/photos/delete` | Delete photo |

---

## Troubleshooting Git

```bash
git pull origin main --rebase
git push origin main
```
