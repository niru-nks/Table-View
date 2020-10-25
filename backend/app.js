const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const rp = require("request-promise");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.get("/contacts", async (req, res) => {
    let response = await rp({
        uri: 'https://books.zoho.com/api/v3/contacts',
        qs: {
            organization_id: 649249007
        },
        headers: {
            'Authorization': 'Zoho-authtoken db36e02a50b57e081efe533a8a0f834b'
        },
        json: true
    })
        .catch(e => {
            console.log("Error fetching contacts: ", e);
            res.status(200).json({
                success: false,
                msg: "Error fetching contact Details",
				error: err
			});
        })

    return res.status(200).json({
        success: response.code === 0 ? true: false,
        msg: response.message,
        data: {
            contact: response.contacts ? response.contacts : []
        }
    });
});


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;