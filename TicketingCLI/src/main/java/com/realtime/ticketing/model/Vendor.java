package com.realtime.ticketing.model;

import com.realtime.ticketing.util.LoggerUtil;

import java.util.logging.Logger;

/**
 * The Vendor class simulates a vendor adding tickets to the pool at a specified rate and interval.
 * It implements the {@link Runnable} interface, allowing the vendor to run in a separate thread.
 *
 * <p>This class is used in a simulation where tickets are added to the ticket pool at regular intervals,
 * and the vendor can be interrupted or handle unexpected errors gracefully.</p>
 *
 * @author Dharshan
 */
public class Vendor implements Runnable {
    // Logger instance for logging events related to the vendor
    private static final Logger logger = LoggerUtil.getLogger(Vendor.class);

    // Fields defining the ticket release parameters and the associated ticket pool
    private final TicketPool ticketPool;
    private final int releaseRate;
    private final int releaseInterval; // in milliseconds

    /**
     * Constructor to initialize the Vendor.
     *
     * @param ticketPool The shared ticket pool to which the vendor will add tickets.
     * @param releaseRate The number of tickets to add to the pool at each interval.
     * @param releaseInterval The interval (in milliseconds) between each ticket release.
     *
     * @throws IllegalArgumentException if the release rate or interval is less than or equal to 0.
     */
    public Vendor(TicketPool ticketPool, int releaseRate, int releaseInterval) {
        // Validate that the release rate and interval are greater than 0
        if (releaseRate <= 0) {
            throw new IllegalArgumentException("Release rate must be greater than 0.");
        }
        if (releaseInterval <= 0) {
            throw new IllegalArgumentException("Release interval must be greater than 0.");
        }

        // Initialize the ticket pool and release parameters
        this.ticketPool = ticketPool;
        this.releaseRate = releaseRate;
        this.releaseInterval = releaseInterval;
    }

    /**
     * The run method simulates adding tickets to the pool at regular intervals.
     * This method runs in a separate thread and keeps adding tickets until the thread is interrupted.
     *
     * @see Thread#interrupt() for interrupt handling
     */
    @Override
    public void run() {
        try {
            // Loop that continues releasing tickets until the thread is interrupted
            while (!Thread.currentThread().isInterrupted()) {
                synchronized (ticketPool) { // Synchronize access to the shared resource (ticket pool)
                    ticketPool.addTickets(releaseRate); // Add tickets to the pool
                    // Log the ticket release event
                    logger.info(String.format("Vendor added %d tickets.", releaseRate));
                }
                // Sleep for the specified interval before releasing more tickets
                Thread.sleep(releaseInterval);
            }
        } catch (InterruptedException e) {
            // Log the thread interruption event and exit the loop
            logger.info("Vendor thread interrupted. Exiting...");
            Thread.currentThread().interrupt(); // Reset the interrupt status
        } catch (Exception ex) {
            // Log any unexpected errors
            logger.severe("Unexpected error in Vendor: " + ex.getMessage());
        }
    }
}
