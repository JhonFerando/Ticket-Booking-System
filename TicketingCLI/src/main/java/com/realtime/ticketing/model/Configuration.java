package com.realtime.ticketing.model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.*;
import java.lang.reflect.Type;
import java.util.*;

/**
 * Represents a configuration for an event ticketing system. This class stores details
 * about the event such as ticket title, vendor name, ticket release rate, customer
 * retrieval rate, and various time intervals. It also provides methods to validate inputs,
 * save configurations to a JSON file, and load configurations from a JSON file.
 *
 * <p>Each configuration has a unique event ticket ID generated sequentially.</p>
 *
 * @author Dharshan
 */
public class Configuration implements Serializable {
    // Static variable to generate unique eventTicketId for each configuration
    private static int ticketIdCounter = 1;
    private final int eventTicketId; // Unique ticket ID for the event
    private String vendorName;
    private String title;
    private int maxTicketCapacity;
    private int ticketReleaseRate;
    private int customerRetrievalRate;
    private int ticketReleaseInterval; // Time interval for ticket release in milliseconds
    private int customerRetrievalInterval; // Time interval for customer retrieval in milliseconds
    private int totalTickets; // Total number of tickets for the event

    /**
     * Constructor that initializes the eventTicketId. The eventTicketId is auto-incremented
     * with each new instance of Configuration.
     */
    public Configuration() {
        this.eventTicketId = ticketIdCounter++; // Increment ticketIdCounter for each new Configuration
    }

    // ANSI escape codes for colored output (red text for error messages)
    private static final String RED_TEXT = "\033[31m"; // Red text
    private static final String RESET_TEXT = "\033[0m"; // Reset text color

    /**
     * Prompts the user to input configuration details for the event, including ticket title, vendor name,
     * total tickets, maximum ticket capacity, release rate, retrieval rate, and time intervals for ticket
     * release and customer retrieval. Input is validated to ensure correctness.
     */
    public void promptForInput() {
        Scanner scanner = new Scanner(System.in);

        // Prompting and validating string input for Title and Vendor Name
        System.out.print("Enter Ticket Title: ");
        this.title = validateStringInput(scanner, "Ticket Title");

        System.out.print("Enter Vendor Name: ");
        this.vendorName = validateStringInput(scanner, "Vendor Name");

        // Looping until Total Tickets and Max Ticket Capacity match
        while (true) {
            System.out.print("Enter Total Number of Tickets: ");
            this.totalTickets = validateIntegerInput(scanner, "Total Number of Tickets", 1, Integer.MAX_VALUE);

            System.out.print("Enter Max Ticket Capacity of the Pool: ");
            this.maxTicketCapacity = validateIntegerInput(scanner, "Max Ticket Capacity", 1, Integer.MAX_VALUE);

            // Validating if Total Tickets equals Max Ticket Capacity
            if (this.totalTickets == this.maxTicketCapacity) {
                break;
            }

            // Error message if the values do not match
            System.out.println(RED_TEXT + "Error: Total Number of Tickets and Max Ticket Capacity must be the same. Please re-enter both values." + RESET_TEXT);
        }

        // Validating the ticket release rate, customer retrieval rate, and time intervals
        System.out.print("Enter Ticket Release Rate: ");
        this.ticketReleaseRate = validateIntegerInput(scanner, "Ticket Release Rate", 1, Integer.MAX_VALUE);

        System.out.print("Enter Customer Retrieval Rate: ");
        this.customerRetrievalRate = validateIntegerInput(scanner, "Customer Retrieval Rate", 1, Integer.MAX_VALUE);

        // New fields for ticket release and customer retrieval intervals
        System.out.print("Enter Ticket Release Interval (in milliseconds): ");
        this.ticketReleaseInterval = validateIntegerInput(scanner, "Ticket Release Interval", 1, Integer.MAX_VALUE);

        System.out.print("Enter Customer Retrieval Interval (in milliseconds): ");
        this.customerRetrievalInterval = validateIntegerInput(scanner, "Customer Retrieval Interval", 1, Integer.MAX_VALUE);
    }

    /**
     * Validates the string input to ensure it contains only alphabetic characters and spaces.
     * If the input is invalid, it prompts the user to re-enter the value.
     *
     * @param scanner The scanner object used to read user input.
     * @param fieldName The name of the field being validated (e.g., "Ticket Title").
     * @return The valid string input.
     */
    private String validateStringInput(Scanner scanner, String fieldName) {
        while (true) {
            String input = scanner.nextLine().trim();
            // Only alphabetic characters and spaces are allowed
            if (!input.isEmpty() && input.matches("[a-zA-Z\\s]+")) {
                return input;
            }
            // Error message for invalid string input
            System.out.println(RED_TEXT + "Error: " + fieldName + " cannot contain numbers, symbols, or special characters. Please enter a valid value." + RESET_TEXT);
            System.out.print("Re-enter " + fieldName + ": ");
        }
    }

    /**
     * Validates the integer input to ensure it is within a specified range.
     * If the input is invalid, it prompts the user to re-enter the value.
     *
     * @param scanner The scanner object used to read user input.
     * @param fieldName The name of the field being validated (e.g., "Total Tickets").
     * @param minValue The minimum valid value for the input.
     * @param maxValue The maximum valid value for the input.
     * @return The valid integer input.
     */
    private int validateIntegerInput(Scanner scanner, String fieldName, int minValue, int maxValue) {
        while (true) {
            try {
                int input = Integer.parseInt(scanner.nextLine().trim());
                // Check if the input is within the valid range
                if (input >= minValue && input <= maxValue) {
                    return input;
                } else {
                    System.out.println(RED_TEXT + "Error: " + fieldName + " must be between " + minValue + " and " + maxValue + "." + RESET_TEXT);
                }
            } catch (NumberFormatException e) {
                System.out.println(RED_TEXT + "Error: " + fieldName + " must be a valid integer." + RESET_TEXT);
            }
            System.out.print("Re-enter " + fieldName + ": ");
        }
    }

    /**
     * Gets the event ticket ID associated with this configuration.
     *
     * @return The event ticket ID.
     */
    public int getEventTicketId() {
        return eventTicketId;
    }

    /**
     * Gets the vendor name associated with this configuration.
     *
     * @return The vendor name for this event.
     */
    public String getVendorName() {
        return vendorName;
    }

    /**
     * Gets the event title associated with this configuration.
     *
     * @return The event title.
     */
    public String getTitle() {
        return title;
    }

    /**
     * Gets the maximum ticket capacity for this event configuration.
     *
     * @return The maximum ticket capacity.
     */
    public int getMaxTicketCapacity() {
        return maxTicketCapacity;
    }

    /**
     * Gets the ticket release rate for this configuration.
     *
     * @return The ticket release rate (tickets per second).
     */
    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }

    /**
     * Gets the customer retrieval rate for this configuration.
     *
     * @return The customer retrieval rate (customers per second).
     */
    public int getCustomerRetrievalRate() {
        return customerRetrievalRate;
    }

    /**
     * Gets the ticket release interval (in milliseconds) for this configuration.
     *
     * @return The ticket release interval in milliseconds.
     */
    public int getTicketReleaseInterval() {
        return ticketReleaseInterval; // Getter for the ticket release interval
    }

    /**
     * Gets the customer retrieval interval (in milliseconds) for this configuration.
     *
     * @return The customer retrieval interval in milliseconds.
     */
    public int getCustomerRetrievalInterval() {
        return customerRetrievalInterval; // Getter for the customer retrieval interval
    }

    /**
     * Gets the total number of tickets for this event configuration.
     *
     * @return The total number of tickets.
     */
    public int getTotalTickets() {
        return totalTickets;
    }

    /**
     * Returns a formatted version of the event ticket ID (e.g., TICKET-00001).
     *
     * @return The formatted ticket ID.
     */
    public String getFormattedTicketId() {
        return String.format("TICKET-%05d", eventTicketId);
    }

    /**
     * Returns a string representation of this configuration, including details about
     * the event ticket such as the title, ticket ID, vendor name, total tickets,
     * and other configuration parameters.
     *
     * @return A string representation of the configuration.
     */
    @Override
    public String toString() {
        return "========== Event Configuration ==========\n" +
                "Event Title           : " + title + "\n" +
                "Ticket ID             : " + getFormattedTicketId() + "\n" +
                "Vendor Name           : " + vendorName + "\n" +
                "Total Tickets         : " + totalTickets + "\n" +
                "Max Ticket Capacity   : " + maxTicketCapacity + "\n" +
                "Ticket Release Rate   : " + ticketReleaseRate + " tickets/sec\n" +
                "Customer Retrieval Rate: " + customerRetrievalRate + " customers/sec\n" +
                "Ticket Release Interval: " + ticketReleaseInterval + " ms\n" +
                "Customer Retrieval Interval: " + customerRetrievalInterval + " ms\n" +
                "=========================================";
    }

    /**
     * Saves a list of configurations to a specified JSON file. This method serializes
     * the configurations into JSON format and writes them to the provided file path.
     *
     * @param filename The name of the file to save the configurations to.
     * @param configurations The list of Configuration objects to be saved.
     * @throws IOException If an I/O error occurs while writing to the file.
     */
    public static void saveToJsonFile(String filename, List<Configuration> configurations) throws IOException {
        Gson gson = new Gson();
        try (Writer writer = new FileWriter(filename)) {
            gson.toJson(configurations, writer); // Serialize the list of configurations to JSON
            System.out.println("Saving configurations to: " + filename);
        }
    }

    /**
     * Loads a list of configurations from a specified JSON file. This method deserializes
     * the JSON data from the file into a list of Configuration objects and updates the
     * ticket ID counter based on the maximum event ticket ID found in the loaded configurations.
     *
     * @param filePath The path to the JSON file containing the configurations.
     * @return A list of Configuration objects loaded from the JSON file.
     * @throws IOException If an I/O error occurs while reading the file.
     */
    public static List<Configuration> loadConfigurationsFromJson(String filePath) throws IOException {
        Gson gson = new Gson();
        List<Configuration> ticketConfigs;
        try (Reader reader = new FileReader(filePath)) {
            // Define the type of the List<Configuration> to deserialize JSON into
            Type listType = new TypeToken<List<Configuration>>() {}.getType();
            ticketConfigs = gson.fromJson(reader, listType);
        }

        // Update the ticketIdCounter based on the loaded configurations
        if (!ticketConfigs.isEmpty()) {
            // Find the maximum eventTicketId and set the counter to the next available ID
            ticketIdCounter = ticketConfigs.stream().mapToInt(Configuration::getEventTicketId).max().orElse(0) + 1;
        }

        return ticketConfigs;
    }
}
