export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', '),
        });
    }
    
    // Handle mongoose duplicate key errors
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
    });
};
