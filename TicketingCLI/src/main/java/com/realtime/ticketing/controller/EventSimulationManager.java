package com.realtime.ticketing.controller;

import com.realtime.ticketing.model.Configuration;
import com.realtime.ticketing.model.Customer;
import com.realtime.ticketing.model.TicketPool;
import com.realtime.ticketing.model.Vendor;
import java.util.List;
import java.util.Scanner;

public class EventSimulationManager {

    private volatile boolean simulationActive = false;

    private TicketPool ticketPool = null;

    public void startSimulation(List<Configuration> configurations, Scanner scanner) {
        if (configurations.isEmpty()) {
            System.out.println("No configurations available. Please add or load configurations first.\n");
            return;
        }

        System.out.print("Enter the Event Ticket ID to start the simulation: ");
        int ticketId = scanner.nextInt();
        scanner.nextLine();

        Configuration selectedConfig = configurations.stream()
                .filter(config -> config.getEventTicketId() == ticketId)
                .findFirst()
                .orElse(null);

        if (selectedConfig == null) {
            System.out.println("Invalid Event Ticket ID. Please try again.\n");
            return;
        }

        if (simulationActive) {
            System.out.println("A simulation is already running. Please stop it before starting a new one.\n");
            return;
        }

        initializeSimulation(selectedConfig);
    }

    private void initializeSimulation(Configuration config) {
        ticketPool = new TicketPool(
                config.getVendorName(),
                config.getMaxTicketCapacity(),
                config.getTotalTickets(),
                config.getTicketReleaseRate(),
                config.getCustomerRetrievalRate(),
                config.getTitle()
        );

        System.out.println("Ticket pool created with capacity: " + config.getMaxTicketCapacity() + ".");
        simulationActive = true;

        simulationActive = true;

        Thread vendorThread = new Thread(new Vendor(ticketPool, config.getTicketReleaseRate(), config.getTicketReleaseInterval()));
        Thread customerThread = new Thread(new Customer(ticketPool, config.getCustomerRetrievalRate(), config.getCustomerRetrievalInterval()));

        vendorThread.start();
        customerThread.start();

        System.out.println("Vendor and Customer threads started.\n");

        monitorTicketPool();
    }

    private void monitorTicketPool() {
        new Thread(() -> {
            while (simulationActive) {
                try {
                    Thread.sleep(2000);

                    if (ticketPool != null && ticketPool.getTicketPoolSize() == 0 && !ticketPool.isSimulationComplete()) {
                        ticketPool.stopSimulation();
                        simulationActive = false;
                        System.out.println("All tickets sold out. Ending simulation automatically.\n");
                    }
                } catch (InterruptedException e) {
                    System.err.println("Monitor thread interrupted: " + e.getMessage());
                }
            }
        }).start();
    }

    public void stopSimulation() {
        if (!simulationActive) {
            System.out.println("No active simulation to stop.\n");
            return;
        }

        simulationActive = false;

        if (ticketPool != null) {
            ticketPool.interruptSimulation();
        }

        System.out.println("Simulation stopped successfully.\n");
    }
}
