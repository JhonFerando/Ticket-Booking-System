package com.realtime.ticketing.model;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Manages the configurations for the ticketing system. This class handles loading, adding,
 * displaying, saving, removing, and updating event configurations. It interacts with the
 * configuration file (in JSON format) and provides methods to maintain and modify the configurations.
 *
 * <p>The ConfigurationManager ensures that configurations are properly loaded from and saved to a file,
 * and it handles directory creation if necessary.</p>
 *
 * @author Dharshan
 */
public class ConfigurationManager {
    // Path to the JSON file where configurations are stored
    private static final String CONFIG_FILE_PATH = "D:\\personal\\real-time-booking-system\\Backend\\Configurations\\ticket-configurations.json";

    // List to store all loaded configurations
    private final List<Configuration> configurations;

    /**
     * Constructor initializes the list of configurations and loads existing configurations
     * from the configuration file. It ensures that the configurations are available as soon
     * as the ConfigurationManager instance is created.
     */
    public ConfigurationManager() {
        configurations = new ArrayList<>();
        loadConfigurations(); // Load configurations when an instance is created
    }

    /**
     * Adds a new configuration by prompting the user for input and adding the new configuration
     * to the list of configurations. The updated list is then saved to the configuration file.
     */
    public void addConfiguration() {
        // Create a new Configuration object and prompt the user for input
        Configuration config = new Configuration();
        config.promptForInput();  // Get the configuration details from the user
        configurations.add(config); // Add the configuration to the list
        saveConfigurations(); // Save the updated list to the file
    }

    /**
     * Loads configurations from the JSON file. This method deserializes the JSON data and adds
     * the configurations to the list. If an error occurs, it prints an error message.
     */
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

    /**
     * Displays all available configurations. It prints the details of each configuration, including
     * ticket ID, vendor name, event title, and other relevant information. If no configurations are
     * available, it prints a message indicating that there are no configurations.
     */
    public void displayConfigurations() {
        if (configurations.isEmpty()) {
            System.out.println("No configurations available.\n");
        } else {
            System.out.println("Available Event Configurations:\n");
            configurations.forEach(config -> {
                System.out.println("========================================");
                System.out.println("Event Ticket ID: " + config.getEventTicketId());
                System.out.println("Vendor Name: " + config.getVendorName());
                System.out.println("Event Title: " + config.getTitle());
                System.out.println("Max Ticket Capacity: " + config.getMaxTicketCapacity());
                System.out.println("Total Tickets: " + config.getTotalTickets());
                System.out.println("Ticket Release Rate: " + config.getTicketReleaseRate() + " tickets/interval");
                System.out.println("Customer Retrieval Rate: " + config.getCustomerRetrievalRate() + " tickets/interval");
                System.out.println("Ticket Release Interval: " + config.getTicketReleaseInterval() + " ms");
                System.out.println("Customer Retrieval Interval: " + config.getCustomerRetrievalInterval() + " ms");
                System.out.println("Ticket Price: " + config.getPrice());
                System.out.println("========================================\n");
            });
        }
    }

    /**
     * Saves the current list of configurations to the JSON file. It serializes the configurations
     * into JSON format and writes them to the specified file path. If an error occurs while saving,
     * it prints an error message.
     */
    public void saveConfigurations() {
//        ensureDirectoryExists(); // Ensure that the config directory exists
        try {
            // Save configurations to the JSON file
            Configuration.saveToJsonFile(CONFIG_FILE_PATH, configurations);
            System.out.println("Configurations saved successfully.\n");
        } catch (IOException e) {
            // Handle errors that might occur while saving the configurations
            System.err.println("Error saving configurations: " + e.getMessage() + "\n");
        }
    }

    /**
     * Ensures that the "config" directory exists. If it does not exist, it creates the directory.
     * This method is called before saving configurations to ensure the directory is available.
     */
    private void ensureDirectoryExists() {
        File configDirectory = new File("config");
        if (!configDirectory.exists() && configDirectory.mkdirs()) {
            // If the directory does not exist, create it
            System.out.println("Config directory created successfully.");
        }
    }

    /**
     * Removes a configuration from the list based on the provided ticket ID. If a configuration
     * with the specified ticket ID is found, it is removed, and the updated list is saved to the file.
     * If no matching configuration is found, a message is printed indicating that no such configuration exists.
     *
     * @param ticketId The ticket ID of the configuration to be removed.
     */
    public void removeConfiguration(int ticketId) {
        // Search for the configuration with the given ticket ID
        Optional<Configuration> toRemove = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst(); // Return an Optional object to handle absence gracefully

        if (toRemove.isPresent()) {
            // If found, remove the configuration from the list and save the updated list
            configurations.remove(toRemove.get());
            saveConfigurations();
            System.out.println("Configuration with Ticket ID " + ticketId + " has been removed.\n");
        } else {
            // If not found, notify the user
            System.out.println("Configuration with Ticket ID " + ticketId + " not found.\n");
        }
    }

    /**
     * Updates an existing configuration by its ticket ID. If a configuration with the specified
     * ticket ID is found, the user is prompted to input new details, and the configuration is updated.
     * The updated configuration list is then saved to the file.
     *
     * @param ticketId The ticket ID of the configuration to be updated.
     */
    public void updateConfiguration(int ticketId) {
        // Search for the configuration with the given ticket ID
        Optional<Configuration> toUpdate = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst(); // Return an Optional object to handle absence gracefully

        if (toUpdate.isPresent()) {
            // If found, prompt the user for new input to update the configuration
            System.out.println("Updating configuration for Ticket ID: " + ticketId);
            toUpdate.get().promptForInput();  // Get new details from the user
            saveConfigurations(); // Save the updated configuration list
            System.out.println("Configuration for Ticket ID " + ticketId + " has been updated.\n");
        } else {
            // If not found, notify the user
            System.out.println("Configuration with Ticket ID " + ticketId + " not found.\n");
        }
    }

    /**
     * Getter method to return the list of all configurations.
     *
     * @return The list of all event configurations.
     */
    public List<Configuration> getConfigurations() {
        return configurations; // Return the list of configurations
    }
}
