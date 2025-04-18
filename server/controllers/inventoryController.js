const inventoryModel = require('../models/inventoryModel.js');
const db = require('../config/db');

exports.createAssignment = async (req, res) => {
    const {Kiosk_ID, Item_ID, Item_quantity, Restock_level} = req.body;
    if(!Kiosk_ID || !Item_ID || !Item_quantity || !Restock_level){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingAssignment = await inventoryModel.findAssignmentByID(Kiosk_ID, Item_ID);
        if(existingAssignment){
            return res.status(400).json({message: 'This item already exists in this kiosks stock. Please add a new item.'});
        }
        await inventoryModel.createAssignment({Kiosk_ID, Item_ID, Item_quantity, Restock_level});
        res.status(201).json({message: 'New Assignment Created Successfully.'});
    } catch (error) {
        console.error('Error adding new assignment: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.createItem = async (req, res) => {
    const {Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price} = req.body;
    if(!Item_type || !Item_name || !Item_desc || !Item_shop_price || !Item_supply_price){
        return res.status(400).json({message: 'All fields are required! Somethings missing.'});
    }
    try {
        const existingItem = await inventoryModel.findItemByName(Item_name, Item_desc);
        if(existingItem){
            return res.status(400).json({message: 'This item already exists. Please add a new item.'});
        }
        await inventoryModel.createItem({Item_type, Item_name, Item_desc, Item_shop_price, Item_supply_price});
        res.status(201).json({message: 'New Item Added Successfully.'});
    } catch (error) {
        console.error('Error adding new item: ', error);
        res.status(500).json({message: 'An error occurred. Please try again.'});
    }
};

exports.updateItem = async (req, res) => {
    try {
        const itemID = req.params.id;
        const updatedData = req.body;
        const selectedItem = {...updatedData, Item_ID: itemID};
        const updatedItem = await inventoryModel.updateItem(selectedItem);
        if(!updatedItem){
            return res.status(404).json({message: 'Item not found or not updated.'});
        }
        res.status(200).json({message: 'Item updated successfully.', item: updatedData});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Restock
exports.restockItem = async (req, res) => {
    try {
        const Inventory_ID = req.params.id;
        const { restockAmount } = req.body;

        if (!restockAmount || isNaN(restockAmount)) {
            return res.status(400).json({ message: 'Invalid restock amount.' });
        }

        // Get current Restock_level
        const currentItem = await inventoryModel.getRestockLevel(Inventory_ID);
        if (!currentItem) {
            return res.status(404).json({ message: 'Entry not found.' });
        }

        const newRestockLevel = parseInt(currentItem.Item_quantity, 10) + parseInt(restockAmount, 10);

        const updatedItem = await inventoryModel.restockItem(newRestockLevel, Inventory_ID);

        if (!updatedItem) {
            return res.status(500).json({ message: 'Failed to restock item.' });
        }

        res.status(200).json({ message: 'Item restocked successfully.', item: updatedItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.markMessageSeen = async (req, res) => {
    const alertID = req.params.id;
    try {
        await inventoryModel.markMessageSeen(alertID);
        res.status(200).json({message: 'Low stock alert acknowledged.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getInvStockAlerts = async (req, res) => {
    try {
        const message = await inventoryModel.getInvStockAlerts();
        res.status(200).json(message || []);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllInventory = async (req, res) => {
    try {
        const inv = await inventoryModel.getAllInventory();
        res.status(200).json(inv);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getInventoryInfo = async (req, res) => {
    try {
        const info = await inventoryModel.getInventoryInfo();
        res.status(200).json(info);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await inventoryModel.getAllItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAllInventory = async (req, res) => {
    try {
        await inventoryModel.deleteAllInventory();
        res.status(200).json({message: 'Whole inventory successfully deleted.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteAssignmentById = async (req, res) => {
    try {
        const {Inventory_ID} = req.body;
        if(!Inventory_ID){
            return res.status(400).json({message: 'Invalid inventory ID provided.'});
        }
        await inventoryModel.deleteAssignmentById(Inventory_ID);
        res.status(200).json({message: 'Item assignment deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.getAllAvailableItems = async (req, res) => {
    try {
        const merch = await inventoryModel.getAllAvailableItems();
        res.status(200).json(merch);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.deleteItemById = async (req, res) => {
    try {
        const {Item_ID} = req.body;
        if(!Item_ID){
            return res.status(400).json({message: 'Invalid item id.'});
        }
        await inventoryModel.deleteItemById(Item_ID);
        res.status(200).json({message: 'Item deleted successfully.'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.purchaseMerch = async (req, res) => {
    const { user_id, item_id, price, quantity, quantity_sold, total_amount, product_type, payment_method} = req.body;
    console.log('Incoming purchase body: ', req.body);
    try {
        if (product_type === 'Merchandise' && payment_method === 'pay_at_store') {
            return res.status(400).json({ message: 'Merchandise cannot be paid at store.' });
        }

        // 1. Create new transaction
        const [transaction] = await db.query(
            `INSERT INTO transactions (Visitor_ID, Total_amount) VALUES (?, ?)`,
            [user_id, total_amount]
        );
        const transactionId = transaction.insertId;

        // 2. Log product purchase
        await db.query(`
            INSERT INTO product_purchases 
            (Transaction_ID, product_id, product_type, purchase_price, quantity_sold, quantity, total_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [transactionId, item_id, product_type, price, quantity_sold, quantity, total_amount]
        );

        // 3. Deduct quantity from inventory
        await db.query(
            `UPDATE inventory
             SET Item_quantity = Item_quantity - ?
             WHERE Inventory_ID = ?`,
            [quantity_sold, item_id]
        );
        res.status(200).json({ message: 'Merchandise purchase successful!' });
    } catch (err) {
        console.error('Error processing merch purchase:', err.message, err.stack);
        res.status(500).json({ message: 'Error processing purchase.', error: err.message });
    }
};

exports.getVisitorPurchases = async (req, res) => {
    const visitorId = req.params.visitorId;
  
    try {
      const [rows] = await db.query(`
        SELECT 
          it.Item_name AS item,
          pp.quantity AS quantity,                  
          pp.purchase_price AS unit_price,         
          pp.total_amount AS total_price,          
          pp.purchase_created AS date
        FROM product_purchases pp
        JOIN transactions t ON pp.Transaction_ID = t.Transaction_ID
        JOIN inventory i ON pp.product_id = i.Inventory_ID
        JOIN items it ON i.Item_ID = it.Item_ID
        WHERE t.Visitor_ID = ?
        ORDER BY pp.purchase_created DESC
      `, [visitorId]);
  
      res.status(200).json({ purchases: rows });
    } catch (err) {
      console.error("Error fetching shop purchases:", err);
      res.status(500).json({ message: "Failed to fetch shop purchases" });
    }
  };  