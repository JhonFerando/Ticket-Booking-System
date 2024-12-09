package org.example.controller;

import org.example.model.ConfigurationHandler;

import java.util.InputMismatchException;
import java.util.Scanner;

public class MenuManager {
    // Instances of ConfigurationHandler and SimulationManager to handle configurations and simulations
    private final ConfigurationHandler configurationHandler;
    private final SimulationManager simulationManager;
    private final Scanner scanner;

    // Constructor initializes the handler instances and scanner for user input
    public MenuManager() {
        configurationHandler = new ConfigurationHandler();
        simulationManager = new SimulationManager();
        scanner = new Scanner(System.in);
    }

    // Main method to run the menu and interact with the user
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
                    case 1 -> configurationHandler.addConfiguration();   // Add a new configuration
                    case 2 -> configurationHandler.loadConfigurations(); // Load saved configurations
                    case 3 -> configurationHandler.displayConfigurations(); // Display all configurations
                    case 4 -> simulationManager.startSimulation(configurationHandler.getConfigurations(), scanner); // Start a simulation
                    case 5 -> simulationManager.stopSimulation(); // Stop a running simulation
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

    // Method to display the main menu with available options
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

    // Helper method to get and validate user input
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

    // Method to remove a configuration by its ticket ID
    private void removeConfiguration() {
        System.out.print("Enter Ticket ID to remove: ");
        int ticketId = getValidatedInput();  // Get ticket ID from user
        configurationHandler.removeConfiguration(ticketId); // Remove the configuration
    }

    // Method to update a configuration by its ticket ID
    private void updateConfiguration() {
        System.out.print("Enter Ticket ID to update: ");
        int ticketId = getValidatedInput();  // Get ticket ID from user
        configurationHandler.updateConfiguration(ticketId); // Update the configuration
    }
}
