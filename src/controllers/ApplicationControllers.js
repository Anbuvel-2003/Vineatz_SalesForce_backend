import Applicationmodel from "../model/ApplicationModel.js";

// GET APPLICATION :
const getapplication = async (req, res) => {
  try {
    const Application = await Applicationmodel.find();
    res.status(200).json({
      data: Application,
      success: true,
    });
  } catch (err) {
    console.log(err?.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};

// CREATE APPLICATION :
const createapplication = async (req, res) => {
  const {
    Application_Name,
    Application_Description,
    Application_url,
    Application_lunch_date,
  } = req.body;

  try {
    // 1. Find last created Application based on createdAt
    const lastApplication = await Applicationmodel?.findOne()?.sort({ createdAt: -1 });

    // 2. Generate next Application ID
    let nextId = 1;
    if (lastApplication && lastApplication?.Application_ID) {
      const lastIdNum = parseInt(lastApplication?.Application_ID.replace("APP", ""));
      nextId = lastIdNum + 1;
    }

    const Application_ID = `APP${nextId.toString().padStart(3, "0")}`;
    const Application = await Applicationmodel.create({
      Application_ID,
      Application_Name,
      Application_Description,
      Application_url,
      Application_lunch_date,
    });

    res.status(200).json({
      message: "Application Created Successfully !!!!",
      success: true,
      Application_ID,
    });
  } catch (err) {
    console.log(err?.message);
    res.status(400).json({ message: err?.message, success: false });
  }
};


// GET SINGLE APPLICATION :
const getsingleapplication = async (req, res) => {
  try {
    const Application = await Applicationmodel.findById(req.params.id);
    if (!Application) {
      return res
        .status(404)
        .json({ message: "Application ID not found", success: true });
    }
    res.status(200).json({ data: Application, success: true });
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res
        .status(400)
        .json({ message: "invalid Application ID", success: false });
    }
    console.log(err?.message);
    res.status(500).json({ message: err?.message, success: false });
  }
};

// UPDATE  APPLICATION:
const updateapplication = async (req, res) => {
  const { id } = req.params;
  try {
    const Application = await Applicationmodel.findById(id);
    if (!Application) {
      return res
        .status(404)
        .json({ message: "Application ID not found", success: true });
    }
    const {
      Application_Name,
      Application_Description,
      Application_url,
      Application_lunch_date,
    } = req.body;
    Application.Application_Name = Application_Name;
    Application.Application_Description = Application_Description;
    Application.Application_url = Application_url;
    Application.Application_lunch_date = Application_lunch_date;
    await Application.save();
    res.status(200).json({
      success: true,
      message: "Application details updated sucessfully !!!!",
      data: {
        Application_Name: Application.Application_Name,
        Application_Description: Application.Application_Description,
        Application_url: Application.Application_url,
        Application_lunch_date: Application.Application_lunch_date,
      },
    });
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res
        .status(400)
        .json({ message: "invalid Application ID", success: false });
    }
    console.log(err?.message);
    res.status(500).json({ message: err?.message, success: false });
  }
};

// DELETE APPLICATION :
const deleteapplication = async (req, res) => {
  try {
    const Application = await Applicationmodel.findByIdAndDelete(req.params.id);
    if (!Application) {
      return res
        .status(404)
        .json({ message: "Application ID not found", success: true });
    }
    res
      .status(200)
      .json({ message: "Application Deleted Successfully", success: true });
  } catch (err) {
    if (err.kind === "ObjectId" && err.name === "CastError") {
      return res
        .status(400)
        .json({ message: "invalid Application ID", success: false });
    }
    console.log(err?.message);
    res.status(500).json({ message: err?.message, success: false });
  }
};

export {
  getapplication,
  deleteapplication,
  updateapplication,
  getsingleapplication,
  createapplication,
};
