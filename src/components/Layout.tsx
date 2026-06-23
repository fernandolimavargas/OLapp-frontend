import Sidebar from "./Sidebar";
import "../style/layout.css";
import { Outlet } from "react-router-dom";
import TopBar from "./Topbar";
import { useState } from "react";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="main">
        <TopBar toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;