package com.ticketing.event.model;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Customer implements Runnable {
    private final TicketPool ticketPool;
    private final String event;

    public Customer(TicketPool ticketPool, String event) {
        this.ticketPool = ticketPool;
        this.event = event;
    }

    @Override
    public void run() {
        while (true) {
            String ticket = ticketPool.removeTicket(event);
            if (ticket != null) {
                log.info("{} purchased {}", Thread.currentThread().getName(), ticket);
            } else {
                log.info("{} could not purchase a ticket. Tickets sold out!", Thread.currentThread().getName());
                break; // Exit loop when tickets are sold out
            }
            try {
                Thread.sleep(500); // Simulate retrieval rate
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Customer thread interrupted: {}", Thread.currentThread().getName(), e);
                break;
            }
        }
    }
}
