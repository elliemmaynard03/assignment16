const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const http = require("http");

app.use(cors({
    origin: 'https://countries-updated.onrender.com'
  }));

app.use(cors({
    origin: '/api/countries'
  }));

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let countries = [{
        _id: 1,
        name: "America",
        // population: "332 million",
        language: "English",
        origin: "1776",
        capitol: "Washington D.C",
        president: "Joe Biden",
        funfacts:["Has New York City", "Nicknamed the Big Apple"]
    },
    {
        _id: 2,
        name: "Japan",
        // population: "600 million",
        language: "Japanese",
        origin: "1952",
        capitol: "Tokyo",
        president: "Fumio Kishida",
        funfacts:["Has Cherry Blossom trees", "Ancient traditions"]
       },
       {
        _id: 3,
        name: "Ireland",
        population: "400 million",
        language: "Irish",
        origin: "1776",
        capitol: "Dublin",
        president: "Michael Daniel Higgins",
        funfacts:["Has big cliffs", "Gloomy weather"]
       },
       {
        _id: 4,
        name: "Australia",
        // population: "200 million",
        language: "English",
        origin: "1986",
        capitol: "Canberra",
        president: "Anthony Albanese",
        funfacts:["Has kangaroos", "Australia is both a continent and a country"]
       },
       {
        _id: 5,
        name: "Russia",
        // population: "140 million",
        language: "Ukrainian",
        origin: "1991",
        capitol: "Moscow",
        president: "Vladimir Putin",
        funfacts:["Part of Asia and Europe", "Largely uninhabited"]
       },
       {
        _id: 6,
        name: "Egypt",
        // population: "300 million",
        language: "Arabic",
        origin: "1922",
        capitol: "Cairo",
        president: "Abdel Fattah el-Sisi",
        funfacts:["Has the Pyramids of Giza", "Buried in tombs"]
       }
];

app.get("/api/countries", (req, res) => {
    res.send(countries);
});

app.post("/api/countries", upload.single("img"), (req, res) => {
    const result = validateCountry(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const country = {
        _id: countries.length + 1,
        name: req.body.name,
        capitol: req.body.capitol,
        president: req.body.president,
        origin: req.body.origin,
        language: req.body.language,
        funfacts: req.body.funfacts.split(",")
    }

    if (req.file) {
        country.img = "images/" + req.file.filename;
    }

    countries.push(country);
    res.send(countries);
});

app.put("/api/countries/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const country = countries.find((r) => r._id === id);;

    const result = validateCountry(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    country.name = req.body.name;
    country.capitol = req.body.capitol,
    country.president = req.body.president,
    country.origin = req.body.origin,
    country.language = req.body.language,
    country.funfacts = req.body.funfacts.split(",")

    if (req.file) {
        country.img = "images/" + req.file.filename;
    }

    res.send(country);
});

app.delete("/api/countries/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const country = countries.find((r) => r._id === id);

    if (!country) {
        res.status(404).send("The country was not found");
        return;
    }

    const index = countries.indexOf(country);
    countries.splice(index, 1);
    res.send(country);

});


const validateCountry = (country) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        funfacts: Joi.allow(""),
        name: Joi.string().min(3).required(),
        capitol: Joi.string().min(3).required(),
        president: Joi.string().min(3).required(),
        origin: Joi.string().min(3).required(),
        language: Joi.string().min(3).required()
    });

    return schema.validate(country);
};

const port = process.env.PORT || 10000;

http.createServer(app).listen(port, () => {
    console.log(`Server is running on port ${port}`);
});