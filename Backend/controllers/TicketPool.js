const { EventEmitter } = require('events');
const { Worker, isMainThread, parentPort } = require('worker_threads');

class TicketPool extends EventEmitter {
    constructor(vendor, maxTicketCapacity, totalTickets, ticketReleaseRate, customerRetrievalRate, title, releaseInterval, retrievalInterval) {
        super();
        this.vendor = vendor;
        this.maxTicketCapacity = maxTicketCapacity;
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.customerRetrievalRate = customerRetrievalRate;
        this.title = title;
        this.releaseInterval = releaseInterval;
        this.retrievalInterval = retrievalInterval;
        this.ticketPool = [];
        this.active = true;
        this.customers = 0;
        this.ticketsSold = 0;
        this.simulationComplete = false;
        this.logs = [];

        // Override console.log to capture outputs
        const originalLog = console.log;
        console.log = (message) => {
            this.logs.push(message);
            originalLog(message);
        };

        // Start both producer and consumer workers
        this.startProducerWorker();
        this.startConsumerWorker();
    }

    // Method to add tickets to the pool
    addTickets(ticketCount, vendor) {
        if (this.simulationComplete) return;

        const ticketsRemainingToBeReleased = this.totalTickets - this.ticketsSold - this.ticketPool.length;
        const availableSpace = this.maxTicketCapacity - this.ticketPool.length;

        // Check if there's enough space in the pool
        if (availableSpace < ticketCount) {
            if(ticketCount == ticketsRemainingToBeReleased){
                console.log('Simulation Started');
                return;
            }
            console.log("Not enough space in the pool to release more tickets.");
            return;
        }

        // Check if there are enough tickets remaining to be released
        if (ticketsRemainingToBeReleased < ticketCount) {
            console.log("There are not enough tickets remaining to be released.");
            return;
        }


        for (let i = 0; i < ticketCount; i++) {
            const ticketId = Math.floor(Math.random() * 1000); // Generate unique ticket ID
            this.ticketPool.push(ticketId);
        }

        console.log(`Vendor [${this.vendor}] released ${ticketCount} ${this.title} ticket(s).`);
        console.log(`Current pool size: ${this.ticketPool.length}/${this.maxTicketCapacity}.`);
        console.log(`Tickets remaining to be released: ${ticketsRemainingToBeReleased - ticketCount}`);
    }

    // Method for customers to purchase tickets
    purchaseTicket() {
        if (this.simulationComplete) return;

        if (this.ticketPool.length === 0) {
            console.log("The ticket pool is empty. No tickets available for purchase.");
            return;
        }

        let ticketsRetrieved = 0;

        while (this.ticketPool.length > 0 && ticketsRetrieved < this.customerRetrievalRate) {
            this.ticketPool.shift(); // Retrieve one ticket
            ticketsRetrieved++;
            this.ticketsSold++;
        }

        if (ticketsRetrieved > 0) {
            this.customers++;
            console.log(`Customer [${this.customers}] retrieved ${ticketsRetrieved} ${this.title} ticket(s).`);
        }

        console.log(`Current pool size: ${this.ticketPool.length}/${this.maxTicketCapacity}.`);

        if (this.ticketPool.length === 0 && this.ticketsSold >= this.totalTickets) {
            this.stopSimulation();
        }
    }


    // Stop the simulation
    stopSimulation() {
        this.simulationComplete = true;
        console.log("Simulation completed. All tickets sold.");
    }

    // External method to interrupt the simulation
    interruptSimulation() {
        this.simulationComplete = true;
        console.log("Simulation has been interrupted.");
    }

    // Check if the simulation is complete
    isSimulationComplete() {
        return this.simulationComplete;
    }

    // Get current size of the ticket pool
    getTicketPoolSize() {
        return this.simulationComplete ? 0 : this.ticketPool.length;
    }

    // Method to calculate and return remaining tickets
    getRemainingTickets() {
        const ticketsRemaining = this.totalTickets - this.ticketsSold;
        return {
            ticketsRemaining,
            simulationComplete: this.simulationComplete,
        };
    }


    // Producer: Simulates vendors adding tickets
    async startProducerWorker() {
        const producerWorker = new Worker(__filename);

        producerWorker.on('message', (msg) => {
            if (msg.action === 'addTickets') {
                this.addTickets(msg.ticketCount, msg.vendor);
            }
        });

        producerWorker.on('error', (error) => {
            console.error('Error in producer worker:', error);
        });

        // Send message to the worker with necessary parameters
        producerWorker.postMessage({
            action: 'startProducer',
            ticketReleaseRate: this.ticketReleaseRate,
            releaseInterval: this.releaseInterval,
            vendor: this.vendor,
            totalTickets: this.totalTickets,
            ticketsSold: this.ticketsSold,
            maxTicketCapacity: this.maxTicketCapacity,
            title: this.title,
            ticketPoolLength: this.ticketPool.length,
            ticketPool: this.ticketPool
        });
    }

    // Consumer: Simulates customers purchasing tickets
    async startConsumerWorker() {
        const consumerWorker = new Worker(__filename);

        consumerWorker.on('message', () => {
            this.purchaseTicket();
        });

        consumerWorker.on('error', (error) => {
            console.error('Error in consumer worker:', error);
        });

        consumerWorker.postMessage({
            action: 'startConsumer',
            customerRetrievalRate: this.customerRetrievalRate,
            retrievalInterval: this.retrievalInterval,
            ticketPoolLength: this.ticketPool.length,
            ticketPool: this.ticketPool
        });
    }

    // Method to retrieve all console logs
    getLogs() {
        return this.logs;
    }
}

// Worker logic in the same file
if (!isMainThread) {
    runWorkerLogic();
}

function runWorkerLogic() {
    parentPort.on('message', (msg) => {
        if (msg.action === 'startProducer') {
            // Use ticketPoolLength to control ticket addition
            setInterval(() => {
                if (msg.ticketPoolLength === msg.totalTickets) {
                    // Stop the producer if all tickets have been released
                    console.log("All tickets have been added. Stopping producer.");
                    return;
                }

                const ticketsToAdd = Math.min(
                    Math.floor(msg.ticketReleaseRate),
                    msg.totalTickets - msg.ticketsSold - msg.ticketPoolLength
                );
                const vendorName = `Vendor ${Math.floor(Math.random() * msg.vendor) + 1}`;
                parentPort.postMessage({
                    action: 'addTickets',
                    ticketCount: ticketsToAdd,
                    vendor: vendorName
                });
            }, msg.releaseInterval);
        }

        if (msg.action === 'startConsumer') {
            // Simulate customer ticket purchase
            setInterval(() => {
                if (msg.ticketPool && msg.ticketPool.length > 0) {
                    parentPort.postMessage({
                        action: 'purchaseTicket'
                    });
                } else {
                    parentPort.postMessage({
                        action: 'noTicketsAvailable'
                    });
                }
            }, msg.retrievalInterval);
        }
    });
}

module.exports = TicketPool;
