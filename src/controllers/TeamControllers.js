import Employeemodel from "../model/EmployeeModel.js";
import Team from "../model/TeamModel.js";


const createTeam = async (req, res) => {
  const { Team_Name, Team_Description, Teamlead_Id, Teammembers_ID,Teamleadname } = req.body;

  try {
    // ✅ Generate next Team_Id
    const lastTeam = await Team.findOne().sort({ createdAt: -1 });
    let nextId = 1;
    if (lastTeam?.Team_Id) {
      const lastIdNum = parseInt(lastTeam.Team_Id.replace("TEAM", ""));
      nextId = lastIdNum + 1;
    }
    const Team_Id = `TEAM${nextId.toString().padStart(3, "0")}`;

    // ✅ Create team
    const newTeam = await Team.create({
      Team_Id,
      Team_Name,
      Team_Description,
      Teamlead_Id,
      Teammembers_ID,
    });

    // ✅ Update Team Lead
    await Employeemodel.findByIdAndUpdate(
      Teamlead_Id,
      {
        Role: "teamlead",
        TeamId: newTeam._id,
        Teamname: Team_Name,
        Teamleadname:Teamleadname
      },
      { new: true }
    );

    // ✅ Update Team Members (if provided)
    if (Teammembers_ID && Teammembers_ID.length > 0) {
      await Employeemodel.updateMany(
        { _id: { $in: Teammembers_ID } },
        { $set: { TeamId: newTeam._id, Teamname: Team_Name,Teamleadname:Teamleadname } }
      );
    }

    res.status(200).json({
      message: "✅ Team created and roles updated successfully",
      success: true,
      data: newTeam,
    });
  } catch (err) {
    console.error("❌ Create Team Error:", err.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};


// READ Teams with Pagination, Sorting, Filtering
const getTeams = async (req, res) => {
  try {
    let { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    // 🔍 Search filter
    const filter = search
      ? {
          $or: [
            { Team_Name: { $regex: search, $options: "i" } },
            { Team_Description: { $regex: search, $options: "i" } }
          ]
        }
      : {};
    // 📂 Get teams with population
    const teams = await Team.find(filter)
      .populate("Teamlead_Id", "Employee_Name Employee_Email")
      .populate("Teammembers_ID", "Employee_Name Employee_Email")
      .sort({ [sortBy]: order === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(limit);
    // 📊 Total documents
    const total = await Team.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    // ✅ Response
    res.status(200).json({
      success: true,
      data: teams,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE Team
 const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByIdAndUpdate(id, req.body, { new: true });
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE Team
 const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }
    res.status(200).json({ success: true, message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export {
  createTeam,
  updateTeam,
  getTeams,
  deleteTeam
};