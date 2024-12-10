const { EventEmitter } = require('events');
const { Worker, isMainThread, parentPort } = require('worker_threads');

class TicketPool extends EventEmitter {
    constructor(vendor, maxTicketCapacity, totalTickets, ticketReleaseRate, customerRetrievalRate, title) {
        super();
        this.vendor = vendor;
        this.maxTicketCapacity = maxTicketCapacity;
        this.totalTickets = totalTickets;
        this.ticketReleaseRate = ticketReleaseRate;
        this.customerRetrievalRate = customerRetrievalRate;
        this.title = title;
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

    // Adds tickets to the pool by vendors
    addTickets(ticketCount, vendor) {
        if (this.simulationComplete) return;

        const ticketsRemainingToBeReleased = this.totalTickets - this.ticketsSold - this.ticketPool.length;

        if (ticketCount > ticketsRemainingToBeReleased) {
            ticketCount = ticketsRemainingToBeReleased;
        }

        if (ticketCount > 0 && this.ticketPool.length + ticketCount <= this.maxTicketCapacity) {
            for (let i = 0; i < ticketCount; i++) {
                const ticketId = Math.floor(Math.random() * 1000);
                this.ticketPool.push(ticketId);
            }

            console.log(`Vendor [${this.vendor}] added ${ticketCount} ${this.title} ticket(s).`);
            console.log(`Ticket pool size: ${this.ticketPool.length}/${this.maxTicketCapacity}`);
            console.log(`Tickets remaining to be released: ${ticketsRemainingToBeReleased - ticketCount}`);
            this.emit('ticketAdded'); // Notify consumers
        } else if (ticketsRemainingToBeReleased === 0) {
            console.log("No tickets remaining to be released.");
        } else {
            console.log("Ticket pool is full. Cannot add more tickets.");
        }
    }

    // Consumer purchases tickets at a specific rate
    purchaseTicket() {
        if (this.simulationComplete) return;

        if (this.ticketPool.length > 0) {
            const ticketId = this.ticketPool.shift();
            this.customers++;
            this.ticketsSold++;
            const ticketsRemainingToBeReleased = this.totalTickets - this.ticketsSold - this.ticketPool.length;

            console.log(`Customer [${this.customers}] purchased ${this.title} ticket with ID ${ticketId}.  That ticket related to ${this.vendor}`);
            console.log(`Tickets left in pool: ${this.ticketPool.length}`);
            console.log(`Tickets remaining to be released to the pool: ${Math.max(0, ticketsRemainingToBeReleased)}`);

            if (this.ticketsSold === this.totalTickets) {
                console.log("All tickets have been sold!");
                this.stopSimulation();
            }
        } else {
            console.log("No tickets available for purchase.");
        }
    }


    // Interrupt the simulation
    interruptSimulation() {
        this.simulationComplete = true;
        console.log("The current simulation is interrupted.");
    }

    // Stop the simulation
    stopSimulation() {
        this.simulationComplete = true;
        console.log("Simulation stopped. All tickets have been released and purchased.");
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
            ticketPoolLength: this.ticketPool.length,
            ticketPool: this.ticketPool
        });
    }

    // Start the simulation
    startSimulation() {
        console.log("Simulation started.");
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
        console.log("Received message in worker:", msg);

        if (msg.action === 'startProducer') {
            // Use ticketPoolLength to control ticket addition
            setInterval(() => {
                if (msg.ticketPoolLength === msg.totalTickets) {
                    // Stop the producer if all tickets have been released
                    console.log("All tickets have been added. Stopping producer.");
                    return;
                }

                const ticketsToAdd = Math.min(
                    Math.floor(Math.random() * 10) + 1,
                    msg.totalTickets - msg.ticketsSold - msg.ticketPoolLength
                );
                const vendorName = `Vendor ${Math.floor(Math.random() * msg.vendor) + 1}`;
                parentPort.postMessage({
                    action: 'addTickets',
                    ticketCount: ticketsToAdd,
                    vendor: vendorName
                });
            }, msg.ticketReleaseRate);
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
            }, msg.customerRetrievalRate);
        }
    });
}

module.exports = TicketPool;
