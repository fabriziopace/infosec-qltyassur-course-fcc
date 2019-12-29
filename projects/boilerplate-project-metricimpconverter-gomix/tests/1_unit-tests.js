/*
 *
 *
 *       FILL IN EACH UNIT TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

var chai = require("chai");
var assert = chai.assert;
var ConvertHandler = require("../controllers/convertHandler.js");

var convertHandler = new ConvertHandler();

suite("Unit Tests", function() {
    suite("Function convertHandler.getNum(input)", function() {
        test("Whole number input", function(done) {
            var input = "32L";
            assert.equal(convertHandler.getNum(input), 32);
            done();
        });

        test("Decimal Input", function(done) {
            var input = "1.5kg";
            assert.equal(convertHandler.getNum(input, 1.5));
            done();
        });

        test("Fractional Input", function(done) {
            var input = "1/2km";
            assert.equal(convertHandler.getNum(input, 0.5));
            done();
        });

        test("Fractional Input w/ Decimal", function(done) {
            var input = "5.4/3lbs";
            assert.equal(convertHandler.getNum(input, 1.8));
            done();
        });

        test("Invalid Input (double fraction)", function(done) {
            var input = "1/2/6kg";
            assert.equal(convertHandler.getNum(input, 0.08333));
            done();
        });

        test("No Numerical Input", function(done) {
            var input = "l";
            assert.equal(convertHandler.getNum(input, 1));
            done();
        });
    });

    suite("Function convertHandler.getUnit(input)", function() {
        test("For Each Valid Unit Inputs", function(done) {
            var input = [
                "gal",
                "l",
                "mi",
                "km",
                "lbs",
                "kg",
                "GAL",
                "L",
                "MI",
                "KM",
                "LBS",
                "KG"
            ];
            input.forEach(function(ele, i) {
                assert.equal(convertHandler.getUnit(ele, input[i].toLowerCase()));
            });
            done();
        });

        test("Unknown Unit Input", function(done) {
            var input = "inv";
            assert.equal(convertHandler.getUnit(input, ""));
            done();
        });
    });

    suite("Function convertHandler.getReturnUnit(initUnit)", function() {
        test("For Each Valid Unit Inputs", function(done) {
            var input = ["gal", "l", "mi", "km", "lbs", "kg"];
            var expect = ["l", "gal", "km", "mi", "kg", "lbs"];
            input.forEach(function(ele, i) {
                assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
            });
            done();
        });
    });

    suite("Function convertHandler.spellOutUnit(unit)", function() {
        test("For Each Valid Unit Inputs", function(done) {
            var input = ["gal", "l", "mi", "km", "lbs", "kg"];
            var expect = [
                "gallons",
                "liters",
                "miles",
                "kilometers",
                "pounds",
                "kilograms"
            ];
            input.forEach(function(ele, i) {
                assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
            });
            done();
        });
    });

    suite("Function convertHandler.convert(num, unit)", function() {
        test("Gal to L", function(done) {
            var input = [5, "gal"];
            var expected = 18.9271;
            assert.approximately(
                convertHandler.convert(input[0], input[1]),
                expected,
                0.1
            ); //0.1 tolerance
            done();
        });

        test("L to Gal", function(done) {
            var input = [10, "l"];
            var expected = 2.64172;
            assert.approximately(
                convertHandler.convert(input[0], input[1]),
                expected,
                0.1
            ); //0.1 tolerance
            done();
        });

        test("Mi to Km", function(done) {
            var input = [2 / 5, "mi"];
            var expected = 0.64374;
            assert.approximately(
                convertHandler.convert(input[0], input[1]),
                expected,
                0.1
            ); //0.1 tolerance
            done();
        });

        test("Km to Mi", function(done) {
            var input = [44, "km"];
            var expected = 27.3404;
            assert.approximately(
                convertHandler.convert(input[0], input[1]),
                expected,
                0.1
            ); //0.1 tolerance
            done();
        });

        test("Lbs to Kg", function(done) {
            var input = [4, "lbs"];
            var expected = 1.81437;
            assert.approximately(
                convertHandler.convert(input[0], input[1]),
                expected,
                0.1
            ); //0.1 tolerance
            done();
        });

        test("Kg to Lbs", function(done) {
            var input = [8, "kg"];
            var expected = 17.637;
            assert.approximately(
                convertHandler.convert(input[0], input[1]),
                expected,
                0.1
            ); //0.1 tolerance
            done();
        });
    });
});