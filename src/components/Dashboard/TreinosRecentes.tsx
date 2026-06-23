import { NavLink } from "react-router-dom";
import "../../style/Dashboard/treinoRecentes.css"
import { Activity } from "lucide-react";

export default function TreinosRecentes() { 
    const treinos = [ 
        {nome: "João da Silva Santos", data: "21 de janeiro", exercicios: 3, tempo: "90min"},
        {nome: "João da Silva Santos", data: "19 de janeiro", exercicios: 3, tempo: "85min"},
        {nome: "Maria Oliveira Costa", data: "20 de janeiro", exercicios: 3, tempo: "60min"},
        {nome: "Pedro Ferreira Lima",  data: "18 de janeiro", exercicios: 3, tempo: "100min"},
        {nome: "Ana Carolina Souza",   data: "17 de janeiro", exercicios: 3, tempo: "75min"}
    ]

    return (
        <div className="box-treinos-recentes">
            <div className="box-header">
                <h3 className="title">
                    <Activity size={16} color="#22C55E" />
                    Treinos Recentes
                </h3>
                <NavLink to={"/treinosPerformance"}>
                    <span style={{color: "white", }}>Ver todos</span>
                </NavLink>
            </div>

            <div className="box-list">
                {treinos.map((t,i) => (
                    <div className="item" key={i}>
                        <div className="item-left">
                            <p className="nome">{t.nome}</p>
                            <span className="data">{t.data}</span>
                        </div>
                        <div className="item-right"> 
                            <span className="badge">{t.exercicios} exercícios</span>
                            <span className="tempo">{t.tempo}</span>
                        </div>
                    </div>
                ))}
                

            </div>

        </div>
    );
}