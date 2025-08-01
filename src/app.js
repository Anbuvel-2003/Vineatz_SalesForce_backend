import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import Post from "./model/postModel.js";
import postRoute from './routes/postRoutes.js'
import Yaml from 'yamljs';
import SwaggerUI from 'swagger-ui-express';
const yamlfile = './src/api.yaml';
const swaggerJSDoc = Yaml.load(yamlfile);
dotenv.config();
connectDB();
const PORT = process.env.PORT || 5001;
const app = express();
// middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api',postRoute)
app.use("/docs",SwaggerUI.serve,SwaggerUI.setup(swaggerJSDoc))
// routes
app.get("/", (req, res) => {
res.send("<h1>Hello..........</h1>");
});
app.listen(PORT, () => {
console.log(`server is running on port ${PORT}`);
});

