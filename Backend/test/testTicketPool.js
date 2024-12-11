const TicketPool = require('../controllers/TicketPool');

function runTests() {
    console.log("Starting TicketPool Tests...");

    const vendor = 'Vendor1';
    const maxTicketCapacity = 50;
    const totalTickets = 100;
    const ticketReleaseRate = 1000;
    const customerRetrievalRate = 1000;
    const title = 'Concert';

    const ticketPool = new TicketPool(
        vendor,
        maxTicketCapacity,
        totalTickets,
        ticketReleaseRate,
        customerRetrievalRate,
        title
    );

    // Test 1: Adding Tickets to the Pool
    console.log("Test 1: Adding Tickets to the Pool");
    ticketPool.addTickets(50, vendor);
    if (ticketPool.ticketPool.length === 50) {
        console.log("✔ Test 1 Passed");
    } else {
        console.error("✘ Test 1 Failed");
    }

    // Test 2: Exceeding Max Ticket Capacity
    console.log("Test 2: Exceeding Max Ticket Capacity");
    ticketPool.addTickets(100, vendor); // Exceeds capacity
    if (ticketPool.ticketPool.length === maxTicketCapacity) {
        console.log("✔ Test 2 Passed");
    } else {
        console.error("✘ Test 2 Failed");
        console.log(ticketPool.ticketPool.length);
    }

    // Test 3: Purchasing a Ticket
    console.log("Test 3: Purchasing a Ticket");
    ticketPool.purchaseTicket();
    if (ticketPool.ticketPool.length === maxTicketCapacity - 1 && ticketPool.ticketsSold === 1) {
        console.log("✔ Test 3 Passed");
    } else {
        console.error("✘ Test 3 Failed");
    }

// Test 4: Multiple Customers Purchasing Tickets
    console.log("Test 4: Multiple Customers Purchasing Tickets");

// Refill ticket pool for the test
    ticketPool.addTickets(maxTicketCapacity - ticketPool.ticketPool.length, vendor);

    const initialTicketCount = ticketPool.ticketPool.length;
    const customers = 10; // Simulate 10 customers purchasing tickets
    const ticketsToPurchase = Math.min(customers, initialTicketCount);

    let purchaseErrors = 0;

    for (let i = 0; i < customers; i++) {
        try {
            ticketPool.purchaseTicket();
        } catch (err) {
            purchaseErrors++;
            console.error("Error during purchase:", err.message);
        }
    }

    if (
        ticketPool.ticketsSold === ticketsToPurchase &&
        ticketPool.ticketPool.length === initialTicketCount - ticketsToPurchase &&
        purchaseErrors === 0
    ) {
        console.log("✔ Test 4 Passed");
    } else {
        console.error("✘ Test 4 Failed");
        console.log("Tickets Sold:", ticketPool.ticketsSold);
        console.log("Remaining Tickets:", ticketPool.ticketPool.length);
        console.log("Purchase Errors:", purchaseErrors);
    }


    // Test 5: Interrupt Simulation
    console.log("Test 5: Interrupt Simulation");
    ticketPool.interruptSimulation();
    const initialTickets = ticketPool.ticketPool.length;
    ticketPool.addTickets(10, vendor);
    if (ticketPool.ticketPool.length === initialTickets) {
        console.log("✔ Test 5 Passed");
    } else {
        console.error("✘ Test 5 Failed");
    }


    console.log("All tests completed.");
}

// Run the tests
runTests();
