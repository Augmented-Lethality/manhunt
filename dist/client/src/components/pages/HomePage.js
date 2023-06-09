"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const auth0_react_1 = require("@auth0/auth0-react");
const LogoutButton_1 = require("../Auth0/LogoutButton");
const HomePage = () => {
    const { user, isAuthenticated } = (0, auth0_react_1.useAuth0)();
    if (!user) {
        return null;
    }
    return (isAuthenticated && (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null,
            "Welcome, ",
            user.name,
            "!"),
        react_1.default.createElement(LogoutButton_1.LogoutButton, null))));
};
exports.default = HomePage;
