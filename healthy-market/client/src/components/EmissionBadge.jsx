import React from 'react';

const EmissionBadge = ({ emission }) => {
    let color = emission < 5 ? 'green' : emission < 15 ? 'orange' : 'red';
    return <span style={{ background: color, color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{emission} kg CO2</span>;
};

export default EmissionBadge;
