import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-white overflow-auto p-4">
        <Outlet /> {/* Nested routes render here */}
      </main>
    </div>
  );
}
