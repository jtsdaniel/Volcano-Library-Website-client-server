import React from "react";

import Nav from "./Nav";
// the header component
export default function Header() {
  return (
    <header>
      {/* icon */}
      <div id="icon">
        <img src="img/icon.png" alt="Icon" />
      </div>

      <Nav />
    </header>
  );
}
