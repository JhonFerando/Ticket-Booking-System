package com.realtime.ticketing;

import com.realtime.ticketing.controller.MenuManager;

/**
 * Main entry point for the ticketing application.
 * <p>This class is responsible for initiating the application's menu system and starting the user interaction flow.</p>
 * @author Dharshan
 */
public class TicketingApplication {

    /**
     * Main method of the ticketing application.
     * <p>This method serves as the entry point of the application. It initializes the MenuManager
     * and starts the menu system which handles user input and controls the flow of the application.</p>
     *
     * @param args Command-line arguments, not used in this application.
     */
    public static void main(String[] args) {
        // Instantiate the MenuManager to handle user interaction and menu logic
        MenuManager menuManager = new MenuManager();

        // Run the menu system to start the application flow
        menuManager.run();
    }
}
