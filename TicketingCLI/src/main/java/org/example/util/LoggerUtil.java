package org.example.util;

import java.io.IOException;
import java.util.logging.*;

// Utility class to configure and return a logger with both file and console handlers.
public class LoggerUtil {

    // This method initializes a logger with both file and console handlers.
    public static Logger getLogger(Class<?> clazz) {
        // Create a logger instance for the specified class
        Logger logger = Logger.getLogger(clazz.getName());

        try {
            // Set up File Handler to log events to a file ('application.log')
            Handler fileHandler = new FileHandler("application.log", true); // true to append to the file
            fileHandler.setFormatter(new SimpleFormatter()); // Simple text format for log messages
            fileHandler.setLevel(Level.ALL); // Log all levels of messages (from INFO to SEVERE)

            // Set up Console Handler to log events to the console
            Handler consoleHandler = new ConsoleHandler(); // Console output
            consoleHandler.setFormatter(new SimpleFormatter()); // Simple text format for log messages
            consoleHandler.setLevel(Level.ALL); // Log all levels of messages to the console

            // Add both the file and console handlers to the logger
            logger.addHandler(fileHandler);
            logger.addHandler(consoleHandler);

            // Disable the default console handler to avoid duplicate logs
            logger.setUseParentHandlers(false);

        } catch (IOException e) {
            // If file handler setup fails, print an error message
            System.err.println("Failed to initialize logger: " + e.getMessage());
        }

        // Return the configured logger instance
        return logger;
    }
}
