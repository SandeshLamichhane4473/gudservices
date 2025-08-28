import { Outlet } from "react-router-dom";
import SidebarIns from "./SidebarIns";

export default function DashboardLayoutIns() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarIns />

      {/* Main Content */}
      <main className="flex-1 bg-white overflow-auto p-4">
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
}
