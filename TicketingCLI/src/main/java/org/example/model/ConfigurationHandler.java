package org.example.model;

import org.example.model.Configuration;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class ConfigurationHandler {
    // Path to the JSON file where configurations are stored
    private static final String CONFIG_FILE_PATH = "config/ticket-configurations.json";

    // List to store all loaded configurations
    private final List<Configuration> configurations;

    // Constructor initializes the list and loads existing configurations from the file
    public ConfigurationHandler() {
        configurations = new ArrayList<>();
        loadConfigurations(); // Load configurations when an instance is created
    }

    // Method to add a new configuration
    public void addConfiguration() {
        // Create a new Configuration object and prompt the user for input
        Configuration config = new Configuration();
        config.promptForInput();  // Get the configuration details from the user
        configurations.add(config); // Add the configuration to the list
        saveConfigurations(); // Save the updated list to the file
    }

    // Method to load configurations from the JSON file
    public void loadConfigurations() {
        try {
            // Try to load the configurations from the file
            List<Configuration> loadedConfigurations = Configuration.loadConfigurationsFromJson(CONFIG_FILE_PATH);
            configurations.addAll(loadedConfigurations); // Add the loaded configurations to the list
            System.out.println("Configurations loaded successfully.\n");
        } catch (IOException e) {
            // Handle the case where the configurations cannot be loaded
            System.err.println("Error loading configurations: " + e.getMessage() + "\n");
        }
    }

    // Method to display all configurations
    public void displayConfigurations() {
        if (configurations.isEmpty()) {
            // If no configurations are available, notify the user
            System.out.println("No configurations available.\n");
        } else {
            // Otherwise, display all available configurations
            System.out.println("Available Configurations:");
            configurations.forEach(System.out::println); // Print each configuration
            System.out.println();
        }
    }

    // Method to save the current list of configurations to the JSON file
    public void saveConfigurations() {
        ensureDirectoryExists(); // Ensure that the config directory exists
        try {
            // Save configurations to the JSON file
            Configuration.saveToJsonFile(CONFIG_FILE_PATH, configurations);
            System.out.println("Configurations saved successfully.\n");
        } catch (IOException e) {
            // Handle errors that might occur while saving the configurations
            System.err.println("Error saving configurations: " + e.getMessage() + "\n");
        }
    }

    // Helper method to ensure the "config" directory exists
    private void ensureDirectoryExists() {
        File configDirectory = new File("config");
        if (!configDirectory.exists() && configDirectory.mkdirs()) {
            // If the directory does not exist, create it
            System.out.println("Config directory created successfully.");
        }
    }

    // Method to remove a configuration by its ticket ID
    public void removeConfiguration(int ticketId) {
        // Search for the configuration with the given ticket ID
        Configuration toRemove = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst()
                .orElse(null); // Return null if not found

        if (toRemove != null) {
            // If found, remove the configuration from the list and save the updated list
            configurations.remove(toRemove);
            saveConfigurations();
            System.out.println("Configuration removed successfully.\n");
        } else {
            // If not found, notify the user
            System.out.println("Configuration with Ticket ID " + ticketId + " not found.\n");
        }
    }

    // Method to update an existing configuration by its ticket ID
    public void updateConfiguration(int ticketId) {
        // Search for the configuration with the given ticket ID
        Configuration toUpdate = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst()
                .orElse(null); // Return null if not found

        if (toUpdate != null) {
            // If found, prompt the user for new input to update the configuration
            System.out.println("Updating configuration for Ticket ID: " + ticketId);
            toUpdate.promptForInput();
            saveConfigurations(); // Save the updated configuration list
            System.out.println("Configuration updated successfully.\n");
        } else {
            // If not found, notify the user
            System.out.println("Configuration with Ticket ID " + ticketId + " not found.\n");
        }
    }

    // Method to search for a configuration by its ticket ID
    public void searchConfiguration(int ticketId) {
        // Search for the configuration with the given ticket ID
        Configuration foundConfig = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst()
                .orElse(null); // Return null if not found

        if (foundConfig != null) {
            // If found, display the configuration
            System.out.println("Configuration found:");
            System.out.println(foundConfig);
        } else {
            // If not found, notify the user
            System.out.println("No configuration found with Ticket ID " + ticketId + ".\n");
        }
    }

    // Getter method to return the list of configurations
    public List<Configuration> getConfigurations() {
        return configurations; // Return the list of configurations
    }
}
