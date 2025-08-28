import React from "react";
import { NavLink } from "react-router-dom";

export default function SidebarIns() {
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
      <h2 style={{ marginBottom: "20px", color: "#e9f0eeff" }}><b>Gud Survey</b></h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <NavLink
            to="insurance"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            🏗️ Inurance
          </NavLink>
        </li>
        <li>
          <NavLink
            to="newreferences"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            📊 New Ref
          </NavLink>
        </li>
        <li>
          <NavLink
            to="editref"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            📜 Edit Ref
          </NavLink>

            <NavLink
            to="reports"
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
          📊 Report
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
