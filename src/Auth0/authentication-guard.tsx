import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ReactNode } from "react";
import PageLoader from "./Loading";

interface AuthenticationGuardProps {
  children: ReactNode;
}

export const AuthenticationGuard = ({
  children,
}: AuthenticationGuardProps) => {
  const ComponentWithAuthentication = withAuthenticationRequired(() => (
    <>{children}</>
  ), {
    onRedirecting: () => (
      <div className="page-layout">
        <PageLoader />
      </div>
    ),
  });

  return <ComponentWithAuthentication />;
};
