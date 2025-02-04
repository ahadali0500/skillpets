const pool = require("../services/db");

// Model to adopt a pet

module.exports = {
    checkUserSkillPoints: (user_id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT skillpoints FROM user WHERE user_id = ?', [user_id], (error, results) => {
                if (error) reject(error);
                else resolve(results[0]?.skillpoints || 0);
            });
        });
    },

    checkPetCost: (pet_id) => {
        return new Promise((resolve, reject) => {
            pool.query('SELECT cost_in_skillpoints FROM pets WHERE pet_id = ?', [pet_id], (error, results) => {
                if (error) reject(error);
                else resolve(results[0]?.cost_in_skillpoints || 0);
            });
        });
    },

    adoptPet: (user_id, pet_id, skillpoints) => {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) return reject(err);

                connection.beginTransaction(err => {
                    if (err) {
                        connection.release();
                        return reject(err);
                    }

                    const adoptPetSQL = 'INSERT INTO UserPets (user_id, pet_id) VALUES (?, ?)';
                    connection.query(adoptPetSQL, [user_id, pet_id], (error, results) => {
                        if (error) {
                            connection.rollback(() => {
                                connection.release();
                                reject(error);
                            });
                        } else {
                            const deductPointsSQL = 'UPDATE user SET skillpoints = skillpoints - ? WHERE user_id = ?';
                            connection.query(deductPointsSQL, [skillpoints, user_id], (error, updateResults) => {
                                if (error) {
                                    connection.rollback(() => {
                                        connection.release();
                                        reject(error);
                                    });
                                } else {
                                    connection.commit(err => {
                                        if (err) {
                                            connection.rollback(() => {
                                                connection.release();
                                                reject(err);
                                            });
                                        } else {
                                            connection.release();
                                            resolve(results.insertId);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
    }
};

// Model to get all pets owned by a user
module.exports.getUserPets = (user_id, callback) => {
    const SQL = `
        SELECT 
            UserPets.user_pet_id, 
            Pets.pet_name, 
            Pets.species, 
            UserPets.happiness_level, 
            UserPets.purchase_date 
        FROM UserPets
        INNER JOIN Pets ON UserPets.pet_id = Pets.pet_id
        WHERE UserPets.user_id = ?;
    `;
    pool.query(SQL, [user_id], callback);
};

// Model to update happiness level
module.exports.updateHappinessLevel = (user_pet_id, happiness_level, callback) => {
    const SQL = `
        UPDATE UserPets
        SET happiness_level = ?
        WHERE user_pet_id = ?;
    `;
    pool.query(SQL, [happiness_level, user_pet_id], callback);
};

// Model to release a pet
module.exports.releasePet = (user_pet_id, callback) => {
    const SQL = `
        DELETE FROM UserPets
        WHERE user_pet_id = ?;
    `;
    pool.query(SQL, [user_pet_id], callback);
};
