const express = require('express');
const path = require('path');

const mainDirectory = "/home/greg/Documents/Web_Dev/NURBSJS";
const buildDirectory = path.join(mainDirectory, "build");

let app = express();
app.use(express.static(mainDirectory));

app.get("/", (request, response) => {
    response.sendFile(path.join(mainDirectory, "index.html"));
})

app.get("/styles.css", (request, response) => {
    response.sendFile(path.join(mainDirectory, "styles.css"));
})

app.get("/bundle.js", (request, response) => {
    response.sendFile(path.join(buildDirectory, "bundle.js"));
})

app.get("/bundle2.js", (request, response) => {
    response.sendFile(path.join(buildDirectory, "bundle2.js"));
})

app.listen(3000, () => {
    console.log("Listening on port 80");
})