const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Auth Mock API corriendo en http://localhost:${PORT}`);
});
