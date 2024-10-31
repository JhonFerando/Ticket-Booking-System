package com.example.demo;

import java.io.Serializable;

public class Configuration implements Serializable {
    private int totalTickets;
    private int ticketReleaseRate;
    private int customerRetrievalRate;
    private int maxTicketCapacity;

    public int getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(int totalTickets) {
        if (totalTickets <= 0) {
            throw new IllegalArgumentException("Total tickets must be greater than 0.");
        }
        this.totalTickets = totalTickets;
    }

    public int getTicketReleaseRate() {
        return ticketReleaseRate;
    }

    public void setTicketReleaseRate(int ticketReleaseRate) {
        if (ticketReleaseRate <= 0) {
            throw new IllegalArgumentException("Ticket release rate must be greater than 0.");
        }
        this.ticketReleaseRate = ticketReleaseRate;
    }

    public int getCustomerRetrievalRate() {
        return customerRetrievalRate;
    }

    public void setCustomerRetrievalRate(int customerRetrievalRate) {
        if (customerRetrievalRate <= 0) {
            throw new IllegalArgumentException("Customer retrieval rate must be greater than 0.");
        }
        this.customerRetrievalRate = customerRetrievalRate;
    }

    public int getMaxTicketCapacity() {
        return maxTicketCapacity;
    }

    public void setMaxTicketCapacity(int maxTicketCapacity) {
        if (maxTicketCapacity <= 0) {
            throw new IllegalArgumentException("Maximum ticket capacity must be greater than 0.");
        }
        this.maxTicketCapacity = maxTicketCapacity;
    }

    @Override
    public String toString() {
        return "Configuration{" +
                "totalTickets=" + totalTickets +
                ", ticketReleaseRate=" + ticketReleaseRate +
                ", customerRetrievalRate=" + customerRetrievalRate +
                ", maxTicketCapacity=" + maxTicketCapacity +
                '}';
    }
}
