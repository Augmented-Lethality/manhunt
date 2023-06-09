"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageLoader = void 0;
const react_1 = __importDefault(require("react"));
function PageLoader() {
    return react_1.default.createElement("div", null, "Loading...");
}
exports.PageLoader = PageLoader;
