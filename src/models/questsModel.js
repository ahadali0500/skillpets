const pool = require("../services/db");

// Insert a new quest
module.exports.createQuest = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Quests (quest, reward, status)
        VALUES  (?, ?, ?);
    `;
    const VALUES = [data.quest, data.reward, data.status];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.getQuestsByUserId = (user_id, callback) => {
    const SQLSTATEMENT = `
    SELECT 
        q.quest_id,
        q.quest,
        q.reward,
        q.status,
        q.pet_id,
        p.pet_name,
        p.species,
        u.user_id,
        u.username
    FROM Quests q
    LEFT JOIN Pets p ON q.pet_id = p.pet_id
    LEFT JOIN user u ON q.user_id = u.user_id
  ;
`;

    pool.query(SQLSTATEMENT, [user_id], callback);
};
module.exports.validateQuestOwnership = (user_id, quest_id, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Quests
        WHERE user_id = ? AND quest_id = ?;
    `;
    const VALUES = [user_id, quest_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.updateQuestStatus = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Quests
        SET status = ?,user_id = ?,pet_id = ?
        WHERE quest_id = ?;
    `;
    const VALUES = [data.status,data.user_id,data.pet_id, data.quest_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
module.exports.addSkillPoints = (user_id, points, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET skillpoints = skillpoints + ?
        WHERE user_id = ?;
    `;
    const VALUES = [points, user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteQuestsByPetId = (pet_id, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Quests 
        WHERE pet_id = ?;
    `;
    pool.query(SQLSTATEMENT, [pet_id], callback);
};