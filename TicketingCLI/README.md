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
├── config/
│   ├── configuration.json      # Global application configurations
│   └── ticket-configuration.json # Specific ticket-related configurations
├── src/
│   ├── main/
│   │   ├── java/
│   │       ├── org/
│   │       │   ├── exampl/
│   │       │       ├── controller/
│   │       │       │   ├── MenuManager.java        # Manages menu interactions
│   │       │       │   ├── SimulationManager.java  # Simulates event workflows
│   │       │       ├── model/
│   │       │       │   ├── Configuration.java      # Represents configuration data
│   │       │       │   ├── ConfigurationHandler.java # Handles configuration file operations
│   │       │       │   ├── Customer.java           # Model class for customers
│   │       │       │   ├── Vendor.java             # Model class for vendors
│   │       │       │   └── TicketPool.java         # Manages the pool of available tickets
│   │       │       ├── util/
│   │       │           └── LoggerUtil.java         # Utility class for logging
│   │       └── Main.java                            # Entry point for the application
│   └── test/
│       ├── org/
│       │   ├── exampl/
│       │       ├── controller/
│       │       │   ├── MenuManagerTest.java        # Unit tests for MenuManager
│       │       │   ├── SimulationManagerTest.java  # Unit tests for SimulationManager
│       │       ├── model/
│       │       │   ├── ConfigurationHandlerTest.java # Unit tests for ConfigurationHandler
│       │       │   └── TicketPoolTest.java         # Unit tests for TicketPool
│       │       └── util/
│       │           └── LoggerUtilTest.java         # Unit tests for LoggerUtil                              # Booking data for persistence
├── README.md                                      # Project documentation
└── LICENSE                                        # Project license
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
    java -cp out org.example.Main
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
