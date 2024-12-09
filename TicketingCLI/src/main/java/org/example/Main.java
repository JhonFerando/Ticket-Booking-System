package org.example;

import org.example.controller.MenuManager;

public class Main {

    // Main method of the ticketing application
    public static void main(String[] args) {
        // Instantiate the MenuManager to handle user interaction and menu logic
        MenuManager menuManager = new MenuManager();

        // Run the menu system to start the application flow
        menuManager.run();
    }
}
