"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth0_react_1 = require("@auth0/auth0-react");
const react_1 = __importDefault(require("react"));
const ProfilePage = () => {
    const { user } = (0, auth0_react_1.useAuth0)();
    if (!user) {
        return null;
    }
    return (react_1.default.createElement("div", { className: "content-layout" },
        react_1.default.createElement("h1", { id: "page-title", className: "content__title" }, "Profile Page"),
        react_1.default.createElement("div", { className: "content__body" },
            react_1.default.createElement("p", { id: "page-description" },
                react_1.default.createElement("span", null,
                    "You can use the ",
                    react_1.default.createElement("strong", null, "ID Token"),
                    " to get the profile information of an authenticated user."),
                react_1.default.createElement("span", null,
                    react_1.default.createElement("strong", null, "Only authenticated users can access this page."))),
            react_1.default.createElement("div", { className: "profile-grid" },
                react_1.default.createElement("div", { className: "profile__header" },
                    react_1.default.createElement("img", { src: user.picture, alt: "Profile", className: "profile__avatar" }),
                    react_1.default.createElement("div", { className: "profile__headline" },
                        react_1.default.createElement("h2", { className: "profile__title" }, user.name),
                        react_1.default.createElement("span", { className: "profile__description" }, user.email))),
                react_1.default.createElement("div", { className: "profile__details" },
                    react_1.default.createElement("h2", null, "Decoded ID Token"),
                    react_1.default.createElement("p", null, JSON.stringify(user, null, 2)))))));
};
exports.default = ProfilePage;
