package com.ticketing.event.model;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Vendor implements Runnable {
    private final TicketPool ticketPool;
    private final String eventName;
    private final int releaseRate;

    public Vendor(TicketPool ticketPool, String eventName, int releaseRate) {
        this.ticketPool = ticketPool;
        this.eventName = eventName;
        this.releaseRate = releaseRate;
    }

    @Override
    public void run() {
        while (true) {
            ticketPool.addTickets(eventName, releaseRate);
            log.info("Vendor {} released {} tickets for event: {}", Thread.currentThread().getName(), releaseRate, eventName);
            try {
                Thread.sleep(1000); // 1-second interval
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                log.error("Vendor thread interrupted for event: {}", eventName, e);
                break;
            }
        }
    }
}
