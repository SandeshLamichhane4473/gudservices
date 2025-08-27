import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkStyle = {
    display: "block",
    padding: "12px 16px",
    color: "#ecf0f1",
    textDecoration: "none",
    borderRadius: "8px",
    marginBottom: "8px",
    transition: "all 0.3s ease",
  };

  const activeStyle = {
    background: "#1abc9c",
    color: "#fff",
    fontWeight: "bold",
  };

  return (
    <aside
      style={{
        width: "220px",
        background: "#2c3e50",
        color: "#fff",
        padding: "20px",
        height: "100vh",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#e9f0eeff" }}><b>Gud Engineering</b></h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <NavLink
            to="banks"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            🏗️ Banks
          </NavLink>
        </li>
        <li>
          <NavLink
            to="valuation"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            📊 Valuation
          </NavLink>
        </li>
        <li>
          <NavLink
            to="construction"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            📜 Construction
          </NavLink>
        </li>
        <li>
          <NavLink
            to="logout"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            🚪 Logout
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
