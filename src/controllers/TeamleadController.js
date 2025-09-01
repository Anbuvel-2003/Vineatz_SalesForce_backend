import Teamleadmodel from "../model/TeamleadModel.js";


// GET TEAMLEAD:
const getAllTeamlead = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const query = {};

    // 🔍 Multi-field search
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { Name: searchRegex },
        { Email: searchRegex },
        { Id: searchRegex },
        { Mobilenumber: searchRegex },
        { Alternative_Mobilenumber: searchRegex },
        { TeamId: searchRegex },
      ];
    }

    // 🧲 Sorting
    const sortOrder = order === "asc" ? 1 : -1;

    const total = await Teamleadmodel.countDocuments(query);
    const teamleads = await Teamleadmodel.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parsedLimit);

    res.status(200).json({
      success: true,
      data: teamleads,
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
    console.error("Error fetching team leads:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch team leads",
    });
  }
};


// CREATE TEAMLEAD :
const createTeamlead = async (req, res) => {
  try {
    const {
      Name,
      Email,
      Mobilenumber,
      Alternative_Mobilenumber,
      Address,
      joining_date,
      TeamId,
      Bike_Number,
      Driving_License_Number,
      Password,
    } = req.body;
    if (
      !Name ||
      !Email ||
      !Mobilenumber ||
      !Alternative_Mobilenumber ||
      !Address ||
      !Bike_Number ||
      !Driving_License_Number ||
      !Password
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }
    const existingTeamLead = await Teamleadmodel.findOne({
      Email,
    });
    if (existingTeamLead) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const lastTeamleade = await Teamleadmodel.findOne().sort({ createdAt: -1 });
    let nextId = 1;
    if (lastTeamleade && lastTeamleade.Id) {
      const lastIdNum = parseInt(
        lastTeamleade.Id.replace("TMLD", "")
      );
      nextId = lastIdNum + 1;
    }
    const Id = `TMLD${nextId.toString().padStart(3, "0")}`;
    const newTeamlead = new Teamleadmodel({
      Id,
      Name,
      Email,
      Mobilenumber,
      Alternative_Mobilenumber,
      Address,
      joining_date,
      TeamId,
      Bike_Number,
      Driving_License_Number,
      Password,
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

// // GET SINGLE TEAMLEAD :
const getTeamleadById = async (req, res) => {
  const { id } = req.params;
  try {
    const Teamlead = await Teamleadmodel.findById(id);
    if (!Teamlead) {
      return res
        .status(404)
        .json({ success: false, message: "Teamlead not found" });
    }
    res.status(200).json({ success: true, data: Teamlead });
  } catch (error) {
    console.error("Get Teamlead By ID Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error fetching Teamlead" });
  }
};

// // UPDATE  TEAMLEAD:
const updateTeamlead = async (req, res) => {
  const { id } = req.params;
  const {
    Id,
    Name,
    Email,
    Mobilenumber,
    Alternative_Mobilenumber,
    Address,
    joining_date,
    TeamId,
    Bike_Number,
    Driving_License_Number,
    Password
  } = req.body;
  try {
    const Teamlead = await Teamleadmodel.findById(id);
    if (!Teamlead) {
      return res
        .status(404)
        .json({ success: false, message: "Teamlead not found" });
    }
    if (Id && Id !== Teamlead.Id) {
      const duplicate = await Teamleadmodel.findOne({ Id });
      if (duplicate) {
        return res
          .status(400)
          .json({ success: false, message: "Teamlead ID already exists" });
      }
    }
    Teamlead.Id = Id || Teamlead.Id;
    Teamlead.Name = Name || Teamlead.Name;
    Teamlead.Email = Email || Teamlead.Email;
    Teamlead.Mobilenumber = Mobilenumber || Teamlead.Mobilenumber;
    Teamlead.Alternative_Mobilenumber =
      Alternative_Mobilenumber || Teamlead.Alternative_Mobilenumber;
    Teamlead.Address = Address || Teamlead.Address;
    Teamlead.joining_date = joining_date || Teamlead.joining_date;
    Teamlead.TeamId = TeamId || Teamlead.TeamId;
    Teamlead.Bike_Number = Bike_Number || Teamlead.Bike_Number;
    Teamlead.Driving_License_Number =
      Driving_License_Number || Teamlead.Driving_License_Number;
    Teamlead.Password = Password || Teamlead.Password;
    await Teamlead.save();
    res.status(200).json({
      success: true,
      message: "Teamlead updated successfully",
      data: Teamlead,
    });
  } catch (error) {
    console.error("Update Teamlead Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error updating Teamlead" });
  }
};

// // DELETE TEAMLEAD :
const deleteTeamlead = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Teamleadmodel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Teamlead not found" });
    }
    res.status(200).json({
      success: true,
      message: "Teamlead deleted successfully",
      data: deleted,
    });
  } catch (error) {
    console.error("Delete Teamlead Error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error deleting Teamlead" });
  }
};

export {
  getAllTeamlead,
  createTeamlead,
  getTeamleadById,
  deleteTeamlead,
  updateTeamlead,
};
    