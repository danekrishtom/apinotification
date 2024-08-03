const express = require("express");
const app = new express();
const process = require('process');
var http = require("http").Server(app);
const config = require("config");
const port = config.get("server.port");
var bodyParser = require("body-parser");
require('dotenv/config');
var cors = require('cors');
var router = express.Router();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MODULE IMPORT START
const Doctor = require('./modules/doctor/doctor');
app.use("/doctor", Doctor);
const Physio = require('./modules/physio/physio');
app.use("/physio", Physio);
const Trainer = require('./modules/trainer/trainer');
app.use("/trainer", Trainer);
//MODULE IMPORT END

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser());

process.on('uncaughtException', (error) => {
    console.log('process.on err==>', error);
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.get('/', function (req, res, next) {
    return res.send("Hello Scheduler API!");
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on Port : ${process.env.PORT || port}`)
});