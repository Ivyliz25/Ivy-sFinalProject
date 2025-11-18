// traderController.js
export const updateTraderProfile = async (req, res, next) => {
    try {
        const { bio, location, rating } = req.body;

        // Validate rating if provided
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Build updates object dynamically
        const updates = {};
        if (bio !== undefined) updates.bio = bio;
        if (location !== undefined) updates.location = location;
        if (rating !== undefined) updates.rating = rating;

        const trader = await Trader.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!trader) return res.status(404).json({ message: 'Trader not found' });
        res.json(trader);

    } catch (error) {
        next(error);
    }
};
