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

const CONNECTION_STRING = process.env.DB;

const mongoose = require("mongoose");
const request = require("request");
const requestIp = require("request-ip");

mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let stockLikesSchema = new mongoose.Schema({
    _id: Number,
    stock: String,
    ip: String
}, { versionKey: false });
let StockLikes = mongoose.model("StockLikes", stockLikesSchema);

module.exports = function(app) {
    app.route("/api/stock-prices").get(function(req, res) {
        let stock = "";
        let stock2 = "";
        if (Array.isArray(req.query.stock)) {
            if (req.query.stock.length > 1) {
                stock = req.query.stock[0];
                stock2 = req.query.stock[1];
            }
        } else {
            stock = req.query.stock;
        }
        let like = req.query.like;
        let clientIp = requestIp.getClientIp(req);
        let jsonRes = "";

        if (stock2) {
            request(
                "https://repeated-alpaca.glitch.me/v1/stock/" + stock + "/quote",
                (err, data, body) => {
                    let jsonData = JSON.parse(body);
                    request(
                        "https://repeated-alpaca.glitch.me/v1/stock/" + stock2 + "/quote",
                        (err2, data2, body2) => {
                            let jsonData2 = JSON.parse(body2);
                            jsonRes = {
                                stockData: [{
                                        stock: jsonData.symbol,
                                        price: jsonData.latestPrice,
                                        rel_likes: 0
                                    },
                                    {
                                        stock: jsonData2.symbol,
                                        price: jsonData2.latestPrice,
                                        rel_likes: 0
                                    }
                                ]
                            };

                            res.json(jsonRes);
                        }
                    );
                }
            );
        } else {
            request(
                "https://repeated-alpaca.glitch.me/v1/stock/" + stock + "/quote",
                (err, data, body) => {
                    let jsonData = JSON.parse(body);
                    jsonRes = {
                        stockData: {
                            stock: jsonData.symbol,
                            price: jsonData.latestPrice,
                            likes: 0
                        }
                    };

                    StockLikes.find({
                        stock: jsonRes.stockData.stock,
                        ip: clientIp
                    }).exec((err, data) => {
                        if (like && data.length === 0) {
                            const newStockLikes = new StockLikes({
                                _id: Date.now(),
                                stock: jsonRes.stockData.stock,
                                ip: clientIp
                            });

                            newStockLikes.save((err, data) => {
                                StockLikes.find({
                                    stock: jsonRes.stockData.stock
                                }).exec((err, data) => {
                                    jsonRes.stockData.likes = data.length;
                                    res.json(jsonRes);
                                });
                            });
                        } else {
                            StockLikes.find({
                                stock: jsonRes.stockData.stock
                            }).exec((err, data) => {
                                jsonRes.stockData.likes = data.length;
                                res.json(jsonRes);
                            });
                        }
                    });
                }
            );
        }
    });
};