# RosterView

**Know where your class is** - A real-time student status tracking system for educators.

RosterView is a full-stack application that helps teachers, administrators, and ISS coordinators track student status (at school, at home, or in ISS) in real-time.

## Features

- **Teacher Dashboard**: View all classes with quick status overview
- **Class Management**: Detailed class view with all enrolled students
- **Student Status Tracking**: Mark students as at school, at home, or in ISS with optional notes
- **ISS Tracking**: Track in-school suspension records
- **Role-Based Access**: Teacher, Admin, Parent, and ISS Coordinator roles
- **Mock Authentication**: Test accounts with different permission levels
- **API Ready**: Backend prepared for integration with Infinite Campus and Canvas LMS

## Project Structure

```
rosterview/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── config/      # Database and app config
│   │   ├── db/          # Database schema and seeds
│   │   ├── middleware/  # Auth and other middleware
│   │   ├── models/      # Data models
│   │   ├── routes/      # API endpoints
│   │   └── server.js    # Main app file
│   ├── package.json
│   └── .env.example
├── frontend/            # React web application
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── styles/      # CSS styles
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   ├── package.json
│   └── .env.example
├── package.json         # Root workspace config
└── README.md
```

## Tech Stack

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React 18, React Router, Axios
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL SQL; built-in PGlite for development, any PostgreSQL server via `DATABASE_URL`
- **Styling**: CSS3 with custom design system

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- That's it. No database to install: RosterView uses a built-in database (PGlite) that starts with the app and loads the sample data automatically.

### Installation

1. **Get the code** (or open the repo in GitHub Codespaces)
   ```bash
   git clone https://github.com/eliglancy-ui/RosterView.git
   cd RosterView
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This starts the backend (port 5000) and the website (port 3000). Open port 3000 and sign in with a demo account below.

   The sample data resets each time you start the app, so status changes you make are not kept between runs.

### Using a real PostgreSQL database (optional)

Create `backend/.env` with a `DATABASE_URL` and the app will use that server instead of the built-in one:
```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/rosterview_dev
```
Then load `backend/src/db/schema.sql` and `backend/src/db/seed.sql` into it once with `psql`.

### Running Separately

**Start backend only:**
```bash
npm run dev --workspace=backend
# or
cd backend && npm run dev
```

**Start frontend only:**
```bash
npm run dev --workspace=frontend
# or
cd frontend && npm run dev
```

## Demo Accounts

Use these credentials to test different roles. Password for all: `password`

| Email | Role | Access |
|-------|------|--------|
| teacher1@wcpss.edu | Teacher | View/manage own classes |
| teacher2@wcpss.edu | Teacher | View/manage own classes |
| admin@wcpss.edu | Admin | View all classes |
| parent@example.com | Parent | View student's classes |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Classes
- `GET /api/classes` - Get all classes for teacher
- `GET /api/classes/:classId` - Get class details with students

### Students
- `PUT /api/students/:studentId/status` - Update student status
- `GET /api/students/:studentId` - Get student details

## Database Schema

### Main Tables
- **teachers**: User accounts for teachers, admins, coordinators
- **classes**: Course/class information linked to teachers
- **students**: Student information
- **enrollments**: Many-to-many relationship between classes and students
- **student_status**: Daily status tracking (school/home/iss)
- **iss_records**: In-School Suspension tracking

## Future Integrations

The backend is structured to easily integrate with:

- **Infinite Campus API**: Student enrollment and information
- **Canvas LMS API**: Class roster and gradebook sync
- **SSO Systems**: SAML or OAuth for enterprise auth

API keys for these services are ready in the configuration but currently use demo/simulated data.

## Deployment

The application is ready for deployment to:

- **Vercel**: Optimized for React frontend (see `vercel.json` template)
- **Heroku**: Both frontend and backend
- **Railway**: Docker-based deployment
- **AWS**: ECS, Lambda, or EC2

### Environment Variables for Production

Backend:
```
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=rosterview
DB_USER=postgres
DB_PASSWORD=your-secure-password
PORT=5000
NODE_ENV=production
JWT_SECRET=generate-a-long-random-secret-string
API_BASE_URL=https://api.rosterview.com
FRONTEND_URL=https://rosterview.com
```

Frontend:
```
REACT_APP_API_BASE_URL=https://api.rosterview.com
```

## Development Notes

- **Mock Data Only**: All data is sample/mock data. No real student information is stored.
- **Clear File Structure**: Every component has a clear purpose and location
- **Comments**: Key functions include comments for easy understanding
- **Error Handling**: API errors are caught and displayed to the user
- **Responsive Design**: Frontend works on desktop, tablet, and mobile

## Security Considerations

Current implementation uses:
- JWT tokens for stateless authentication
- Password hashing with bcryptjs
- CORS configuration
- HTTP-only cookie support ready (can be enabled)

For production, consider:
- HTTPS only
- Rate limiting on auth endpoints
- Refresh token implementation
- Audit logging for all status changes
- Row-level security in database
- Regular security audits

## Testing

```bash
# Run backend tests
npm test --workspace=backend

# Run frontend tests
npm test --workspace=frontend
```

## Contributing

The codebase is structured to be easy to extend:

1. **Adding new roles**: Modify middleware and add role checks
2. **Adding new status types**: Update database schema and student status endpoints
3. **Adding new reports**: Create new route files in backend and components in frontend
4. **API integrations**: Existing placeholder for external API clients

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ for educators. **Know where your class is.**
