
import { api } from "../api";

export interface Clientes {
    id: number;
    nome: string;
}

export interface CampoHistorico {
    idCampo: number;
    nomeCampo: string;
    categoria: string;
    valor: string;
}

export interface AvaliacaoHistorico {
    idAvaliacaoReal: number;
    dataAvaliacao: string;
    professor: string;
    pesoAtual: number;
    alturaAtual: number;
    observacao?: string;
    campos: CampoHistorico[];
}

export interface HistoricoAlunoResponse {
    alunoNome: string;
    avaliacoes: AvaliacaoHistorico[];
}

export async function BuscarClientes(idProfessor: number): Promise<Clientes[]> {
    try {
        const response = await api.get<Clientes[]>(`/Avaliacao/clientes-por-professor/${idProfessor}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar clientes para o histórico:", error);
        return []; 
    }
}


export async function buscarHistoricoAluno(idCliente: number): Promise<HistoricoAlunoResponse | null> {
    try {
        const response = await api.get<HistoricoAlunoResponse>(`/Avaliacao/historico/${idCliente}`);
        return response.data;
    } catch (error: any) {
        // Tratamento caso o aluno não tenha nenhuma avaliação cadastrada (404 Not Found)
        if (error.response?.status === 404) {
            return { alunoNome: "", avaliacoes: [] };
        }
        
        console.error(`Erro ao buscar histórico do aluno ${idCliente}:`, error);
        throw error; 
    }
}