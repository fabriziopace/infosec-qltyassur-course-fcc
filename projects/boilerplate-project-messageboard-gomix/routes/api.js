/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const MongoClient = require("mongodb");
const MONGODB_CONNECTION_STRING = process.env.DB;

const mongoose = require("mongoose");
mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const threadSchema = new mongoose.Schema({
    _id: Number,
    text: String,
    created_on: Date,
    bumped_on: Date,
    reported: Boolean,
    delete_password: String,
    replies: Array,
    board: String
}, { versionKey: false });
const Thread = mongoose.model("Thread", threadSchema);

module.exports = function(app) {
    app
        .route("/api/threads/:board")
        .get((req, res) => {
            let boardName = req.params.board;
            if (!boardName) {
                res.status(400).send("Please enter a valid board");
            }

            Thread.find({ board: boardName })
                .sort({ bumped_on: 1 })
                .limit(10)
                .select({ reported: 0, delete_password: 0 })
                .exec((err, data) => {
                    if (!data) {
                        res.send("no board exists");
                    }
                    res.json(data);
                });
        })
        .post((req, res) => {
            let threadText = req.body.text;
            let deletePassword = req.body.delete_password;
            let board = req.params.board;
            if (!threadText) {
                res.status(400).send({ error: "Please enter a thread text" });
            }
            if (!deletePassword) {
                res.status(400).send({ error: "Please enter a delete password" });
            }
            if (!board) {
                res.status(400).send("Please enter a valid board");
            }

            const newThread = new Thread({
                _id: Date.now(),
                text: threadText,
                delete_password: deletePassword,
                created_on: new Date(),
                bumped_on: new Date(),
                reported: false,
                replies: [],
                board
            });

            newThread.save((err, data) => {
                res.redirect("/b/" + data.board + "/");
            });
        })
        .delete(function(req, res) {
            let board = req.params.board;
            let deletePassword = req.body.delete_password;
            if (!board) {
                res.status(400).send("Please enter a valid board");
            }
            if (!deletePassword) {
                res.status(400).send({ error: "Please enter a delete password" });
            }
            Thread.findAndRemove({ board, delete_password: deletePassword },
                (err, data) => {
                    if (err || !data) {
                        res.send("incorrect password");
                    }

                    res.send("success");
                }
            );
        })
        .put((req, res) => {
            let boardName = req.params.board;
            let threadId = req.body.thread_id;
            if (!boardName) {
                res.status(400).send("Please enter a valid board");
            }
            if (!threadId) {
                res.status(400).send({ error: "Please enter a thread id" });
            }

            Thread.findById({ _id: threadId })
                .select({ reported: 0, delete_password: 0 })
                .exec((err, data) => {
                    if (!data) {
                        res.send("no thread exists");
                    }
                    data.reported = true;

                    data.save((err2, data2) => {
                        res.send("success");
                    });
                });
        });

    app
        .route("/api/replies/:board")
        .get((req, res) => {
            let boardName = req.params.board;
            let threadId = req.query.thread_id;
            if (!boardName) {
                res.status(400).send("Please enter a valid board");
            }
            if (!threadId) {
                res.status(400).send({ error: "Please enter a thread id" });
            }

            Thread.findById({ _id: threadId })
                .select({ reported: 0, delete_password: 0 })
                .exec((err, data) => {
                    if (!data) {
                        res.send("no thread exists");
                    }
                    res.json(data);
                });
        })
        .post((req, res) => {
            let replyText = req.body.text;
            let deletePassword = req.body.delete_password;
            let threadId = req.body.thread_id;
            let board = req.params.board;
            if (!replyText) {
                res.status(400).send({ error: "Please enter a reply text" });
            }
            if (!deletePassword) {
                res.status(400).send({ error: "Please enter a delete password" });
            }
            if (!threadId) {
                res.status(400).send({ error: "Please enter a thread id" });
            }
            if (!board) {
                res.status(400).send("Please enter a valid board");
            }

            Thread.findById({ _id: threadId }).exec((err, data) => {
                if (!data) {
                    res.send("no thread exists");
                }
                data.bumped_on = new Date();

                const newReply = {
                    _id: Date.now(),
                    text: replyText,
                    created_on: new Date(),
                    delete_password: deletePassword,
                    reported: false
                };

                data.replies.push(newReply);

                data.save((err, data) => {
                    res.redirect("/b/" + board + "/" + threadId + "/");
                });
            });
        })
        .delete(function(req, res) {
            let board = req.params.board;
            let threadId = req.body.thread_id;
            let replyId = req.body.reply_id;
            let deletePassword = req.body.delete_password;
            if (!board) {
                res.status(400).send("Please enter a valid board");
            }
            if (!threadId) {
                res.status(400).send({ error: "Please enter a thread id" });
            }
            if (!replyId) {
                res.status(400).send({ error: "Please enter a reply id" });
            }
            if (!deletePassword) {
                res.status(400).send({ error: "Please enter a delete password" });
            }
            Thread.findById({ _id: threadId }, (err, data) => {
                if (err || !data) {
                    res.send("no thread found");
                }

                data.replies.find(d => {
                    if (d._id === replyId) {
                        if (d.delete_password !== deletePassword) {
                            res.send("incorrect password");
                        }
                        d.text = "[deleted]";
                    }
                });

                data.save((err2, data2) => {
                    res.send("success");
                });
            });
        })
        .put((req, res) => {
            let boardName = req.params.board;
            let threadId = req.body.thread_id;
            let replyId = req.body.reply_id;
            if (!boardName) {
                res.status(400).send("Please enter a valid board");
            }
            if (!threadId) {
                res.status(400).send({ error: "Please enter a thread id" });
            }
            if (!replyId) {
                res.status(400).send({ error: "Please enter a reply id" });
            }

            Thread.findById({ _id: threadId }),
                (err, data) => {
                    if (err || !data) {
                        res.send("no thread or reply exists");
                    }

                    data.replies.find(d => {
                        if (d._id === replyId) {
                            d.reported = true;
                        }
                    });

                    data.save((err2, data2) => {
                        res.send("success");
                    });
                };
        });
};