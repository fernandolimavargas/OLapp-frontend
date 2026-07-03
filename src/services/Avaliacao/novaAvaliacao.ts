import { api } from "../api"

export interface Clientes { 
    id: number, 
    nome: string 
}

export async function BuscarClientes(idProfessor: number):Promise<Clientes[]> { 
    try {
    const response = await api.get(`/avaliacao/buscar_alunos_avaliacao/${idProfessor}`);
    return response.data;
    } catch (error) { 
        console.log(error);
        return []
    }
}

export interface AvaliacaoModelo { 
    idAvaliacao : number, 
    nomeAvaliacao : string, 
    padrao: boolean, 
    campos : CampoAvaliacao[]

}

export interface CampoAvaliacao {
    idCampo: number;
    nomeCampo: string;
    tipo: 'decimal' | 'inteiro' | 'texto' | 'lista';
    ordem: number;
}

export interface ModelosAvaliacaoResponse {
    padroes: AvaliacaoModelo[];
    personalizados: AvaliacaoModelo[];
}

export async function buscarAvaliacoesModelo(idUsuario : number): Promise<ModelosAvaliacaoResponse> { 
    try { 
        const response = await api.get(`/avaliacao/buscar_campos_modelo_padrao/${idUsuario}`); 
        return response.data;
    } catch (error) { 
        console.log(error);
        return { padroes: [], personalizados: [] };
    }
}