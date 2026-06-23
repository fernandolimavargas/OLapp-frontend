import { Calendar, Dumbbell, FileText } from "lucide-react";
import "../../style/Dashboard/acessorapido.css"

export default function AcessoRapido() { 
    return (
        <div className="box-acesso-rapido">
            <div className="acessoRapido-header">
                <Calendar size={20}/>
                <span>Acesso Rápido</span>
            </div>

            <div className="items-list">
                <div className="item-acesso-rapido">
                    <FileText size={17}/>
                    <span>Nova Avaliação</span>
                    <span>Registrar avaliação física</span>
                </div>

                <div className="item-registro-treino">
                    <Dumbbell size={17}/>
                    <span>Registrar Treino</span>
                    <span>Adicionar sessão de treino</span>
                </div>

                <div className="item-analise-corporativa">
                    <span>Análise Comparativa</span>
                    <span>Ver evolução dos clientes</span>

                </div>
                
            </div>
        </div>
    );
}