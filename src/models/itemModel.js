const pool = require("../services/db");

module.exports.fetchAllItems = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Shop ;
    `;
    pool.query(SQLSTATEMENT, callback);
};


module.exports.fetchItemById = (item_id, callback) => {
    const SQLSTATEMENT = `
        SELECT item_id, item_name, effect_happiness, price
        FROM Shop
        WHERE item_id = ?;
    `;
    pool.query(SQLSTATEMENT, [item_id], callback);
};

module.exports.createItem = (data, callback) => {
    const SQL = `
        INSERT INTO shop (item_name, effect_happiness, price)
        VALUES (?, ?, ?);
    `;
    pool.query(SQL, [data.item_name, data.effect_happiness, data.price], callback);
};


module.exports.deleteItemById = (item_id, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM shop 
        WHERE item_id = ?;
    `;
    pool.query(SQLSTATEMENT, [item_id], callback);
};

module.exports.updateById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE shop 
        SET item_name = ?, effect_happiness = ?, price = ?
        WHERE item_id = ?;
    `;
    const VALUES = [data.item_name, data.effect_happiness, data.price, data.item_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};