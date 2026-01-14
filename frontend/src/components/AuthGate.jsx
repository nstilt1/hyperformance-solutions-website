import { Authenticator, useAuthenticator, withAuthenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import { usePathname } from "next/navigation";
import Navbar from "./NavbarResponsive";

const PUBLIC_PATHS = [/* "/login" */]; // add "/" here if you want homepage public, etc.

export default function AuthGate({ children }) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) return children;

  return (
    <Authenticator hideSignUp>
      {({ signOut, user }) => (
        <>
          {/* Optional: you can add a small header bar */}
          {/* <div style={{ padding: 12 }}>
            Signed in as {user?.username} <button onClick={signOut}>Sign out</button>
          </div> */}
          <Navbar signOut={signOut} />
          {children}
        </>
      )}
    </Authenticator>
  );
}