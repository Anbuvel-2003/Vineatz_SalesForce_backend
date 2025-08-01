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

const updateLeadStatus = async (req, res) => {
  try {
    const {
      status,
      employeeid,
      employeename,
      employeeaddress,
      expectedAmt,
      expectedDate,
      typeOfBusiness,
      confidenceLevel,
      applicationDemo,
      featureExplanation,
      paymentType,
      finalAmount,
      finalDate,
    } = req.body;

    const leadId = req.params.leadId;
    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    if (!lead.data) {
      lead.data = {};
    }
    lead.data.status = status;
    let detail = { stage: status, updatedAt: new Date() };
    switch (status) {
      case 1:
        detail = {
          ...detail,
          employeeId: employeeid,
          employeeName: employeename,
          employeeAddress: employeeaddress,
        };
        break;
      case 2:
        detail = {
          ...detail,
          expectedAmount: expectedAmt,
          expectedDate,
          typeOfBusiness,
          confidenceLevel,
        };
        break;
      case 3:
        detail = {
          ...detail,
          applicationDemo: applicationDemo || false,
          featureExplanation: featureExplanation || false,
        };
        break;
      case 4:
        detail = {
          ...detail,
          finalAmount,
          finalDate,
        };
        break;
      case 5:
        detail = {
          ...detail,
          paymentType,
        };
        break;
    }
    const existingIndex = lead.details.findIndex(
      (item) => item.stage == status
    );
    console.log("existingIndex", existingIndex);
    if (existingIndex === -1) {
      lead.details.push(detail);
      lead.data.status = status;
    } else {
      lead.details[existingIndex] = {
        ...lead.details[existingIndex],
        ...detail,
      };
    }
    await lead.save();
    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: lead,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update status",
      error: err.message,
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { note, subject } = req.body;
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        $push: {
          Notes: {
            subject,
            note,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: updatedLead,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add note", error: err.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { leadId, noteId } = req.params;
    const updatedLead = await Lead.findByIdAndUpdate(
      leadId,
      {
        $pull: { Notes: { _id: noteId } },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: updatedLead,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete note", error: err.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { leadId, noteId } = req.params;
    const { note, subject } = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, "Notes._id": noteId },
      {
        $set: {
          "Notes.$.note": note,
          "Notes.$.subject": subject,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: lead,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update note", error: err.message });
  }
};

export {
  createLead,
  getAllLeads,
  getSingleLead,
  updateLeadStatus,
  addNote,
  deleteNote,
  updateNote,
};
