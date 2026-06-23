import { Target } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../../style/Dashboard/avaliacaoRecentes.css"

export default function AvaliacaoRecentes() { 
    const avaliacoes = [
        {nome: "João Silva Santos", data: "21 de janeiro", peso: "75.5", imc: "24.7"},
        {nome: "João Silva Santos", data: "14 de janeiro", peso: "76.2", imc: "24.9"},
        {nome: "Maria Oliveira Costa", data: "19 de janeiro", peso: "62.3", imc: "22.9"}
    ]

    return ( 
        <div className="box-avaliacoes-recentes">
            <div className="box-header">
                <h3 className="title">
                    <Target height={16} color="#F97316"/>
                    Avaliação Recentes
                </h3>
                <NavLink to={"/treinosPerformance"}>
                    <span style={{color: "white", }}>Ver todos</span>
                </NavLink>
            </div>

            <div className="box-list-avaliacao">
                {avaliacoes.map((a, i) => (
                    <div className="item-avaliacao" key={i}>
                        <div className="item-avaliacao-left">
                            <p className="nome">{a.nome}</p>
                            <span className="data">{a.data}</span>
                        </div> 
                        <div className="item-avaliacao-right">
                            <span className="peso">{a.peso}kg</span>
                            <span className="imc">IMC: {a.imc}</span>
                        </div>

                    </div>
                ))}
            </div>
            
        </div>
    )
}