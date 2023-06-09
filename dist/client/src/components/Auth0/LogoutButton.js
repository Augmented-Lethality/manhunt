"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutButton = void 0;
const auth0_react_1 = require("@auth0/auth0-react");
const react_1 = __importDefault(require("react"));
const LogoutButton = () => {
    const { logout } = (0, auth0_react_1.useAuth0)();
    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    };
    return (react_1.default.createElement("button", { className: "button__logout", onClick: handleLogout }, "Log Out"));
};
exports.LogoutButton = LogoutButton;
