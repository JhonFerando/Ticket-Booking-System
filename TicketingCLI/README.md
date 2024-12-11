# Ticketing CLI Application

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Folder Structure](#folder-structure)
5. [How to Run the Project](#how-to-run-the-project)
6. [Contributing](#contributing)
7. [License](#license)

---

## Introduction

The **Ticketing CLI Application** is a Java-based console application designed for real-time event ticketing. It provides users with a straightforward way to book, cancel, and view tickets for various events. This project demonstrates advanced usage of Java concepts like **Object-Oriented Programming (OOP)**, **concurrency**, and **file handling**, making it ideal for both learning and practical use.

---

## Features

- **User-Friendly CLI**: Intuitive command-line interface for seamless interaction.
- **Event Management**: Add, update, and delete events.
- **Real-Time Booking**: Book tickets with immediate confirmation.
- **Multi-threading Support**: Ensures smooth performance even with multiple users.
- **Data Persistence**: Save and load event and booking data using file handling.
- **Error Handling**: Robust validation and error reporting.

---

## Technologies Used

- **Programming Language**: Java
- **Frameworks/Libraries**: None (pure Java for simplicity)
- **File Handling**: For data persistence (using `.txt` or `.json` files)
- **Concurrency**: Multi-threading for producer-consumer implementation

---

## Folder Structure

```plaintext
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
---

# How to Run the Project

## Prerequisites
- Ensure **Java 17** (or later) is installed.
- Verify your terminal or IDE supports running Java programs.

## Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/DharshanSR/TicketingCLI.git
   cd TicketingCLI
   ```
2. Compile the project:
    ```bash
   javac -d out src/main/java/org/example/*.java
   ```
   
3. Run the Project
    ```bash
    java -cp out com.realtime.ticketing.TicketingApplication
    ```

---

## Contributing
We welcome contributions from the community! Whether you're fixing bugs, adding new features, or improving documentation, here’s how you can contribute:
#### Guidelines
- Understand the Project: Read the Introduction and Features sections to familiarize yourself with the project's purpose and scope.
- Stick to the Style Guide: Follow consistent coding practices. Use proper naming conventions, indentation, and comments.
- Write Tests: Ensure your changes include appropriate unit tests in the /test folder.
- Use Meaningful Commits: Write descriptive commit messages summarizing your changes. Avoid generic messages like Fixed bug.

1. Fork the repository.

2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
    ```
3. Commit Your Changes:
    ```bash
    git commit -m "Add your feature description"
    ```
4. Push Your Branch
    ```bash
    git push origin feature/your-feature
    ```
5. Create a Pull Request:

- Go to your forked repository on GitHub.
- Click the New Pull Request button.
- Add a detailed description of your changes and submit the Pull Request.

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this project under the terms of the license. See the `LICENSE` file for detailed information.

---

## Author

- **Name**: Ravindran Dharshan
- **GitHub**: [https://github.com/DharshanSR](https://github.com/DharshanSR)

Feel free to reach out for any questions, suggestions, or feedback!
