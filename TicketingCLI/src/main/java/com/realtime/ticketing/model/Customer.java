package com.realtime.ticketing.model;

import com.realtime.ticketing.util.LoggerUtil;

import java.util.logging.Logger;

/**
 * This class represents the Customer in the ticket purchasing simulation.
 * It implements the Runnable interface, allowing it to run in a separate thread
 * to simulate real-time customer interactions with the ticket pool.
 *
 * <p>The Customer retrieves tickets from the shared TicketPool at a specified rate
 * and interval. The thread continues running until it is interrupted.</p>
 *
 * <p>Each Customer thread interacts with the TicketPool in a synchronized manner
 * to ensure thread safety when accessing the shared resource.</p>
 *
 * @author Dharshan
 */
public class Customer implements Runnable {
    // Logger instance for logging customer actions and events
    private static final Logger logger = LoggerUtil.getLogger(Customer.class);

    // The shared TicketPool that the Customer interacts with
    private final TicketPool ticketPool;
    // The rate at which tickets will be retrieved by the customer
    private final int retrievalRate;
    // The time interval between each retrieval action (in milliseconds)
    private final int retrievalInterval;

    /**
     * Constructor to initialize the customer with the TicketPool and retrieval settings.
     *
     * @param ticketPool The shared TicketPool from which tickets are retrieved.
     * @param retrievalRate The rate at which tickets are retrieved.
     * @param retrievalInterval The time interval (in milliseconds) between each retrieval.
     *
     * @throws IllegalArgumentException if the retrieval rate or interval is less than or equal to 0.
     */
    public Customer(TicketPool ticketPool, int retrievalRate, int retrievalInterval) {
        // Validate that retrieval rate and interval are greater than 0
        if (retrievalRate <= 0) {
            throw new IllegalArgumentException("Retrieval rate must be greater than 0.");
        }
        if (retrievalInterval <= 0) {
            throw new IllegalArgumentException("Retrieval interval must be greater than 0.");
        }
        // Initialize the fields with provided values
        this.ticketPool = ticketPool;
        this.retrievalRate = retrievalRate;
        this.retrievalInterval = retrievalInterval;
    }

    /**
     * The main method that runs in the Customer thread. This method keeps running
     * until the thread is interrupted. It attempts to retrieve tickets from the
     * TicketPool at the specified rate and interval.
     *
     * <p>The method synchronizes access to the TicketPool and logs success or
     * failure of ticket retrieval. It then waits for the specified interval before
     * attempting another retrieval.</p>
     */
    @Override
    public void run() {
        try {
            // Keep running the customer thread until it's interrupted
            while (!Thread.currentThread().isInterrupted()) {
                synchronized (ticketPool) { // Synchronize access to the shared ticket pool
                    // Attempt to remove tickets from the ticket pool based on the retrieval rate
                    boolean success = ticketPool.removeTickets(retrievalRate);
                    if (success) {
                        // Log a success message if tickets were retrieved
                        logger.info(String.format("Customer retrieved %d tickets.", retrievalRate));
                    } else {
                        // Log a warning if there are not enough tickets available for retrieval
                        logger.warning("Not enough tickets available for retrieval.");
                    }
                }
                // Pause for the defined retrieval interval before attempting another retrieval
                Thread.sleep(retrievalInterval);
            }
        } catch (InterruptedException e) {
            // Handle thread interruption (e.g., if the simulation is stopped)
            logger.info("Customer thread interrupted. Exiting...");
            Thread.currentThread().interrupt(); // Reset the interrupt status
        } catch (Exception ex) {
            // Log any unexpected errors that occur during execution
            logger.severe("Unexpected error in Customer: " + ex.getMessage());
        }
    }
}
