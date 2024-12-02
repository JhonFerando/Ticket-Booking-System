package com.ticketing.event.service;

import com.ticketing.event.model.TicketPool;
import org.springframework.stereotype.Service;

@Service
public class VendorService {

    /**
     * Starts a single vendor thread for releasing tickets to the event.
     *
     * @param ticketPool the shared TicketPool object
     * @param event the event name
     * @param releaseRate the number of tickets released per second
     */
    public void startVendor(TicketPool ticketPool, String event, int releaseRate) {
        System.out.println("Starting vendor for event: " + event);

        Thread vendorThread = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    ticketPool.addTickets(event, releaseRate); // Add tickets to the pool
                    System.out.println("Vendor released " + releaseRate + " tickets for event: " + event);
                    Thread.sleep(1000); // Add tickets every second
                }
            } catch (InterruptedException e) {
                System.err.println("Vendor thread interrupted for event: " + event);
                Thread.currentThread().interrupt(); // Reset the interrupt status
            }
        });

        vendorThread.setName("Vendor-" + event); // Optional: Set a meaningful thread name
        vendorThread.start();
    }

    /**
     * Starts multiple vendor threads for an event.
     *
     * @param ticketPool the shared TicketPool object
     * @param event the event name
     * @param releaseRate the number of tickets released per vendor per second
     * @param vendorCount the number of vendor threads to start
     */
    public void startVendors(TicketPool ticketPool, String event, int releaseRate, int vendorCount) {
        System.out.println("Starting " + vendorCount + " vendor(s) for event: " + event);
        for (int i = 0; i < vendorCount; i++) {
            startVendor(ticketPool, event, releaseRate);
        }
    }
}
