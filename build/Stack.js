"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleStack = void 0;
var SimpleStack = /** @class */ (function () {
    function SimpleStack() {
        this._stack = [];
    }
    SimpleStack.prototype.push = function (element) {
        this._stack.unshift(element);
    };
    SimpleStack.prototype.pop = function () {
        return this._stack.shift();
    };
    SimpleStack.prototype.peek = function () {
        return this._stack.length ? this._stack[0] : undefined;
    };
    return SimpleStack;
}());
exports.SimpleStack = SimpleStack;
