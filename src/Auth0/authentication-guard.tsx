import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
// import PageLoader from "../components/Loading";
import PhoneLoader from "../components/Loaders/PhoneLoader";

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <PhoneLoader />
      </div>
    ),
  });

  return <Component />;
};
