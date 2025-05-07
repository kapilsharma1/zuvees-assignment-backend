const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { verifyToken, isAdmin, isRider } = require('../middleware/auth');

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate total amount and validate products
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }
      
      const variant = product.variants.find(
        v => v.color === item.variant.color && v.size === item.variant.size
      );
      
      if (!variant) {
        return res.status(400).json({ message: 'Invalid variant selected' });
      }
      
      if (variant.stock < item.quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      
      totalAmount += variant.price * item.quantity;
    }

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      status: 'paid',
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Get user orders
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get all orders (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('rider', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, riderId } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'shipped' && riderId) {
      order.rider = riderId;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

// Get rider's assigned orders - new endpoint that matches what the client is using
router.get('/rider-orders', verifyToken, isRider, async (req, res) => {
  try {
    console.log('Fetching rider orders for rider:', req.user._id);
    const orders = await Order.find({ rider: req.user._id })
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    console.log(`Found ${orders.length} orders assigned to rider`);
    res.json(orders);
  } catch (error) {
    console.error('Get rider orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update delivery status (rider only)
router.patch('/:id/delivery-status', verifyToken, isRider, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (!['delivered', 'undelivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ message: 'Error updating delivery status' });
  }
});

// Add direct PATCH endpoint for riders to update order status
router.patch('/:id', verifyToken, isRider, async (req, res) => {
  try {
    console.log('Rider updating order status for order:', req.params.id);
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.rider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    if (!['delivered', 'undelivered', 'shipped'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Riders can only set orders as delivered, undelivered, or shipped' });
    }

    console.log(`Updating order ${req.params.id} status from ${order.status} to ${status}`);
    order.status = status;
    await order.save();
    
    console.log('Order status updated successfully');
    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
});

module.exports = router; 