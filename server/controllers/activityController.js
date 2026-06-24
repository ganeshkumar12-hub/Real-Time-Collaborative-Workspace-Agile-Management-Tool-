const Activity =
  require("../models/Activity");

const getActivities =
  async (req, res) => {
    try {
      const activities =
        await Activity.find()
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json(activities);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

module.exports = {
  getActivities,
};