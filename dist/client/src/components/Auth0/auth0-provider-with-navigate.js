"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth0ProviderWithNavigate = void 0;
const auth0_react_1 = require("@auth0/auth0-react");
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Auth0ProviderWithNavigate = ({ children }) => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const domain = "dev-cxttpv5tsynl0jh2.us.auth0.com";
    const clientId = "TJtAYxTTITDgtZVckBeEds6zN7OPMoiU";
    const redirectUri = "http://localhost:3666";
    const onRedirectCallback = (appState) => {
        navigate((appState === null || appState === void 0 ? void 0 : appState.returnTo) || window.location.pathname);
    };
    if (!(domain && clientId && redirectUri)) {
        return (react_1.default.createElement("h1", null, "domain && clientId && redirectUri is not truthy inside auth0-provider file"));
    }
    return (react_1.default.createElement(auth0_react_1.Auth0Provider, { domain: domain, clientId: clientId, authorizationParams: {
            redirect_uri: redirectUri,
        }, onRedirectCallback: onRedirectCallback }, children));
};
exports.Auth0ProviderWithNavigate = Auth0ProviderWithNavigate;
