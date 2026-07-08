import { useEffect, useState } from "react";
import {Users, Plus, Dumbbell, FileText, ArrowDownUp } from "lucide-react"
import "../style/dashboard.css";
import TreinosRecentes from "../components/Dashboard/TreinosRecentes";
import AvaliacaoRecentes from "../components/Dashboard/AvaliaçãoRecentes";
import AcessoRapido from "../components/Dashboard/AcessoRapido";

export default function Dashboard() { 

    const[usuario, setUsuario] = useState<any>(null); 

    useEffect(() => { 
        const token = localStorage.getItem("token");
        const usuarioStorage = localStorage.getItem("usuario");

        if (token != null && usuarioStorage != null) {
                setUsuario(JSON.parse(usuarioStorage));
            }

        console.log(usuarioStorage); 
    }, []);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="dashboard-header-right">
                    <h1>Dashboard</h1>
                    <p>Visão geral da sua academia e evolução dos alunos</p>
                </div>
                <div className="dashboard-header-left">
                    <button className="btn-outline">
                        <Users size={16} />
                        Gerenciar Clientes
                    </button>

                    <button className="btn-primary">
                        <Plus size={16} />
                        Novo Treino
                    </button>
                </div>
            </div>

            <div className="cards">
                <div className="card card-clientes-ativos">
                    <div className="card-header">
                        <p>Clientes Ativos</p>
                        <Users size={16} color="#B0B8D9"/>
                    </div>

                    <div className="card-body">
                        <p className="quantidade">5</p>
                        <span className="percent">↗ 12%</span>
                    </div>

                    <p className="descricao">Total de alunos cadastrados</p>
                </div>

                <div className="card card-treino-semana">
                    <div className="card-header">
                        <p>Treinos esta semana</p>
                        <Dumbbell height={16} color="#B0B8D9"/>
                        
                    </div>
                    <div className="card-body">
                        <p className="quantidade">0</p>
                        <span className="percent">↗ 12%</span>
                    </div>
                    <p className="descricao">Sessões realizadas</p>
                </div>

                <div className="card card-avaliacao-mes">
                    <div className="card-header">
                        <p>Avaliação este mês</p>
                        <FileText height={16} color="#B0B8D9"/>
                    </div>
                    <div className="card-body">
                        <p className="quantidade">0</p>
                        <span className="percent">↗ 12%</span>
                    </div>
                    <p className="descricao">Novas avaliações</p>
                </div>

                <div className="card card-taxa-evolucao">
                    <div className="card-header">
                        <p>Clientes Ativos</p>
                        <ArrowDownUp height={16} color="#B0B8D9"/>
                    </div>
                    <div className="card-body">
                        <p className="quantidade">87%</p>
                        <span className="percent">↗ 12%</span>
                    </div>
                    <p className="descricao">Clientes com progresso</p>
                </div>
            </div>
            <div className="body">
                <TreinosRecentes /> 
                <AvaliacaoRecentes />
            </div>
            <div className="acessoRapido">
                <AcessoRapido />
            </div>
        </div>
    ); 
} 