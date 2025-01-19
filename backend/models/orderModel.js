// models/Order.js
import mongoose, { Schema } from 'mongoose';

const orderSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    total_amount: { type: Number, required: true },
    paymentmode: { type: String },
    order_status: { type: String, default: 'Pending' }, // Default status
    dispatched: { type: Boolean, default: false }, // New field
    ordertime: { type: Date, default: Date.now },
    estimatedtime: { type: Date },
    delivery_address: { type: String },
    tracking_number: { type: String }
}, {
    timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;