const db = require('../config/db.js');

exports.createUnit = async (item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level) => {
    const [result] = await db.query(
        'INSERT INTO inventory (Item_type, Item_name, Item_quantity, Unit_price, Last_restocked_date, Reorder_level) VALUES (?, ?, ?, ?, ?, ?)',
        [item_type, item_name, item_quantity, unit_price, restocked_last, reorder_level]
    );
    return result.insertId;
};

exports.getAllInventory = async () => {
    const [inventory] = await db.query('SELECT * FROM inventory');
    return inventory;
};

exports.getUnitById = async (id) => {
    const [unit] = await db.query('SELECT * FROM inventory WHERE InventoryID = ?', [id]);
    return unit[0];
};

exports.deleteAllInventory = async () => {
    await db.query('DELETE FROM inventory');
};

exports.deleteUnitById = async (id) => {
    await db.query('DELETE FROM inventory WHERE InventoryID = ?', [id]);
};