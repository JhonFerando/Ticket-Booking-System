package org.example.model;

import org.example.util.LoggerUtil;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

// The TicketPool class manages the pool of tickets for an event, including adding, removing, and tracking ticket sales and customer interactions.
public class TicketPool {
    // Logger instance for logging events related to the ticket pool
    private static final Logger logger = LoggerUtil.getLogger(TicketPool.class);

    // Fields defining the ticket pool and event details
    private final String vendor;
    private final int maxTicketCapacity;
    private final int totalTickets;
    private final int ticketReleaseRate;
    private final int customerRetrievalRate;
    private final String title;

    // A synchronized list to represent the ticket pool, ensuring thread safety when accessed by multiple threads
    private final List<Integer> ticketPool;

    // Flags and counters related to the simulation
    private boolean simulationComplete = false;
    private int ticketsSold = 0;
    private int customers = 0;

    // Constructor to initialize the ticket pool with event and capacity details
    public TicketPool(String vendor, int maxTicketCapacity, int totalTickets, int ticketReleaseRate, int customerRetrievalRate, String title) {
        if (maxTicketCapacity <= 0 || totalTickets <= 0 || ticketReleaseRate <= 0 || customerRetrievalRate <= 0) {
            throw new IllegalArgumentException("All capacity, ticket, and rate values must be greater than 0.");
        }
        // Initialize fields
        this.vendor = vendor;
        this.maxTicketCapacity = maxTicketCapacity;
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.customerRetrievalRate = customerRetrievalRate;
        this.title = title;

        // Initialize synchronized ticket pool to ensure thread safety
        this.ticketPool = Collections.synchronizedList(new LinkedList<>());

        // Log the creation of the ticket pool
        logger.info("TicketPool created for event: " + title + " with vendor: " + vendor);
    }

    // Adds tickets to the pool, ensuring that the pool does not exceed its capacity or the available tickets
    public void addTickets(int ticketCount) {
        synchronized (ticketPool) {
            if (simulationComplete) return;

            // Validate that the ticket count is positive
            if (ticketCount <= 0) {
                logger.warning("Invalid ticket count. Must be greater than 0.");
                return;
            }

            // Calculate remaining space in the pool and remaining tickets to be released
            int ticketsRemainingToBeReleased = totalTickets - ticketsSold - ticketPool.size();
            int availableSpace = maxTicketCapacity - ticketPool.size();

            // Check if the ticket count can be added based on space and remaining tickets
            if (ticketCount > availableSpace || ticketCount > ticketsRemainingToBeReleased) {
                logger.warning("Cannot release tickets: Pool full or not enough tickets remaining.");
                return;
            }

            // Add the tickets to the pool, simulating ticket IDs with random numbers
            for (int i = 0; i < ticketCount; i++) {
                ticketPool.add((int) (Math.random() * 1000)); // Simulating ticket ID
            }

            // Log ticket release summary
            logger.info(String.format("Released %d tickets for event: %s, Vendor: %s", ticketCount, title, vendor));
            logger.info(String.format("Ticket release summary for event '%s': Vendor: %s, Tickets Added: %d, Pool Size: %d/%d", title, vendor, ticketCount, ticketPool.size(), maxTicketCapacity));
        }
    }

    // Removes tickets from the pool (represents ticket purchase by a customer)
    public boolean removeTickets(int retrievalRate) {
        synchronized (ticketPool) {
            if (simulationComplete) return false;

            // If the ticket pool is empty, no tickets can be retrieved
            if (ticketPool.isEmpty()) {
                logger.warning("Ticket pool is empty. No tickets to remove.");
                return false;
            }

            int ticketsRetrieved = 0;

            // Retrieve tickets up to the specified retrieval rate
            while (!ticketPool.isEmpty() && ticketsRetrieved < retrievalRate) {
                ticketPool.remove(0); // Simulate ticket purchase by removing the first ticket in the pool
                ticketsRetrieved++;
                ticketsSold++; // Increase the sold ticket count
            }

            if (ticketsRetrieved > 0) {
                customers++; // Increment customer count
                // Log the customer’s ticket purchase summary
                logger.info(String.format("Customer %d purchased %d tickets for event: %s.", customers, ticketsRetrieved, title));
                logger.info(String.format("Ticket purchase summary for customer %d: Tickets Bought: %d, Event Title: %s, Pool Size: %d/%d", customers, ticketsRetrieved, title, ticketPool.size(), maxTicketCapacity));
            }

            return true;
        }
    }

    // Marks the simulation as complete (no more tickets can be sold)
    public void stopSimulation() {
        simulationComplete = true;
        logger.info("Simulation completed. All tickets sold.");
    }

    // Returns the current size of the ticket pool
    public int getTicketPoolSize() {
        synchronized (ticketPool) {
            return simulationComplete ? 0 : ticketPool.size(); // If the simulation is complete, return 0
        }
    }

    // Interrupts the simulation externally (marks it as complete)
    public void interruptSimulation() {
        simulationComplete = true;
        logger.warning("Simulation interrupted.");
    }

    // Checks if the simulation has completed (all tickets are sold or the simulation is stopped)
    public boolean isSimulationComplete() {
        return simulationComplete;
    }
}
