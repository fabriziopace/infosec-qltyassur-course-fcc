/*
 *
 *
 *       Complete the handler logic below
 *
 *
 */

function ConvertHandler() {
    this.getNum = function(input) {
        let letters = input.match(/[A-Za-z]+/g);
        let result = eval(input.split(letters[0])[0]) || 1;
        return result;
    };

    this.getUnit = function(input) {
        let letters = input.match(/[A-Za-z]+/g);
        let result = letters[0] + input.split(letters[0])[1];
        return result;
    };

    this.getReturnUnit = function(initUnit) {
        let result = "";
        switch (initUnit.toLowerCase()) {
            case "gal":
                result = "l";
                break;
            case "l":
                result = "gal";
                break;
            case "lbs":
                result = "kg";
                break;
            case "kg":
                result = "lbs";
                break;
            case "mi":
                result = "km";
                break;
            case "km":
                result = "mi";
                break;
            default:
                result = "";
                break;
        }
        return result;
    };

    this.spellOutUnit = function(unit) {
        let result;
        switch (unit.toLowerCase()) {
            case "gal":
                result = "gallons";
                break;
            case "l":
                result = "liters";
                break;
            case "lbs":
                result = "pounds";
                break;
            case "kg":
                result = "kilograms";
                break;
            case "mi":
                result = "miles";
                break;
            case "km":
                result = "kilometers";
                break;
            default:
                result = "";
                break;
        }
        return result;
    };

    this.convert = function(initNum, initUnit) {
        const galToL = 3.78541;
        const lbsToKg = 0.453592;
        const miToKm = 1.60934;
        let result;
        switch (initUnit.toLowerCase()) {
            case "gal":
                result = parseFloat((initNum * 3.78541).toFixed(5));
                break;
            case "l":
                result = parseFloat((initNum / 3.78541).toFixed(5));
                break;
            case "lbs":
                result = parseFloat((initNum * 0.453592).toFixed(5));
                break;
            case "kg":
                result = parseFloat((initNum / 0.453592).toFixed(5));
                break;
            case "mi":
                result = parseFloat((initNum * 1.60934).toFixed(5));
                break;
            case "km":
                result = parseFloat((initNum / 1.60934).toFixed(5));
                break;
            default:
                result = "";
                break;
        }
        return result;
    };

    this.getString = function(initNum, initUnit, returnNum, returnUnit) {
        let result = initNum + " " + this.spellOutUnit(initUnit) + " converts to " + returnNum + " " + this.spellOutUnit(returnUnit);
        return result;
    };
}

module.exports = ConvertHandler;