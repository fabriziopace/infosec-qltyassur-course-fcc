/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var ObjectId = require("mongodb").ObjectID;

const CONNECTION_STRING = process.env.DB;

const mongoose = require("mongoose");
mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let issueSchema = new mongoose.Schema({
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String,
    _id: Number
}, { versionKey: false });
let Issue = mongoose.model("Issue", issueSchema);

module.exports = function(app) {
    app
        .route("/api/issues/:project")

    .get(function(req, res) {
        let findJson = {};
        if (req.param("_id")) {
            findJson._id = req.param("_id");
        }
        if (req.param("issue_title")) {
            findJson.issue_title = req.param("issue_title");
        }
        if (req.param("issue_text")) {
            findJson.issue_text = req.param("issue_text");
        }
        if (req.param("created_on")) {
            findJson.created_on = req.param("created_on");
        }
        if (req.param("updated_on")) {
            findJson.updated_on = req.param("updated_on");
        }
        if (req.param("created_by")) {
            findJson.created_by = req.param("created_by");
        }
        if (req.param("assigned_to")) {
            findJson.assigned_to = req.param("assigned_to");
        }
        if (req.param("open")) {
            findJson.open = req.param("open");
        }
        if (req.param("status_text")) {
            findJson.status_text = req.param("status_text");
        }
        Issue.find(findJson).exec((err1, data) => {
            res.json(data);
        });
    })

    .post(function(req, res) {
        let issueTitle = req.body.issue_title;
        let issueText = req.body.issue_text;
        let createdBy = req.body.created_by;
        let assignedTo = req.body.assigned_to;
        let statusText = req.body.status_text;

        if (!issueTitle) {
            res.status(400).json({ error: "Please enter a issue title" });
        }
        if (!issueText) {
            res.status(400).json({ error: "Please enter a issue text" });
        }
        if (!createdBy) {
            res.status(400).json({ error: "Please enter a name" });
        }

        const newIssue = new Issue({
            issue_title: issueTitle,
            issue_text: issueText,
            created_on: new Date(),
            updated_on: new Date(),
            created_by: createdBy,
            assigned_to: assignedTo,
            open: true,
            status_text: statusText,
            _id: Date.now()
        });

        newIssue.save((err, data) => {
            res.json(data);
        });
    })

    .put(function(req, res) {
        if (!req.body) {
            res.status(400).send({ error: 'fill properly the request' });
        }

        let issueId = req.body._id;
        let issueTitle = req.body.issue_title;
        let issueText = req.body.issue_text;
        let createdBy = req.body.created_by;
        let assignedTo = req.body.assigned_to;
        let statusText = req.body.status_text;
        let statusOpen = req.body.open;

        Issue.findById({ _id: issueId }).exec((err, data) => {
            if (!data) {
                res.send("the issue " + issueId + " does not exist");
            }

            if (!issueTitle &&
                !issueText &&
                !createdBy &&
                !assignedTo &&
                !statusText &&
                !statusOpen
            ) {
                res.send("no updated field sent");
            }

            if (err) {
                res.send("could not update " + issueId);
            }
            if (issueTitle) {
                data.issue_title = issueTitle;
            }
            if (issueText) {
                data.issue_text = issueText;
            }
            if (createdBy) {
                data.created_by = createdBy;
            }
            if (assignedTo) {
                data.assigned_to = assignedTo;
            }
            if (statusText) {
                data.status_text = statusText;
            }
            if (statusOpen) {
                data.open = statusOpen;
            }

            data.updated_on = new Date();

            data.save((err, data) => {
                if (err) {
                    res.send("could not update " + issueId);
                }
                res.send("successfully updated");
            });
        });
    })

    .delete(function(req, res) {
        let issueId = req.body._id;
        if (!issueId) {
            res.status(400).send({ error: "_id error" });
        }

        Issue.findByIdAndRemove({ _id: issueId }, (err, data) => {
            if (err || !data) {
                res.send("could not delete " + issueId);
            }

            res.send("deleted " + issueId);
        });
    });
};