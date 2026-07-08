import { LogOut, Menu, Settings, User } from "lucide-react";
import "../style/topbar.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = { 
    isAdmin: boolean; 
    toggleSideBar: () => void;
}

export default function TopBar({ toggleSideBar, isAdmin }: Props) {
    const[isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    function toggleMenu() { 
        setIsMenuOpen(!isMenuOpen);
    }

    function goPerfil() {
        navigate("/perfil");
        setIsMenuOpen(false);
    }

    function goConfiguracoes() {
        navigate("/configuracoes");
        setIsMenuOpen(false);
    }

    function goGerenciarUsuarios() {
        navigate("/usuarios");
        setIsMenuOpen(false);
    }

    function goSair() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/");
    }

    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="header-btn" onClick={toggleSideBar}>
                    <Menu className="icon-menu" />
                </button>
                <span className="logo-menu">OLapp</span>
            </div>

            <div className="topbar-right">
                <button className="icon-btn" onClick={toggleMenu}>
                    <Settings size={18} />
                </button>
            </div>

            {isMenuOpen && ( 
                <>
                    <div className="dropdown-menu">
                        <button className="dropdown-item"
                            onClick={goPerfil}> 
                            <User size={16} /> 
                            Perfil
                        </button>

                        <button className="dropdown-item"
                            onClick={goConfiguracoes}>
                            <Settings size={16} />
                            Configurações
                        </button> 
                        
                        {//isAdmin && 
                        (
                            <button className="dropdown-item"
                                onClick={goGerenciarUsuarios}>
                                <User size={16} />
                                Gerenciar Usuários
                            </button>
                        )}

                        <button className="dropdown-item"
                            onClick={goSair}>
                            <LogOut size={16} /> 
                            Sair
                        </button>
                    </div>
                </>
            )}
        </header>
    );
}