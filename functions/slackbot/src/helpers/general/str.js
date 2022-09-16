function isEmpty(str) {
    if (str == null || str == undefined || str == "") {
        return true;
    }
    return false;
}

function isString(val) {
    return typeof val === "string" || ((!!val && typeof val === "object") && Object.prototype.toString.call(val) === "[object String]");
}

module.exports = {
    isEmpty,
    isString
};
