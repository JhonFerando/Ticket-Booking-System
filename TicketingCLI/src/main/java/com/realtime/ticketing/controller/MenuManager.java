package com.realtime.ticketing.controller;

import com.realtime.ticketing.model.ConfigurationManager;

import java.util.InputMismatchException;
import java.util.Scanner;

/**
 * The MenuManager class provides a user interface for interacting with the ticketing system.
 * It allows users to manage ticket configurations, start and stop simulations, and update or remove configurations.
 * It uses a console-based menu and interacts with ConfigurationManager and EventSimulationManager classes.
 *
 * The class runs in a loop until the user chooses to exit the system.
 *
 * @author Dharshan
 */
public class MenuManager {
    // Instances of ConfigurationHandler and SimulationManager to handle configurations and simulations
    private final ConfigurationManager configurationManager;
    private final EventSimulationManager eventSimulationManager;
    private final Scanner scanner;

    /**
     * Constructor initializes the handler instances and scanner for user input.
     * It creates new instances of ConfigurationManager, EventSimulationManager, and Scanner.
     */
    public MenuManager() {
        configurationManager = new ConfigurationManager();
        eventSimulationManager = new EventSimulationManager();
        scanner = new Scanner(System.in);
    }

    /**
     * Main method that runs the menu and interacts with the user.
     * It displays the menu, accepts user input, and processes the selected option.
     * The loop continues until the user chooses to exit.
     */
    public void run() {
        boolean exit = false;

        // This loop keeps the menu running until the user chooses to exit
        while (!exit) {
            try {
                // Display the main menu to the user
                showMainMenu();

                // Get and validate user input
                int option = getValidatedInput();

                // Process the selected option using a switch case
                switch (option) {
                    case 1 -> configurationManager.addConfiguration();   // Add a new configuration
                    case 2 -> configurationManager.loadConfigurations(); // Load saved configurations
                    case 3 -> configurationManager.displayConfigurations(); // Display all configurations
                    case 4 -> eventSimulationManager.startSimulation(configurationManager.getConfigurations(), scanner); // Start a simulation
                    case 5 -> eventSimulationManager.stopSimulation(); // Stop a running simulation
                    case 6 -> removeConfiguration(); // Remove a configuration by ticket ID
                    case 7 -> updateConfiguration(); // Update a configuration by ticket ID
                    case 8 -> {
                        // Exit message and exit the loop
                        System.out.println("Thank you for using the Ticket Management System. Goodbye!");
                        exit = true;
                    }
                    default -> System.out.println("Invalid choice. Please select a valid option.\n");
                }
            } catch (Exception e) {
                // Catch any exception that occurs during execution and display the error message
                System.out.println("An error occurred: " + e.getMessage());
                scanner.nextLine(); // Clear invalid input from scanner buffer
            }
        }
    }

    /**
     * Displays the main menu with available options for the user to select.
     * Provides options for adding, removing, and updating configurations, as well as starting and stopping the simulation.
     */
    private void showMainMenu() {
        System.out.println("\n---------------------------------------------------");
        System.out.println("               Ticket Management System            ");
        System.out.println("---------------------------------------------------");
        System.out.println(" 1. Add Ticket Configuration                     ");
        System.out.println(" 2. Load Ticket Configurations                   ");
        System.out.println(" 3. Display Ticket Configurations                ");
        System.out.println(" 4. Start Ticket Simulation                      ");
        System.out.println(" 5. Stop Ticket Simulation                       ");
        System.out.println(" 6. Remove Ticket Configuration                  ");
        System.out.println(" 7. Update Ticket Configuration                  ");
        System.out.println(" 8. Exit from the System                         ");
        System.out.println("---------------------------------------------------");
        System.out.print(" Please select an option (1-8): ");
    }

    /**
     * Helper method to get and validate user input for selecting menu options.
     * If the input is invalid (e.g., non-integer), it catches the exception and prompts the user again.
     *
     * @return The validated integer input.
     */
    private int getValidatedInput() {
        try {
            int input = scanner.nextInt();  // Read user input as an integer
            scanner.nextLine(); // Consume the newline character
            return input; // Return the valid integer input
        } catch (InputMismatchException e) {
            // Catch invalid input (e.g., non-integer input)
            scanner.nextLine(); // Clear the scanner buffer
            System.out.println("Invalid input. Please enter a number between 1 and 9.\n");
            return -1; // Return an invalid number to trigger the default case
        }
    }

    /**
     * Prompts the user to enter a Ticket ID and removes the corresponding configuration.
     * It calls the removeConfiguration method of the ConfigurationManager to remove the selected configuration.
     */
    private void removeConfiguration() {
        System.out.print("Enter Ticket ID to remove: ");
        int ticketId = getValidatedInput();  // Get ticket ID from user
        configurationManager.removeConfiguration(ticketId); // Remove the configuration
    }

    /**
     * Prompts the user to enter a Ticket ID and updates the corresponding configuration.
     * It calls the updateConfiguration method of the ConfigurationManager to update the selected configuration.
     */
    private void updateConfiguration() {
        System.out.print("Enter Ticket ID to update: ");
        int ticketId = getValidatedInput();  // Get ticket ID from user
        configurationManager.updateConfiguration(ticketId); // Update the configuration
    }
}
