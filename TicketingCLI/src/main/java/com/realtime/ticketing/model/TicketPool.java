package com.realtime.ticketing.model;

import com.realtime.ticketing.util.LoggerUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

/**
 * The TicketPool class manages the pool of tickets for an event.
 * It handles adding and retrieving tickets, tracking simulation state, and ensures
 * thread-safe access to the ticket pool through synchronization.
 *
 * <p>This version includes fixes for remaining tickets, synchronization, and simulation state handling.</p>
 *
 * @author Dharshan
 */
public class TicketPool {
    private static final Logger logger = LoggerUtil.getLogger(TicketPool.class);

    private final String vendor;
    private final int maxTicketCapacity;
    private final int totalTickets;
    private final int ticketReleaseRate;
    private final int customerRetrievalRate;
    private final String title;

    private final List<Integer> ticketPool;
    private boolean simulationComplete = false;
    private int ticketsSold = 0;
    private int customers = 0;

    /**
     * Constructs a TicketPool object with the specified vendor, maximum ticket capacity,
     * total number of tickets, ticket release rate, customer retrieval rate, and event title.
     *
     * @param vendor                 the vendor managing the tickets
     * @param maxTicketCapacity     the maximum capacity of tickets that can be in the pool
     * @param totalTickets           the total number of tickets to be sold
     * @param ticketReleaseRate      the rate at which tickets are released to the pool
     * @param customerRetrievalRate  the rate at which customers retrieve tickets from the pool
     * @param title                  the title of the event for which tickets are being sold
     * @throws IllegalArgumentException if any of the capacity, ticket, or rate values are less than or equal to zero
     */
    public TicketPool(String vendor, int maxTicketCapacity, int totalTickets, int ticketReleaseRate, int customerRetrievalRate, String title) {
        if (maxTicketCapacity <= 0 || totalTickets <= 0 || ticketReleaseRate <= 0 || customerRetrievalRate <= 0) {
            throw new IllegalArgumentException("All capacity, ticket, and rate values must be greater than 0.");
        }

        this.vendor = vendor;
        this.maxTicketCapacity = maxTicketCapacity;
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.customerRetrievalRate = customerRetrievalRate;
        this.title = title;
        this.ticketPool = new ArrayList<>();
    }

    /**
     * Adds a specified number of tickets to the pool.
     * The number of tickets added is constrained by the available space in the pool,
     * the total tickets to be released, and the maximum ticket capacity.
     * This method is synchronized to ensure thread-safe access.
     *
     * @param ticketCount the number of tickets to add to the pool
     */
    public synchronized void addTickets(int ticketCount) {
        if (simulationComplete) return;

        // Calculate remaining tickets to release
        int ticketsRemainingToBeReleased = totalTickets - ticketsSold - ticketPool.size();
        int availableSpace = maxTicketCapacity - ticketPool.size();

        if (ticketCount <= 0 || ticketCount > availableSpace || ticketCount > ticketsRemainingToBeReleased) {
            logger.warning("Cannot release tickets: Invalid count, pool full, or no tickets remaining.");
            return;
        }

        for (int i = 0; i < ticketCount; i++) {
            ticketPool.add((int) (Math.random() * 1000)); // Simulating ticket ID
        }

        logger.info("Tickets remaining to be released: " + (ticketsRemainingToBeReleased - ticketCount));
        logger.info("Vendor [" + vendor + "] released " + ticketCount + " " + title + " ticket(s).");
        logger.info("Current pool size: " + ticketPool.size() + "/" + maxTicketCapacity + ".");
    }

    /**
     * Allows a customer to retrieve tickets from the pool based on the retrieval rate.
     * The method removes tickets from the pool, updates the number of tickets sold, and tracks the number of customers.
     * If all tickets are sold, it will stop the simulation.
     * This method is synchronized to ensure thread-safe access.
     */
    public synchronized void purchaseTicket() {
        if (simulationComplete) return;

        // Check if tickets are available in the pool
        if (ticketPool.isEmpty() && ticketsSold < totalTickets) {
            logger.warning("The ticket pool is empty, but tickets are still available for release.");
            return;
        }

        int ticketsRetrieved = 0;

        // Retrieve tickets based on the customer's retrieval rate
        while (!ticketPool.isEmpty() && ticketsRetrieved < customerRetrievalRate) {
            ticketPool.remove(0);
            ticketsRetrieved++;
            ticketsSold++;
        }

        customers++;
        logger.info("Customer [" + customers + "] retrieved " + ticketsRetrieved + " " + title + " ticket(s).");
        logger.info("Current pool size: " + ticketPool.size() + "/" + maxTicketCapacity + ".");

        // Stop simulation only if all tickets are sold
        if (ticketsSold >= totalTickets) {
            stopSimulation();
        }
    }

    /**
     * Stops the ticket-selling simulation if all tickets have been sold.
     * This method is synchronized to ensure thread-safe access.
     */
    public synchronized void stopSimulation() {
        if (!simulationComplete && ticketsSold >= totalTickets) {
            simulationComplete = true;
            logger.info("Simulation completed. All tickets sold.");
        }
    }

    /**
     * Returns the current size of the ticket pool.
     *
     * @return the size of the ticket pool
     */
    public synchronized int getTicketPoolSize() {
        return ticketPool.size();
    }

    /**
     * Checks whether the simulation is complete (all tickets sold).
     *
     * @return true if the simulation is complete, false otherwise
     */
    public boolean isSimulationComplete() {
        return simulationComplete;
    }

    /**
     * Interrupts the simulation, marking it as complete and preventing further ticket additions or retrievals.
     * This method is synchronized to ensure thread-safe access.
     */
    public synchronized void interruptSimulation() {
        simulationComplete = true;
        logger.warning("Simulation interrupted.");
    }
}
