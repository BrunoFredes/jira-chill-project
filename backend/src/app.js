require("./config/database");


const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/tarea.routes");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
module.exports = app;