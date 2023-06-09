"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupButton = void 0;
const auth0_react_1 = require("@auth0/auth0-react");
const react_1 = __importDefault(require("react"));
const SignupButton = () => {
    const { loginWithRedirect } = (0, auth0_react_1.useAuth0)();
    const handleSignUp = () => __awaiter(void 0, void 0, void 0, function* () {
        yield loginWithRedirect({
            appState: {
                returnTo: "/home",
            },
            authorizationParams: {
                screen_hint: "signup",
            },
        });
    });
    return (react_1.default.createElement("button", { className: "button__sign-up", onClick: handleSignUp }, "Sign Up"));
};
exports.SignupButton = SignupButton;
