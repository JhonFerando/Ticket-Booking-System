### Frontend
Path: `real-time-booking-system/frontend`

The frontend is a React.js-based web application providing a graphical interface for customers to book tickets.

#### Directory Structure
```
frontend/
├── idea/                   # Frontend-specific ideas
├── ticketing-system/       # Main application
│   ├── public/             # Static assets
│   └── src/                # React source files
│       ├── components/     # Reusable UI components
│       │   ├── Footer.jsx
│       │   ├── Navbar.jsx
│       │   └── Sidebar.jsx
│       ├── pages/          # Page-specific components
│       │   ├── AddConfiguration.js
│       │   ├── BuyTicket.js
│       │   ├── Home.js
│       │   ├── Register.js
│       │   ├── SignIn.js
│       │   ├── TicketLogs.js
│       │   ├── TicketReport.js
│       │   ├── UpdateSingleTicket.js
│       │   └── ViewAllTickets.js
│       ├── css/            # Styling
│       │   ├── Footer.css
│       │   ├── HomePage.css
│       │   ├── Navbar.css
│       │   ├── Responsive.css
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── .gitignore              # Ignored files for version control
├── README.md               # Frontend documentation
├── package-lock.json       # Dependency tree lock file
├── package.json            # Project metadata and dependencies
```

#### Key Files
- **App.js**: The main entry point of the React application.
- **components/**: Contains reusable components like `Navbar`, `Footer`, and `Sidebar`.
- **pages/**: Page-level components for distinct features like `Home`, `SignIn`, and `ViewAllTickets`.
- **css/**: Contains CSS files for styling individual components and pages.

#### Technologies Used
- **React.js**: Frontend library for building user interfaces.
- **CSS**: Styling for components and pages.
- **Axios**: Library for making API calls to the backend.

---

1. Navigate to the frontend directory:
   ```bash
   cd real-time-booking-system/frontend/ticketing-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
