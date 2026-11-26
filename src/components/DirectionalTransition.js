import { ViewTransition } from "react";

const types = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "none",
};

export default function DirectionalTransition({ className, children }) {
  return (
    <ViewTransition enter={types} exit={types} default="none">
      <main className={className}>{children}</main>
    </ViewTransition>
  );
}
