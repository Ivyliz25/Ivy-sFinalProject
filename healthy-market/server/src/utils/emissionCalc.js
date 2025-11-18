export const calculateCarbonEmission = (wasteKg) => {
    // Simple emission factor: 0.5 kg CO2 per kg waste
    return wasteKg * 0.5;
};
