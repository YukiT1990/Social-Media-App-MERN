const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,  //  process.env.MONGO_URL
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

// mongoose.connection.on('connected', () => {
//   console.log("Mongoose is Connected!");
// })

// mongoose.connection.on('error', function (err) {
//   if (err) throw err;
// });

app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log("req.body.name: " + req.body.name);
    cb(null, req.body.name);
    // for Postman
    // cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);


// app.get("/users", (req, res) => {
//   res.send("welcome to user page");
// })

const PORT = process.env.PORT || 8800;

// localhost:8800
app.listen(PORT, () => {
  console.log("backend server is running!")
})

if (process.env.NODE_ENV == "production") {

  app.use(express.static(path.resolve(__dirname, "./client/build")));

  app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  });
}
