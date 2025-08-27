import React, { useState } from "react";
import ResponsiveTable from "./ResponsiveTable";
export default function Construction() {
  const [projects, setProjects] = useState([
    { id: 1, name: "Bridge Construction", status: "In Progress" },
    { id: 2, name: "Office Tower", status: "Completed" },
    { id: 3, name: "Highway Expansion", status: "Pending" },
  ]);

  return (
    <div  className="text-black" style={{ padding: "20px" }}>
      <h1>Construction Projects</h1>
      <p>List of ongoing and completed construction projects.</p>

    
    </div>
  );
}
