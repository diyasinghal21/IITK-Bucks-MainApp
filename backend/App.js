const express = require('express');
const routes = require("./server/routes/routes");
const { FindPeer } = require('./server/controllers/peercontroller');
const app = express();
const peercontroller = require("./server/controllers/peercontroller");
const dotenv = require("dotenv");
dotenv.config()
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin,Content-Type,Accept,Authorization,X-Requested-With"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,PATCH");
    next();
});
app.use("", routes);


app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured!" });
});





app.listen(5000, () => {

    // peercontroller.FindPeer();
    console.log("Listening at", process.env.URL);

});
