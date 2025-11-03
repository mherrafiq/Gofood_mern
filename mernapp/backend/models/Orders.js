const mongoose = require('mongoose')

const { Schema } = mongoose;

const OrderSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    order_data: {
        type: Array,
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Create index on email (NOT unique since user can have multiple orders)
OrderSchema.index({ email: 1 });

module.exports = mongoose.model('order', OrderSchema);