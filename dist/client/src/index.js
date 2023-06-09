"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const auth0_provider_with_navigate_1 = require("./components/Auth0/auth0-provider-with-navigate");
const react_router_dom_1 = require("react-router-dom");
const App_1 = __importDefault(require("./components/App"));
const rootElement = document.getElementById('app');
// HTMLElement | null; had to add error handling or has an error
if (!rootElement) {
    throw new Error('Failed to find the root element');
}
;
const root = client_1.default.createRoot(rootElement);
root.render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(auth0_provider_with_navigate_1.Auth0ProviderWithNavigate, null,
            react_1.default.createElement(App_1.default, null)))));
