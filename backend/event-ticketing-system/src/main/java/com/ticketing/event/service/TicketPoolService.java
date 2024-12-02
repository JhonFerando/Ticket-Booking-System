package com.ticketing.event.service;

import com.ticketing.event.model.TicketPool;
import org.springframework.stereotype.Service;

@Service
public class TicketPoolService {
    private final TicketPool ticketPool = new TicketPool();

    public void initializeEvent(String event, int maxCapacity) {
        ticketPool.initializeEvent(event, maxCapacity);
    }

    public boolean eventExists(String event) {
        return ticketPool.getTicketCount(event) > 0; // Simplistic check for existence
    }

    public TicketPool getTicketPool() {
        return ticketPool;
    }

    public int getTicketCount(String event) {
        return ticketPool.getTicketCount(event);
    }
}
