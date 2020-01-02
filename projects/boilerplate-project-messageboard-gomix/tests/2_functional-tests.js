/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
    suite("API ROUTING FOR /api/threads/:board", function() {
        suite("POST", function() {
            test("Test POST /api/threads/:board with board", function(done) {
                chai
                    .request(server)
                    .post("/api/threads/general")
                    .send({
                        text: "text",
                        delete_password: "deletepsw"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        done();
                    });
            });
            test("Test POST /api/threads/:board without board", function(done) {
                chai
                    .request(server)
                    .post("/api/threads/")
                    .send({
                        text: "text",
                        delete_password: "deletepsw"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, "Please enter a valid board");
                        done();
                    });
            });
        });

        suite("GET", function() {
            test("Test GET /api/threads/{board}", function(done) {
                chai
                    .request(server)
                    .get("/api/thread/general")
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        done();
                    });
            });
        });

        suite("DELETE", function() {
            test("Test DELETE /api/threads/{board} with correct password", function(done) {
                chai
                    .request(server)
                    .delete("/api/thread/general")
                    .send({
                        delete_password: "deletepsw"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, "success");
                        done();
                    });
            });
        });

        suite("PUT", function() {
            test("Test PUT /api/threads/{board}", function(done) {
                chai
                    .request(server)
                    .put("/api/thread/general")
                    .send({
                        thread_id: "1577940581026"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, "success");
                        done();
                    });
            });
        });
    });

    suite("API ROUTING FOR /api/replies/:board", function() {
        suite("POST", function() {
            test("Test POST /api/replies/:board with board", function(done) {
                chai
                    .request(server)
                    .post("/api/replies/general")
                    .send({
                        text: "text",
                        delete_password: "deletepsw",
                        thread_id: "1577940581026"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        done();
                    });
            });
            test("Test POST /api/replies/:board without board", function(done) {
                chai
                    .request(server)
                    .post("/api/replies/")
                    .send({
                        text: "text",
                        delete_password: "deletepsw",
                        thread_id: "1577940581026"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 400);
                        assert.equal(res.body.error, "Please enter a valid board");
                        done();
                    });
            });
        });

        suite("GET", function() {
            test("Test GET /api/replies/{board}", function(done) {
                chai
                    .request(server)
                    .get("/api/replies/general")
                    .query({ thread_id: "1577940581026" })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.isArray(res.body);
                        done();
                    });
            });
        });

        suite("PUT", function() {
            test("Test PUT /api/replies/{board}", function(done) {
                chai
                    .request(server)
                    .put("/api/replies/general")
                    .send({
                        thread_id: "1577940581026",
                        reply_id: "1577940766980"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, "success");
                        done();
                    });
            });
        });

        suite("DELETE", function() {
            test("Test DELETE /api/replies/{board} with correct password", function(done) {
                chai
                    .request(server)
                    .delete("/api/replies/general")
                    .send({
                        thread_id: "1577940581026",
                        reply_id: "1577940766980",
                        delete_password: "deletepsw"
                    })
                    .end(function(err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body, "success");
                        done();
                    });
            });
        });
    });
});