"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Loading_1 = require("./Auth0/Loading");
const auth0_react_1 = require("@auth0/auth0-react");
const authentication_guard_1 = require("./Auth0/authentication-guard");
const NotFoundPage_1 = __importDefault(require("./pages/NotFoundPage"));
const LandingPage_1 = __importDefault(require("./pages/LandingPage"));
const HomePage_1 = __importDefault(require("./pages/HomePage"));
const ProfilePage_1 = __importDefault(require("./pages/ProfilePage"));
const App = () => {
    const { isLoading } = (0, auth0_react_1.useAuth0)();
    if (isLoading) {
        return (react_1.default.createElement("div", { className: "page-layout" },
            react_1.default.createElement(Loading_1.PageLoader, null)));
    }
    return (react_1.default.createElement(react_router_dom_1.Routes, null,
        react_1.default.createElement(react_router_dom_1.Route, { path: "/", element: react_1.default.createElement(LandingPage_1.default, null) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/home", element: react_1.default.createElement(authentication_guard_1.AuthenticationGuard, { component: HomePage_1.default }) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "/profile", element: react_1.default.createElement(authentication_guard_1.AuthenticationGuard, { component: ProfilePage_1.default }) }),
        react_1.default.createElement(react_router_dom_1.Route, { path: "*", element: react_1.default.createElement(NotFoundPage_1.default, null) })));
};
exports.default = App;
