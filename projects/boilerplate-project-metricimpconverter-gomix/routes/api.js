/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
var ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function(app) {

    var convertHandler = new ConvertHandler();

    app.route('/api/convert')
        .get(function(req, res) {
            var input = req.query.input;
            if (!input) { res.json({ "error": "invalid number and unit" }); }

            var initNum = convertHandler.getNum(input);
            var initUnit = convertHandler.getUnit(input);
            if (!initUnit) {
                res.json({ "error": "no unit" });
            }

            var returnNum = convertHandler.convert(initNum, initUnit);
            var returnUnit = convertHandler.getReturnUnit(initUnit);
            var toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

            if (!returnNum) {
                res.json({ "error": "invalid number" });
            }
            if (!returnUnit) {
                res.json({ "error": "invalid unit" });
            }


            res.json({ "initNum": initNum, "initUnit": initUnit, "returnNum": returnNum, "returnUnit": returnUnit, "string": toString });
        });

};