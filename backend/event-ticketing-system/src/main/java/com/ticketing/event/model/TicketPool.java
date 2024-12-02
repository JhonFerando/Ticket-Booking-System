package com.ticketing.event.model;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
public class TicketPool {
    private final Map<String, Queue<String>> eventTickets = new HashMap<>();
    private final Lock lock = new ReentrantLock();

    // Initialize an event with a specified number of tickets
    public void initializeEvent(String event, int initialTickets) {
        lock.lock();
        try {
            if (eventTickets.containsKey(event)) {
                log.warn("Event '{}' is already initialized.", event);
                throw new IllegalArgumentException("Event '" + event + "' is already initialized.");
            }
            Queue<String> tickets = new LinkedList<>();
            for (int i = 1; i <= initialTickets; i++) {
                tickets.add(event + "-Ticket-" + i);
            }
            eventTickets.put(event, tickets);
            log.info("Initialized event '{}' with {} tickets.", event, initialTickets);
        } finally {
            lock.unlock();
        }
    }

    // Add tickets to an event
    public void addTickets(String event, int count) {
        lock.lock();
        try {
            Queue<String> tickets = eventTickets.get(event);
            if (tickets == null) {
                log.warn("Cannot add tickets: Event '{}' is not initialized.", event);
                throw new IllegalArgumentException("Event '" + event + "' is not initialized.");
            }
            for (int i = 0; i < count; i++) {
                tickets.add(event + "-ExtraTicket-" + (tickets.size() + 1));
            }
            log.info("Added {} tickets to event '{}'. Total tickets now: {}", count, event, tickets.size());
        } finally {
            lock.unlock();
        }
    }

    // Remove a ticket from an event
    public String removeTicket(String event) {
        lock.lock();
        try {
            Queue<String> tickets = eventTickets.get(event);
            if (tickets == null) {
                log.warn("Cannot remove ticket: Event '{}' is not initialized.", event);
                throw new IllegalArgumentException("Event '" + event + "' is not initialized.");
            }
            if (tickets.isEmpty()) {
                log.warn("No tickets available for event '{}'.", event);
                return null;
            }
            String ticket = tickets.poll();
            log.info("Removed ticket '{}' from event '{}'. Remaining tickets: {}", ticket, event, tickets.size());
            return ticket;
        } finally {
            lock.unlock();
        }
    }

    // Get the remaining ticket count for an event
    public int getTicketCount(String event) {
        lock.lock();
        try {
            Queue<String> tickets = eventTickets.get(event);
            if (tickets == null) {
                log.warn("Cannot get ticket count: Event '{}' is not initialized.", event);
                return 0;
            }
            return tickets.size();
        } finally {
            lock.unlock();
        }
    }

    // Check if an event exists
    public boolean eventExists(String event) {
        lock.lock();
        try {
            return eventTickets.containsKey(event);
        } finally {
            lock.unlock();
        }
    }
}
