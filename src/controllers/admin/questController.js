
const model = require('../../models/fitnessChallengesModel.js');

module.exports. createQuest = (req, res, next) => {
    const data = {
        user_id: req.params.user_id, // User ID from URL params
        pet_id: req.body.pet_id,    // Pet ID from request body
        quest: req.body.quest,      // Quest description
        reward: req.body.reward,    // Reward (e.g., skill points)
        status: "in-progress",      // Default status
    };

    // Validate required fields
    if (!data.user_id || !data.pet_id || !data.quest || !data.reward) {
        return res.status(400).json({
            message: "Missing required fields. Please include pet_id, quest, and reward.",
        });
    }

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "Error creating quest.",
                error,
            });
        }

        res.status(201).json({
            message: "Quest created successfully!",
            quest: {
                quest_id: results.insertId,
                name: data.quest,
                reward: data.reward,
                status: data.status,
            },
        });
    };

    // Call the model to insert the quest
    model.createQuest(data, callback);
};