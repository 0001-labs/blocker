import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { convexReact } from "../convex-react";
import SignIn from "./SignIn";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convexReact}>
      <SignIn />
    </ConvexAuthProvider>
  </StrictMode>
);
