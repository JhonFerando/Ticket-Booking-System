package com.ticketing.event;

import com.ticketing.event.config.SystemConfiguration;
import com.ticketing.event.model.TicketPool;
import com.ticketing.event.service.CustomerService;
import com.ticketing.event.service.TicketPoolService;
import com.ticketing.event.service.VendorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Scanner;

@SpringBootApplication
public class EventTicketingSystemApplication implements CommandLineRunner {

	@Autowired
	private SystemConfiguration config;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private VendorService vendorService;

	@Autowired
	private TicketPoolService ticketPoolService;

	public static void main(String[] args) {
		SpringApplication.run(EventTicketingSystemApplication.class, args);
	}

	@Override
	public void run(String... args) {
		try {
			System.out.println("Starting Event Ticketing System...");
			initializeDefaultEvents();
			startCLI();
		} catch (Exception e) {
			System.err.println("Error during application startup: " + e.getMessage());
			e.printStackTrace();
		}
	}

	private void initializeDefaultEvents() {
		// Initialize events from configuration (optional)
		String defaultEvent = config.getDefaultEvent();
		int maxCapacity = config.getMaxTicketCapacity();
		if (defaultEvent != null && !defaultEvent.isEmpty() && maxCapacity > 0) {
			ticketPoolService.initializeEvent(defaultEvent, maxCapacity);
			System.out.println("Initialized default event '" + defaultEvent + "' with capacity: " + maxCapacity);
		} else {
			System.out.println("No default event configured. You can add events via CLI.");
		}
	}

	private void startCLI() {
		Scanner scanner = new Scanner(System.in);
		while (true) {
			System.out.println("\n--- Event Ticketing System CLI ---");
			System.out.println("1. Initialize Event");
			System.out.println("2. Add Vendor");
			System.out.println("3. Add Customers");
			System.out.println("4. View Remaining Tickets");
			System.out.println("5. Exit");
			System.out.print("Choose an option: ");

			try {
				int choice = Integer.parseInt(scanner.nextLine());
				switch (choice) {
					case 1 -> initializeEventCLI(scanner);
					case 2 -> addVendorCLI(scanner);
					case 3 -> addCustomersCLI(scanner);
					case 4 -> viewRemainingTicketsCLI(scanner);
					case 5 -> {
						System.out.println("Exiting system...");
						return;
					}
					default -> System.out.println("Invalid choice. Please try again.");
				}
			} catch (NumberFormatException e) {
				System.out.println("Invalid input. Please enter a number.");
			} catch (Exception e) {
				System.err.println("An error occurred: " + e.getMessage());
			}
		}
	}

	private void initializeEventCLI(Scanner scanner) {
		System.out.print("Enter event name: ");
		String event = scanner.nextLine();
		System.out.print("Enter maximum capacity: ");
		int maxCapacity = Integer.parseInt(scanner.nextLine());
		ticketPoolService.initializeEvent(event, maxCapacity);
		System.out.println("Event '" + event + "' initialized with capacity: " + maxCapacity);
	}

	private void addVendorCLI(Scanner scanner) {
		System.out.print("Enter event name: ");
		String event = scanner.nextLine();
		if (!ticketPoolService.eventExists(event)) {
			System.out.println("Error: Event '" + event + "' is not initialized.");
			return;
		}
		System.out.print("Enter release rate (tickets/second): ");
		int releaseRate = Integer.parseInt(scanner.nextLine());
		vendorService.startVendors(ticketPoolService.getTicketPool(), event, releaseRate);
		System.out.println("Vendor for event '" + event + "' started with release rate: " + releaseRate);
	}

	private void addCustomersCLI(Scanner scanner) {
		System.out.print("Enter event name: ");
		String event = scanner.nextLine();
		if (!ticketPoolService.eventExists(event)) {
			System.out.println("Error: Event '" + event + "' is not initialized.");
			return;
		}
		System.out.print("Enter number of customers: ");
		int customerCount = Integer.parseInt(scanner.nextLine());
		customerService.startCustomers(ticketPoolService.getTicketPool(), customerCount, event);
		System.out.println(customerCount + " customers added for event '" + event + "'.");
	}

	private void viewRemainingTicketsCLI(Scanner scanner) {
		System.out.print("Enter event name: ");
		String event = scanner.nextLine();
		if (!ticketPoolService.eventExists(event)) {
			System.out.println("Error: Event '" + event + "' is not initialized.");
			return;
		}
		int remainingTickets = ticketPoolService.getTicketCount(event);
		System.out.println("Remaining tickets for event '" + event + "': " + remainingTickets);
	}
}
