const express = require("express");
const fs = require('fs')
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
var multer  = require('multer');
const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");

// var storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//       var dir = './uploads';
//       if (!fs.existsSync(dir)){
//           fs.mkdirSync(dir);
//       }
//       callback(null, dir);
//   },
//   filename: function (req, file, callback) {
//       callback(null, file.originalname);
//   }
// });
app.get("/", (req, res) => {
  res.json({ message: "Welcome to node with squlize application." });
});
// var upload = multer({storage: storage}).array('files', 12);
// app.post('/upload', function (req, res, next) {
//   upload(req, res, function (err) {
//       if (err) {
//           return res.end("Something went wrong:(");
//       }
//       res.end("Upload completed.");
//   });
// })

require("./app/routes/turorial.routes")(app);
require("./app/routes/employee.routes")(app);
require("./app/routes/googledrive.routes")(app);
 

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
