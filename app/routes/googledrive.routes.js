

// Retrieve all Tutorials

// Retrieve all published Tutorials

// // Retrieve a single Tutorial with id
// router.get("/find/:id", employee.findOne);

// // Update a Tutorial with id
// router.put("/update/:id", employee.update);

// // Delete a Tutorial with id
// router.delete("/delete/:id", employee.delete);

// router.get("/", employee.findAll);

// app.use('/api/employee', router);
const { google } = require('googleapis');
const path = require('path')
var multer = require('multer');
var FileReader = require('filereader')
const fs = require('fs');
const fileUpload = require('express-fileupload');
const { response } = require('express');
var filelink;
const CLIENT_ID = '897437962102-2lqj97bc2u4i5nv2cbe5d3ohfqnl396u.apps.googleusercontent.com';

const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04FyP-omZAqe-CgYIARAAGAQSNwF-L9IrnJMGqJg2QIpsBgY6up_3BeSrK1MqeWuaZAwilbg5pFX5cxKnQlb437sb5BMjPwLh6KY';


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI

);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

//const filePath = path.join(__dirname, 'Network.pdf')




// module.exports = app => {
//   const employee = require("../controllers/employee.controller.js");




async function uploadFile(file, callback) {
    try {
        console.warn(file)
        //console.log(fs.ReadStream(filePath))
        const filePath = path.join('./uploads', file.originalname)
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype
            },
            media: {
                mimeType: file.mimetype,
                body: fs.createReadStream(filePath)
            }
        })
        if (response.data.id.length != 0) {

            console.warn("UPLOAD DONE", response.data.id)
            console.warn("UPLOAD length", response.data.id.length)
            await generatePublicUrl(response.data.id, callback)
        }
        else {
            console.warn('Invalid ID', response.data.id);
            return false;
        }
        console.warn("UPLOAD DONE", response.data)


    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({
            message:
                error.message
        });
    }
}
async function generatePublicUrl(fileid, callback) {
    try {

        await drive.permissions.create({
            fileId: fileid,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileid,
            fields: 'webViewLink'
        })
        console.log(result.data);
        filelink = result.data;
        callback(result.data);

        // return result.data;
    }
    catch (error) {
        console.log(error.message);
    }
}
var uploadedFile;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {


        var dir = './uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: async function (req, file, callback) {
        uploadedFile = file;
        callback(null, file.originalname);


    },
    onFileUploadComplete: function (file) {
        // },newdata:function (req, file, callback) {
        console.log(file);
        //     //callback(null, file.originalname);
    }
    // }
});
module.exports = app => {
    var router = require("express").Router();
    var upload = multer({ storage: storage }).array('files', 12);
    router.post("/upload", (req, res) => {
        upload(req, res, function (err) {
            if (err) {
                return res.end("Something went wrong:(");
            }
            console.log(res);
             uploadFile(uploadedFile, () => {
                res.send({ result: 'successful', weblink: filelink })
            });



        });
    });
    app.use('/api/googledrive', router);

};
