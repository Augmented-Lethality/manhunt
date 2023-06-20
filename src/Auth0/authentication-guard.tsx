import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import PageLoader from "./Loading";

interface AuthenticationGuardProps {
  component: React.ComponentType<any>;
}

export const AuthenticationGuard = ({
  component: Component,
}: AuthenticationGuardProps) => {
  const ComponentWithAuthentication = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="page-layout">
        <PageLoader />
      </div>
    ),
  });

  return <ComponentWithAuthentication />;
};