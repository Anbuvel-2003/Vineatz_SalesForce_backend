import Teammodel from "../model/TeamModel";

// GET TEAM:
const getAllTeam = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Teammodel.countDocuments();
    const Team = await Teammodel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      success: true,
      data: Team,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get All Employees Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch employees" });
  }
};

// CREATE TEAM :
const createTeam = async (req, res) => {
  try {
    const {
      TeamName,
      TeamId,
      TeamLead,
      Employee_ID
    } = req.body;
    if (
      !TeamName ||
      !TeamId ||
      !TeamLead ||
      !Employee_ID
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
    const newTeamlead = new Teammodel({
      TeamName,
      TeamId,
      TeamLead,
      Employee_ID
    });
    await newTeamlead.save();
    res.status(201).json({
      success: true,
      message: "Teamlead created successfully",
      data: newTeamlead,
    });
  } catch (err) {
    console.log(err?.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};

// // GET SINGLE TEAM :
const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const Team = await Teammodel.findById(id);
    if (!Team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, data: Team });
  } catch (error) {
    console.error("Get Team By ID Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching Team" });
  }
};

// // UPDATE  TEAM:
const updateTeam = async (req, res) => {
  const { id } = req.params;
  const {
    TeamName,
    TeamId,
    TeamLead,
    Employee_ID
  } = req.body;
  try {
    const Team = await Teammodel.findById(id);
    if (!Team) {
      return res
        .status(404)
        .json({ success: false, message: "Teamlead not found" });
    }
    if (TeamId && TeamId  !== Team.TeamId) {
      const duplicate = await Teammodel.findOne({ TeamId });
      if (duplicate) {
        return res
          .status(400)
          .json({ success: false, message: "Teamlead ID already exists" });
      }
    }
    Team.TeamName = TeamName || Team.TeamName;
    Team.TeamId = TeamId || Team.TeamId;
    Team.TeamLead = TeamLead || Team.TeamLead;
    Team.Employee_ID = Employee_ID || Team.Employee_ID;
    await Team.save();
    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: Team,
    });
  } catch (error) {
    console.error("Update Team Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating Team" });
  }
};

// // DELETE TEAM :
const deleteTeam = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Teammodel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res.status(200).json({
      success: true,
      message: "Team deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete Team Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error deleting Team" });
  }
};

export {
  getAllTeam,
  createTeam,
  getTeamById,
  deleteTeam,
  updateTeam,
};
    