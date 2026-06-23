import Sidebar from "./Sidebar";
import "../style/layout.css";
import { Outlet } from "react-router-dom";
import TopBar from "./Topbar";
import { useState } from "react";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userStorage = localStorage.getItem("user") || localStorage.getItem("userType");
  
  let isAdmin = false;
  if (userStorage) {
    if (userStorage.startsWith("{")) {
      try {
        const parsedUser = JSON.parse(userStorage);
        isAdmin = parsedUser.tipo === 1 || parsedUser.role === 1 || parsedUser.type === 1;
      } catch (e) {
        isAdmin = false;
      }
    } else {
      isAdmin = userStorage === "1";
    }
  }

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="main">
        <TopBar 
          toggleSideBar={() => setIsSidebarOpen(!isSidebarOpen)} 
          isAdmin={isAdmin} 
        />

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;