
const model = require('../../models/fitnessChallengesModel.js');

module.exports.createChallenge = (req, res, next) => {
    console.log(req.body);
    
    if (!req.body.challenge || !req.body.user_id || !req.body.skillpoints) {
        res.status(400).json({
            message: "Error: Missing challenge, user_id, or skillpoints"
        });
        return;
    }

    const data = {
        challenge: req.body.challenge,
        creator_id: req.body.user_id,
        skillpoints: req.body.skillpoints
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createChallenge:", error);
            res.status(500).json({ message: "Internal Server Error" });
        } else {
            res.status(200).json({
                challenge_id: results.insertId, 
                challenge: data.challenge,
                creator_id: Number(data.creator_id), 
                skillpoints: Number(data.skillpoints)
            });
        }
    };

    model.insertChallenge(data, callback);
};