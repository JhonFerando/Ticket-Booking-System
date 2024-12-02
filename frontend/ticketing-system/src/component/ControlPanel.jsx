import React, { useState } from 'react';

const ControlPanel = ({ onStart, onStop }) => {
    return (
        <div>
            <h2>Control Panel</h2>
            <button onClick={onStart}>Start System</button>
            <button onClick={onStop}>Stop System</button>
        </div>
    );
};

export default ControlPanel;
