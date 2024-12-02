package com.ticketing.event;

import com.ticketing.event.config.SystemConfiguration;
import com.ticketing.event.model.TicketPool;
import com.ticketing.event.service.CustomerService;

import java.io.IOException;
import java.util.InputMismatchException;
import java.util.Scanner;

public class CLIHandler {
    private final TicketPool ticketPool;
    private final SystemConfiguration config;
    private final CustomerService customerService;

    public CLIHandler(TicketPool ticketPool, SystemConfiguration config, CustomerService customerService) {
        this.ticketPool = ticketPool;
        this.config = config;
        this.customerService = customerService;
    }

    public void startCLI() {
        try (Scanner scanner = new Scanner(System.in)) {
            System.out.println("Welcome to the Real-Time Ticketing System CLI!");

            // Configure system parameters
            configureSystem(scanner);

            // Validate the configuration
            try {
                config.validateConfig();
                System.out.println("Configuration validated successfully.");
            } catch (IllegalArgumentException e) {
                System.out.println("Error in configuration: " + e.getMessage());
                return;
            }

            // Save configuration to file
            try {
                config.saveConfigToFile("system_config.json");
                System.out.println("Configuration saved to system_config.json.");
            } catch (IOException e) {
                System.out.println("Error saving configuration: " + e.getMessage());
            }
        }
    }

    private void configureSystem(Scanner scanner) {
        config.setMaxTicketCapacity(getPositiveInput(scanner, "Enter maximum ticket capacity: "));

        config.setTotalTickets(getPositiveInput(scanner, "Enter total number of tickets: "));

        config.setTicketReleaseRate(getPositiveInput(scanner, "Enter ticket release rate: "));

        config.setCustomerRetrievalRate(getPositiveInput(scanner, "Enter customer retrieval rate: "));
    }

    private int getPositiveInput(Scanner scanner, String prompt) {
        int value = -1;
        while (value <= 0) {
            System.out.print(prompt);
            try {
                value = scanner.nextInt();
                if (value <= 0) {
                    System.out.println("Value must be greater than zero. Please try again.");
                }
            } catch (InputMismatchException e) {
                System.out.println("Invalid input. Please enter a valid integer.");
                scanner.next(); // Clear invalid input
            }
        }
        return value;
    }
}
