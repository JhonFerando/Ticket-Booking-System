import React, { useState } from 'react';
import ConfigurationForm from '../src/component/ConfigurationForm';
import TicketDisplay from '../src/component/TicketDisplay';
import ControlPanel from '../src/component/ControlPanel';
import LogDisplay from '../src/component/LogDisplay';

const App = () => {
    const [systemRunning, setSystemRunning] = useState(false);

    const startSystem = () => {
        // Make an API call to start the system
        setSystemRunning(true);
    };

    const stopSystem = () => {
        // Make an API call to stop the system
        setSystemRunning(false);
    };

    const handleConfigurationSubmit = (config) => {
        // Send configuration to backend to initialize the system
        console.log('System Configuration:', config);
        // Call an API to set the config
    };

    return (
        <div>
            <h1>Real-Time Ticketing System</h1>
            <ConfigurationForm onSubmit={handleConfigurationSubmit} />
            <TicketDisplay />
            <ControlPanel onStart={startSystem} onStop={stopSystem} />
            {systemRunning && <LogDisplay />}
        </div>
    );
};

export default App;
