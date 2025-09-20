import Employeemodel from "../model/EmployeeModel.js";
import Teammodel from "../model/TeamModel.js";

// GET ALL TEAMS
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
     .populate("id", "name email")   // return only name & email of teamlead
      .populate("members", "name email") 
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

// CREATE TEAM
// const createTeam = async (req, res) => {
//   try {
//     const { name, id, description, teamlead, members } = req.body;

//     if (!name || !id || !description || !teamlead || !members) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, id, description, and teamlead are required",
//       });
//     }

//     // Check duplicate team ID
//     const existing = await Teammodel.findOne({ id });
//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Team ID already exists",
//       });
//     }

//     const newTeam = new Teammodel({
//       name,
//       id,
//       description,
//       teamlead,
//       members: members || [],
//     });

//     await newTeam.save();

//     res.status(201).json({
//       success: true,
//       message: "Team created successfully",
//       data: newTeam,
//     });
//   } catch (err) {
//     console.error("Create Team Error:", err.message);
//     res.status(500).json({ message: err.message, success: false });
//   }
// };


const createTeam = async (req, res) => {
  const { name, description, teamlead, members,id } = req.body;

  try {
    // ✅ Generate next Team_Id
    const lastTeam = await Teammodel.findOne().sort({ createdAt: -1 });
    let nextId = 1;
    if (lastTeam?.Team_Id) {
      const lastIdNum = parseInt(lastTeam.Team_Id.replace("TEAM", ""));
      nextId = lastIdNum + 1;
    }
    const Team_Id = `TEAM${nextId.toString().padStart(3, "0")}`;

    // ✅ Create team
    const newTeam = await Teammodel.create({
      name,
      description,
      teamlead,  // employee ObjectId
      members,   // array of employee ObjectIds
      Team_Id,
      id
    });

    // ✅ Update Team Lead in Employee collection
    await Employeemodel.findByIdAndUpdate(
      id,
      {
        role: "teamlead",
        TeamId: newTeam._id,
        Teamname: name,
      },
      { new: true }
    );

    // ✅ Update Team Members (if provided)
    if (members && members.length > 0) {
      await Employeemodel.updateMany(
        { _id: { $in: members } },
        { $set: { TeamId: newTeam._id, Teamname: name, role: "member", Teamleadname: teamlead } }
      );
    }

    // ✅ Populate teamlead + members with name
    const populatedTeam = await Teammodel.findById(newTeam._id)
      .populate("teamlead", "name")
      .populate("members", "name");

    res.status(201).json({
      message: "✅ Team created and roles updated successfully",
      success: true,
      data: populatedTeam,
    });
  } catch (err) {
    console.error("❌ Create Team Error:", err.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};
// GET SINGLE TEAM
const getTeamById = async (req, res) => {
  const { id } = req.params;
  try {
    const team = await Teammodel.findById(id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    console.error("Get Team By ID Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching team" });
  }
};

// UPDATE TEAM
const updateTeam = async (req, res) => {
  const { id } = req.params;
  const { name, teamId, description, teamlead, members } = req.body;

  try {
    const team = await Teammodel.findById(id);
    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    // If trying to update the unique `id` field
    if (teamId && teamId !== team.id) {
      const duplicate = await Teammodel.findOne({ id: teamId });
      if (duplicate) {
        return res
          .status(400)
          .json({ success: false, message: "Team ID already exists" });
      }
      team.id = teamId;
    }

    team.name = name || team.name;
    team.description = description || team.description;
    team.teamlead = teamlead || team.teamlead;
    team.members = members || team.members;

    await team.save();

    res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: team,
    });
  } catch (error) {
    console.error("Update Team Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating team" });
  }
};

// DELETE TEAM
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
      .json({ success: false, message: "Error deleting team" });
  }
};

export {
  getAllTeam,
  createTeam,
  getTeamById,
  deleteTeam,
  updateTeam,
};
