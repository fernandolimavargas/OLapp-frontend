import "../style/sidebar.css"
import { Home, Users, FileText, ChevronRight, Dumbbell, MessageCircle} from "lucide-react"
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { menusItems } from "./MenuItens";

function Sidebar({isOpen}: {isOpen: boolean}) { 
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (label: string) => { 
        setOpenMenus(prev => 
            prev.includes(label) 
              ? prev.filter(item => item !== label)
              : [...prev, label]
        )
    }; 

    return (
       <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
                <img
                    src="https://i.pravatar.cc/40" 
                    alt="user"
                    className="profile-img"/>
                <span className="user-name">Fernando Vargas</span>
            </div>
            <nav>
                {menusItems.map((item) => { 
                    const Icon = item.icon;
                    
                    return (
                        <div key={item.label}>
                        {item.children
                            ? (
                            <div className="menu-item"
                                onClick={() => toggleMenu(item.label)}>
                                <Icon size={20} />
                                <span className="label">{item.label}</span>
                                <ChevronRight className={`arrow ${
                                    openMenus.includes(item.label) ? "rotate" : ""}`}
                                />
                            </div>
                            ) : (
                            <NavLink to={item.path!}
                                className={({ isActive}) => 
                                    isActive ? "menu-item active" : "menu-item" 
                                }
                            >
                                <Icon size={20} />
                                <span className="label">{item.label}</span>
                            </NavLink>
                            )}
                            {item.children && openMenus.includes(item.label) && (
                                <div className="submenu">
                                    {item.children.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            className={({ isActive }) =>
                                            isActive
                                                ? "submenu-item active"
                                                : "submenu-item"
                                            }
                                        >
                                            <span className="label">{sub.label}</span>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
            <div className="logo-container">
                <img 
                    src="/logo.png"
                    alt="logo"
                    className="logo"/> 
                <span className="logo-text">OLapp</span>
            </div> 
       </aside> 
    ); 
}

export default Sidebar; 