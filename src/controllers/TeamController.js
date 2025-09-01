import Teammodel from "../model/TeamModel.js";

// GET TEAM:
const getAllTeam = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
      is_active, // Optional filter
    } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const skip = (parsedPage - 1) * parsedLimit;
    const query = {};
    // 🔍 Multi-field Search
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { teamlead: searchRegex },
        { id: searchRegex },
      ];
    }
    // ✅ Filter by is_active (true/false)
    if (is_active !== undefined) {
      query.is_active = is_active === "true";
    }
    // 🧲 Sorting
    const sortOrder = order === "asc" ? 1 : -1;
    const total = await Teammodel.countDocuments(query);
    const teams = await Teammodel.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parsedLimit);
    res.status(200).json({
      success: true,
      data: teams,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
        hasNextPage: parsedPage * parsedLimit < total,
        hasPrevPage: parsedPage > 1,
      },
    });
  } catch (error) {
    console.error("Get All Teams Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
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
    