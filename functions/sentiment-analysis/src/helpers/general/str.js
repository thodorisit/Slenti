function isEmpty(str) {
    if (str == null || str == undefined || str == "") {
        return true;
    }
    return false;
}

function isString(value) {
    return typeof value === "string" || ((!!value && typeof value === "object") && Object.prototype.toString.call(value) === "[object String]");
}

function isInteger(value) {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

module.exports = {
    isEmpty,
    isString,
    isInteger
};
