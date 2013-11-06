﻿jQuery.fn.alternateRowColors = function () {
    $("tbody tr:odd", this).removeClass("even").addClass("odd");
    $("tbody tr:even", this).removeClass("odd").addClass("even");
    return this;
}

Array.prototype.contains = function () {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == arguments[0]) {
            return true;
        }
    }
    return false;
};

Array.prototype.remove = function (s) {
    if (this.indexOf(s) !== -1) {
        this.splice(this.indexOf(s), 1);
    }
}

String.prototype.capitalize = function () {
    return this.replace(/^\w/, function (s) {
        return s.toUpperCase();
    });
};

String.prototype.equal = function (str1, str2) {
    return str1.localeCompare(str2) == 0;
};