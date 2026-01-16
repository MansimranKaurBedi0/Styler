require("dotenv").config();

const express = require("express");
const cors = require("cors");
const analyzeroute=require("./routes/analyze");

const app = express();
app.use(cors());
app.use(express.json());



app.use("/",analyzeroute);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
