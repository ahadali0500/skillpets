const model = require('../models/itemModel');
const inventoryModel = require("../models/inventoryModel");

module.exports.getAllItems = (req, res) => {
    const callback = (error, results) => {
        console.log(results);
        
        if (error) {
            return res.status(500).json({ message: "Error fetching items.", error });
        }
        res.status(200).json({
            message: "Items fetched successfully!",
            items: results
        });
    };

    model.fetchAllItems(callback);
};

module.exports.createItems = (req, res) => {
    const { item_name, effect_happiness, price = 0, user_id } = req.body;

    // Validate input
    if (!item_name || !effect_happiness || !price) {
        return res.status(400).json({
            message: "Missing required fields: item_name or species.",
        });
    }

    const data = {
        item_name,
        effect_happiness,
        price,
        user_id,
    };

    model.createItem(data, (error, results) => {
        if (error) {
            console.error("Error creating item:", error);
            return res.status(500).json({
                message: "Error creating item.",
                error: error,
            });
        }

        // inventoryModel.addToInventory(user_id, results.insertId, quantity, (error, results) => {
        //     if (error) {
        //         console.error("Error creating Inventory:", error);
        //         return res.status(500).json({
        //             message: "Error creating Inventory.",
        //             error: error,
        //         });
        //     }
        // })

        res.status(201).json({
            message: "item created successfully!",
            item_id: results.insertId,
            ...data, // Automatically includes item_name, species, and cost_in_skillpoints
        });
    });
};

module.exports.deleteItemById = (req, res) => {
    const item_id = req.params.item_id;

    // Step 1: Delete associated quests
    inventoryModel.deleteInventoryByItemId(item_id, (questError) => {
        if (questError) {
            return res.status(500).json({
                message: "Error deleting associated quests.",
                error: questError,
            });
        }

        // Step 2: Delete the item
        model.deleteItemById(item_id, (itemError, itemResults) => {
            if (itemError) {
                return res.status(500).json({
                    message: "Error deleting item.",
                    error: itemError,
                });
            }

            if (itemResults.affectedRows === 0) {
                return res.status(404).json({
                    message: "Item not found.",
                });
            }

            res.status(200).json({
                message: "Item and associated inventory deleted successfully!",
            });
        });
    });
};


module.exports.updateItemById = (req, res) => {
    const data = {
        item_name: req.body.item_name,
        effect_happiness: req.body.effect_happiness,
        price: req.body.price,
        item_id: req.params.item_id,
    };

    if (!data.price || !data.effect_happiness || !data.item_name) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // First update the item
    model.updateById(data, (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Error updating item details.", error });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Item not found or update failed." });
        }
        res.status(200).json({ message: "Item  updated successfully!" });

        // Then update the inventory
        // inventoryModel.updateById(data.item_id, data.quantity, (errors, resultss) => {
        //     if (errors) {
        //         return res.status(500).json({ message: "Error updating inventory details.", errors });
        //     }

        //     if (resultss.affectedRows === 0) {
        //         return res.status(404).json({ message: "Inventory not found or update failed." });
        //     }

        //     // Send a single response after all operations
        //     res.status(200).json({ message: "Item and inventory updated successfully!" });
        // });
    });
};
