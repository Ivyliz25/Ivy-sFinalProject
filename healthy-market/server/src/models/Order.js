import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        carbonEmission: {
            type: Number,
            default: 0
        },
        trader: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        image: String
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    totalEmissions: {
        type: Number,
        required: true
    },
    customerInfo: {
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'USA'
        }
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'paypal'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    shippingInfo: {
        trackingNumber: String,
        carrier: String,
        estimatedDelivery: Date,
        shippedAt: Date,
        deliveredAt: Date
    }
}, {
    timestamps: true
});

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
    if (!this.orderNumber) {
        this.orderNumber = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
    next();
});

// Static method to get orders by customer
orderSchema.statics.findByCustomer = function(customerId) {
    return this.find({ customer: customerId }).populate('items.trader items.product').sort({ orderDate: -1 });
};

// Instance method to calculate totals
orderSchema.methods.calculateTotals = function() {
    this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totalEmissions = this.items.reduce((total, item) => total + ((item.carbonEmission || 0) * item.quantity), 0);
};

// Virtual for formatted order date
orderSchema.virtual('formattedDate').get(function() {
    return this.orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Order', orderSchema);