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
var ObjectId = require("mongodb").ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;

const mongoose = require("mongoose");
mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let bookSchema = new mongoose.Schema({
    title: String,
    comments: Array,
    _id: Number
}, { versionKey: false });
let Book = mongoose.model("Book", bookSchema);

module.exports = function(app) {
    app
        .route("/api/books")
        .get(function(req, res) {
            Book.find().exec((err, data) => {
                if (err || !data) {
                    res.send("no book exists");
                }
                const json = [];
                data.map(d => {
                    let jsonS = {
                        _id: d._id,
                        title: d.title,
                        commentcount: d.comments.length
                    };
                    json.push(jsonS);
                });
                res.json(json);
            });
        })

    .post(function(req, res) {
        if (!req.body.title) {
            res.status(400).send({ error: "Please enter a valid book title" });
        }

        const newBook = new Book({
            title: req.body.title,
            _id: Date.now()
        });

        newBook.save((err, data) => {
            res.json(data);
        });
    })

    .delete(function(req, res) {
        Book.deleteMany({}, (err, data) => {
            if (err || !data) {
                res.send("no book exists");
            }

            res.send("complete delete successful");
        });
    });

    app
        .route("/api/books/:id")
        .get(function(req, res) {
            var bookId = req.params.id;
            if (!bookId) {
                res.status(400).send("Please enter a valid book id");
            }

            Book.findById({ _id: bookId }).exec((err, data) => {
                if (!data) {
                    res.send("no book exists");
                }
                res.json(data);
            });
        })

    .post(function(req, res) {
        var bookId = req.params.id;
        var comment = req.body.comment;
        if (!bookId) {
            res.status(400).send("Please enter a valid book id");
        }
        if (!comment) {
            res.status(400).send("Please enter a valid book comment");
        }

        Book.findById({ _id: bookId }).exec((err, data) => {
            if (!data) {
                res.send("no book exists");
            }

            data.comments.push(comment);

            data.save((err, data) => {
                if (err) {
                    res.send("could not update " + bookId);
                }

                res.json(data);
            });
        });
    })

    .delete(function(req, res) {
        var bookId = req.params.id;
        if (!bookId) {
            res.status(400).send({ error: "_id error" });
        }
        Book.findByIdAndRemove({ _id: bookId }, (err, data) => {
            if (err || !data) {
                res.send("no book exists");
            }

            res.send("delete successful");
        });
    });
};