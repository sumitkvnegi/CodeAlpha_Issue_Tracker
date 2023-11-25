const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const Issue = require("./model/issueModel.js");
const Project = require("./model/projectModel.js");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/issueTracker");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const storage = multer.memoryStorage(); // You can choose other storage options
const upload = multer({ storage: storage });

const PORT = process.env.PORT || 3000;

app.post("/api/issue", upload.single("file"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file || {};
  const { currentProject, title, description, status, priority } = req.body;

  const newIssue = new Issue({
    ...(buffer ? {
      file: {
        filename: originalname,
        data: buffer,
        contentType: mimetype,
      }
    }: {}),
    currentProject,
    title,
    description,
    status,
    priority,
  });

  try {
    await newIssue.save();
    res.status(201).send("Issue created successfully");
  } catch (error) {
    console.error("Error creating issue", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/project", async (req, res) => {
  const { name } = req.body;

  try {
    // Try to find a project with the given name
    const existingProject = await Project.findOne();

    if (existingProject) {
      // If the project exists, append the new name to the array or convert the field to an array
      if (Array.isArray(existingProject.projectnames)) {
        existingProject.projectnames.push(name);
      } else {
        existingProject.projectnames = [existingProject.projectnames, name];
      }

      await existingProject.save();
      res.status(200).send("Project updated successfully");
    } else {
      // Document didn't exist, create a new one
      const newProject = new Project({ projectnames: [name] });
      await newProject.save();
      res.status(201).send("Project created successfully");
    }
  } catch (error) {
    console.error("Error updating/creating project", error);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/api/project", async (req, res) => {
  try {
  const data = await Project.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({error: "Error getting project names"});
  }
});

app.get("/api/issue", async (req, res) => {
  try {
    const data = await Issue.find();
    const newArray = [];

    data.forEach((issue) => {
      // Assuming there is a 'data' key in the result containing buffer data
      const bufferData = issue.file?.data || Buffer.from("");

      // Convert buffer to Base64
      const base64Data = bufferData.toString("base64");

      // Create a new object with the converted data
      const modifiedIssue = {
        ...issue.toObject(), // Convert Mongoose document to plain JavaScript object
        data: base64Data,
      };
      newArray.push(modifiedIssue);
    });
    res.status(200).json(newArray);
  } catch (error) {
    res.status(500).json({ error: "Error getting issues" });
  }
});

app.delete("/api/issue/:id", async (req, res) => {
  const id = req.params.id;
  try{
    const deletedIssue = await Issue.findByIdAndDelete(id);
    if (deletedIssue) {
      res.status(200).json(deletedIssue);
  } else {
      res.status(404).json({ error: 'issue not found' });
  }
  }catch(error){
    res.status(500).json({ error: "Error deleting issue" });
  }
})

app.delete('/api/project/:projectName', async (req, res) => {
  const { projectName } = req.params;
  console.log(projectName)
  console.log("hello")

  try {
    // Find the project by name
    const project = await Project.findOne();

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if the project name exists in the array
    const index = project.projectnames.indexOf(projectName);
    if (index === -1) {
      return res.status(404).json({ error: 'Project name not found in the array' });
    }

    // Remove the project name from the array
    project.projectnames.splice(index, 1);

    // Save the updated project
    await project.save();

    // Return a success message
    res.status(200).json({ message: 'Project name deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/issue/:id', upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const { currentProject, title, description, status, priority } = req.body;

  // Handle the file if it's present in the request
  const fileData = req.file;

  try {
    // Perform the update operation using the received data
    // Here, you might want to update your database with the new data and file

    // Example: Update the issue in the database
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      {
        currentProject,
        title,
        description,
        status,
        priority,
        fileData, // assuming you have a field in your model for file data
      },
      { new: true }
    );

    // You can send a response with the updated data if needed
    res.json({ message: 'Issue updated successfully', updatedIssue });
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log("Server is running on PORT: http://localhost:" + PORT);
});
