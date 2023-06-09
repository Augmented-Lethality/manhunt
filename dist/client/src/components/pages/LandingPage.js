"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const LoginButton_1 = require("../Auth0/LoginButton");
const SignupButton_1 = require("../Auth0/SignupButton");
const LandingPage = () => {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, "Welcome to the Landing Page"),
        react_1.default.createElement(LoginButton_1.LoginButton, null),
        react_1.default.createElement(SignupButton_1.SignupButton, null)));
};
exports.default = LandingPage;
