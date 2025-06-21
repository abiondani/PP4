const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const authRoutes = require("./routes/auth");
const historiaRoutes = require("./routes/historia");

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/historia", historiaRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Mocks corriendo en http://localhost:${PORT}`);
});
