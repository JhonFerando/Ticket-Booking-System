package org.example.model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.*;
import java.lang.reflect.Type;
import java.util.*;

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

    // Constructor that initializes the eventTicketId
    public Configuration() {
        this.eventTicketId = ticketIdCounter++; // Increment ticketIdCounter for each new Configuration
    }

    // ANSI escape codes for colored output (red text for error messages)
    private static final String RED_TEXT = "\033[31m"; // Red text
    private static final String RESET_TEXT = "\033[0m"; // Reset text color

    // Method for prompting the user to enter configuration details with validation
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

    // Method to validate string inputs for title and vendor name
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

    // Method to validate integer inputs within a specified range
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

    // Getters for the Configuration fields
    public int getEventTicketId() {
        return eventTicketId;
    }

    public String getVendorName() {
        return vendorName;
    }

    public String getTitle() {
        return title;
    }

    public int getMaxTicketCapacity() {
        return maxTicketCapacity;
    }

    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }

    public int getCustomerRetrievalRate() {
        return customerRetrievalRate;
    }

    public int getTicketReleaseInterval() {
        return ticketReleaseInterval; // Getter for the ticket release interval
    }

    public int getCustomerRetrievalInterval() {
        return customerRetrievalInterval; // Getter for the customer retrieval interval
    }

    public int getTotalTickets() {
        return totalTickets;
    }

    // Method to return a formatted version of the event ticket ID (e.g., TICKET-00001)
    public String getFormattedTicketId() {
        return String.format("TICKET-%05d", eventTicketId);
    }

    // Method to return a string representation of the Configuration object
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

    // Save the list of configurations to a JSON file
    public static void saveToJsonFile(String filename, List<Configuration> configurations) throws IOException {
        Gson gson = new Gson();
        try (Writer writer = new FileWriter(filename)) {
            gson.toJson(configurations, writer); // Serialize the list of configurations to JSON
            System.out.println("Saving configurations to: " + filename);
        }
    }

    // Method to load configurations from a JSON file
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
