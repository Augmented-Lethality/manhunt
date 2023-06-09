"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationGuard = void 0;
const auth0_react_1 = require("@auth0/auth0-react");
const react_1 = __importDefault(require("react"));
const Loading_1 = require("./Loading");
const AuthenticationGuard = ({ component }) => {
    const Component = (0, auth0_react_1.withAuthenticationRequired)(component, {
        onRedirecting: () => (react_1.default.createElement("div", { className: "page-layout" },
            react_1.default.createElement(Loading_1.PageLoader, null))),
    });
    return react_1.default.createElement(Component, null);
};
exports.AuthenticationGuard = AuthenticationGuard;
