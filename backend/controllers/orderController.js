// // controllers/orderController.js
// import Order from '../models/orderModel.js';
// import User from '../models/userModel.js'; // Import User model
// // import sendEmail from '../utils/emailSender.js'; // Import email utility

// // Create a new order
// const createOrder = async (req, res) => {
//     try {
//         const { user_id, total_amount, paymentmode, order_status, delivery_address, tracking_number } = req.body;

//         const newOrder = new Order({
//             user_id,
//             total_amount,
//             paymentmode,
//             order_status,
//             delivery_address,
//             tracking_number
//         });

//         const savedOrder = await newOrder.save();
//         res.status(201).json(savedOrder);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get all orders
// const fetchAllOrders = async (req, res) => {
//     try {
//         const orders = await Order.find().populate('user_id');
//         res.status(200).json(orders);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Get a single order by ID
// const fetchOrderById = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id).populate('user_id');
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.status(200).json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Update an order
// const updateOrder = async (req, res) => {
//     try {
//         const { order_status, delivery_address, tracking_number, estimatedtime } = req.body;

//         const updatedOrder = await Order.findByIdAndUpdate(
//             req.params.id,
//             { order_status, delivery_address, tracking_number, estimatedtime },
//             { new: true }
//         ).populate('user_id'); // Populate user details to get email

//         if (!updatedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Check if the order status is updated to "Dispatched"
//         // if (order_status === 'Out for Delivery') {
//         //     const user = await User.findById(updatedOrder.user_id); // Fetch user details
//         //     if (user) {
//         //         const emailText = `Hi ${user.name},\n\nGreat news! 🎉 Your order (ID: ${updatedOrder._id}) is out for delivery and will be arriving today. Get ready to receive your package!\n\nWe hope you love your purchase. If you have any questions or need assistance, feel free to reach out to us.\n\nThank you for shopping with us!\n\nBest regards,\nAdaa Jaipur.`;// Send email to the user
//         //         await sendEmail(user.email, 'Order Dispatched', emailText);
//         //     }
//         // }

//         res.status(200).json(updatedOrder);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Delete an order
// const deleteOrder = async (req, res) => {
//     try {
//         const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//         if (!deletedOrder) {
//             return res.status(404).json({ message: 'Order not found' });
//         }
//         res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export {
//     createOrder,
//     fetchAllOrders,
//     fetchOrderById,
//     updateOrder,
//     deleteOrder
// };