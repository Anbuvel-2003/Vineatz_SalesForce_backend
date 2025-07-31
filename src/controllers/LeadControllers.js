import Lead from "../model/LeadsModel.js";

const createLead = async (req, res) => {
  try {
    const { Email } = req.body;

    // Check if email already exists
    const existingLead = await Lead.findOne({ Email });
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Auto-generate Lead Id (LEAD00001 format)
    const lastLead = await Lead.findOne().sort({ createdAt: -1 });
    let nextId = 1;
    if (lastLead && lastLead.Id) {
      const lastIdNum = parseInt(lastLead.Id.replace("LEAD", ""));
      nextId = lastIdNum + 1;
    }
    const Id = `LEAD${nextId.toString().padStart(5, "0")}`;

    // Prepare new lead data
    const newLead = new Lead({
      ...req.body,
      Id,
      Status: 0,
      Joining_Date: new Date().toISOString(),
      Notes: [],
      details: [],
    });

    await newLead.save();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status,
      sortBy = "Id",
      order = "asc",
    } = req.query;

    const query = {};
    const parsedLimit = parseInt(limit);

    // 🔍 Multi-field search
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { Id: searchRegex },
        { Name: searchRegex },
        { Email: searchRegex },
        { Mobilenumber: searchRegex },
        { Company_Name: searchRegex },
        { Application_Id: searchRegex },
        { Application_Name: searchRegex },
      ];
    }

    // 🎯 Multi-status filtering (comma-separated values like 1,2,3)
    if (status) {
      const statusArray = status.split(",").map((s) => parseInt(s));
      query.Status = { $in: statusArray };
    }

    // 📊 Total leads matching filters
    const total = await Lead.countDocuments(query);
    const totalPages = Math.ceil(total / parsedLimit);

    // 🧲 Sort configuration
    const sortOrder = order === "asc" ? 1 : -1;

    // 📥 Paginated, sorted, filtered leads
    const leads = await Lead.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      totalPages,
      page: parseInt(page),
      limit: parseInt(limit),
      data: leads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getSingleLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export { createLead, getAllLeads, getSingleLead };