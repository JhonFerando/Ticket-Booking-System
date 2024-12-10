package com.realtime.ticketing.controller;

import com.realtime.ticketing.model.Configuration;
import com.realtime.ticketing.model.Customer;
import com.realtime.ticketing.model.TicketPool;
import com.realtime.ticketing.model.Vendor;

import java.util.List;
import java.util.Scanner;

/**
 * The EventSimulationManager class is responsible for managing the simulation
 * of an event ticketing system. It handles starting, stopping, and monitoring
 * the simulation by managing the vendor and customer interactions with the ticket pool.
 * The simulation involves multiple threads for vendors, customers, and monitoring ticket sales.
 *
 * @author Dharshan
 */
public class EventSimulationManager {

    // Indicates whether the simulation is active
    private volatile boolean simulationActive = false;

    // Ticket pool to manage tickets during the simulation
    private TicketPool ticketPool = null;

    // Threads for vendor, customer, and monitor operations
    private Thread vendorThread = null;
    private Thread customerThread = null;
    private Thread monitorThread = null;

    /**
     * Starts the simulation based on the provided configurations and user input.
     * Prompts the user to enter a ticket ID and initializes the simulation if valid configurations are available.
     *
     * @param configurations A list of configurations that can be used to start the simulation.
     * @param scanner The scanner object to capture user input.
     */
    public void startSimulation(List<Configuration> configurations, Scanner scanner) {
        // If no configurations are available, prompt the user to add or load configurations
        if (configurations.isEmpty()) {
            System.out.println("No configurations available. Please add or load configurations first.\n");
            return;
        }

        // Prompt user for the Event Ticket ID to start the simulation
        System.out.print("Enter the Event Ticket ID to start the simulation: ");
        int ticketId = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        // Find the configuration that matches the provided ticket ID
        Configuration selectedConfig = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst()
                .orElse(null);

        // If no configuration matches the ticket ID, print an error and exit
        if (selectedConfig == null) {
            System.out.println("Invalid Event Ticket ID. Please try again.\n");
            return;
        }

        // If a simulation is already running, inform the user
        if (simulationActive) {
            System.out.println("A simulation is already running. Please stop it before starting a new one.\n");
            return;
        }

        // Initialize the simulation with the selected configuration
        initializeSimulation(selectedConfig);
    }

    /**
     * Initializes the simulation using the provided configuration.
     * Sets up the ticket pool, starts the vendor and customer threads, and begins monitoring the ticket pool.
     *
     * @param config The configuration used to initialize the simulation.
     */
    private void initializeSimulation(Configuration config) {
        // Initialize the ticket pool with the configuration details
        ticketPool = new TicketPool(
                config.getVendorName(),
                config.getMaxTicketCapacity(),
                config.getTotalTickets(),
                config.getTicketReleaseRate(),
                config.getCustomerRetrievalRate(),
                config.getTitle()
        );

        // Print the initialized simulation details
        System.out.println("==============================================");
        System.out.println("| Simulation Initialized for Event: " + config.getTitle());
        System.out.println("| Vendor: " + config.getVendorName());
        System.out.println("| Total Tickets: " + config.getTotalTickets());
        System.out.println("| Max Ticket Capacity: " + config.getMaxTicketCapacity());
        System.out.println("==============================================\n");

        // Set simulation as active
        simulationActive = true;

        // Initialize and start the vendor and customer threads
        vendorThread = new Thread(new Vendor(ticketPool, config.getTicketReleaseRate(), config.getTicketReleaseInterval()));
        customerThread = new Thread(new Customer(ticketPool, config.getCustomerRetrievalRate(), config.getCustomerRetrievalInterval()));

        vendorThread.start(); // Start vendor thread
        customerThread.start(); // Start customer thread

        // Print confirmation that threads have started
        System.out.println("Vendor and Customer threads started.\n");

        // Start monitoring the ticket pool
        monitorTicketPool();
    }

    /**
     * Monitors the ticket pool to check if all tickets are sold.
     * If all tickets are sold, it automatically stops the simulation.
     */
    private void monitorTicketPool() {
        monitorThread = new Thread(() -> {
            while (simulationActive) {
                try {
                    // Check ticket pool every 2 seconds
                    Thread.sleep(2000);

                    // If all tickets are sold out and the simulation is not marked as complete, stop the simulation
                    if (ticketPool != null && ticketPool.getTicketPoolSize() == 0 && !ticketPool.isSimulationComplete()) {
                        System.out.println("All tickets sold out. Ending simulation automatically.\n");
                        stopSimulation();
                    }
                } catch (InterruptedException e) {
                    // Handle interrupted exception in the monitor thread
                    System.err.println("Monitor thread interrupted: " + e.getMessage());
                }
            }
        });

        monitorThread.start(); // Start the monitor thread
    }

    /**
     * Stops the currently active simulation.
     * Interrupts the vendor, customer, and monitor threads and ends the simulation.
     */
    public void stopSimulation() {
        // If no simulation is active, inform the user
        if (!simulationActive) {
            System.out.println("No active simulation to stop.\n");
            return;
        }

        // Set simulation as inactive
        simulationActive = false;

        // Interrupt vendor and customer threads if they are still running
        if (vendorThread != null && vendorThread.isAlive()) {
            vendorThread.interrupt();
        }
        if (customerThread != null && customerThread.isAlive()) {
            customerThread.interrupt();
        }

        // Interrupt the monitor thread if it's running
        if (monitorThread != null && monitorThread.isAlive()) {
            monitorThread.interrupt();
        }

        // Stop the ticket pool simulation if it's running
        if (ticketPool != null) {
            ticketPool.interruptSimulation();
        }

        // Print confirmation that the simulation has been stopped
        System.out.println("Simulation stopped successfully.\n");
    }
}
