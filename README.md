# Real-Time Booking System

## Overview
The **Real-Time Booking System** is a comprehensive application designed to streamline ticketing and booking processes. It features a robust backend, a user-friendly CLI for managing tickets, and a frontend interface for customer interactions. The project is organized into distinct components for modularity and scalability.

## Project Structure
### Root Directory
```
real-time-booking-system/
├── idea/                   # Initial ideas and brainstorming files
├── Backend/                # Backend logic and APIs
├── TicketingCLI/           # Command-line interface for ticket management
├── docs/                   # Documentation
├── frontend/               # Frontend application
├── README.md               # Project documentation
```

### Backend
Path: `real-time-booking-system/Backend`

The backend is a Node.js-based application providing APIs for managing customers, tickets, and vendors.

#### Directory Structure
```
Backend/
├── idea/                   # Backend-specific ideas and brainstorming
├── Configurations/         # Configuration files
│   └── ticket-configurations.json  # Ticket-related configurations
├── controllers/            # Business logic controllers
│   ├── Customer.js
│   ├── Ticket.js
│   ├── TicketPool.js
│   └── Vendor.js
├── database/               # Database connection and queries
│   └── database.js
├── middleware/             # Middleware for request handling
│   └── authenticateToken.js
├── models/                 # Data models
│   ├── Customer.js
│   ├── Ticket.js
│   └── Vendor.js
├── routes/                 # API routes
│   ├── customerRoutes.js
│   ├── ticketRoutes.js
│   └── vendorRoutes.js
├── test/                   # Unit tests
│   └── testTicketPool.js
├── .gitignore              # Ignored files for version control
├── README.md               # Backend documentation
├── package-lock.json       # Dependency tree lock file
├── package.json            # Project metadata and dependencies
└── server.js               # Application entry point
```

#### Key Files
- **server.js**: Entry point for starting the backend server.
- **controllers/**: Contains logic for processing customer, ticket, and vendor data.
- **routes/**: API endpoints for interacting with the system.
- **middleware/**: Middleware to authenticate requests.

#### Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: Database used for managing application data.
- **Mongoose**: ODM for MongoDB interactions.

---

### TicketingCLI
Path: `real-time-booking-system/TicketingCLI`

A Java-based command-line interface (CLI) for managing tickets and simulating booking events.

#### Directory Structure
```
TicketingCLI/
├── config/                  # Configuration files
│   ├── configuration.json
│   └── ticket-configuration.json
├── src/                     # Source code
│   ├── main/java/com/realtime/ticketing/
│   │   ├── controller/      # Controllers for CLI interactions
│   │   │   ├── MenuManager.java
│   │   │   └── SimulationManager.java
│   │   ├── model/           # Data models
│   │   │   ├── Configuration.java
│   │   │   ├── ConfigurationHandler.java
│   │   │   ├── Customer.java
│   │   │   ├── Vendor.java
│   │   │   └── TicketPool.java
│   │   ├── util/            # Utilities
│   │   │   └── LoggerUtil.java
│   │   └── TicketingApplication.java        # Application entry point
│   └── test/                # Unit tests
│       ├── controller/
│       │   ├── MenuManagerTest.java
│       │   └── SimulationManagerTest.java
│       ├── model/
│       │   ├── ConfigurationHandlerTest.java
│       │   └── TicketPoolTest.java
│       └── util/
│           └── LoggerUtilTest.java
├── README.md                # CLI documentation
└── LICENSE                  # License file
```

#### Key Files
- **TicketingApplication.java**: Entry point for the CLI application.
- **MenuManager.java**: Handles user interaction and menu navigation.
- **SimulationManager.java**: Simulates ticket booking events.
- **TicketPool.java**: Manages the pool of available tickets.

#### Technologies Used
- **Java**: Programming language for the CLI application.
- **JSON**: Configuration file format.

---

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

## Installation and Execution
### System Requirements
- **Node.js**: v14.17.0 or higher
- **Java**: JDK 11 or higher
- **MongoDB**: v4.4 or higher
- **npm**: v6.14.13 or higher

### Backend
1. Navigate to the backend directory:
   ```bash
   cd real-time-booking-system/Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```

### CLI
1. Navigate to the CLI directory:
   ```bash
   cd real-time-booking-system/TicketingCLI
   ```
2. Compile the Java source code:
   ```bash
   javac src/main/java/com/realtime/ticketing/TicketingApplication.java
   ```
3. Run the application:
   ```bash
   java src/main/java/com/realtime/ticketing/TicketingApplication
   ```

### Frontend
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

---

## Summary of Pages
- **AddConfiguration.js**: Page to add ticket-related configurations.
- **BuyTicket.js**: Interface for users to purchase tickets.
- **Home.js**: Landing page displaying system overview.
- **Register.js**: User registration page.
- **SignIn.js**: User login interface.
- **TicketLogs.js**: Displays logs related to ticket bookings.
- **TicketReport.js**: Provides ticket usage and sales reports.
- **UpdateSingleTicket.js**: Edit specific ticket information.
- **ViewAllTickets.js**: Displays all available tickets.

---

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes with clear messages:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push your branch and submit a pull request.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.

---
## Author

- **Name**: Ravindran Dharshan
- **GitHub**: [https://github.com/DharshanSR](https://github.com/DharshanSR)

---
