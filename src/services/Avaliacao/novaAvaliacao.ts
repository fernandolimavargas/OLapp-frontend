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

export async function buscarAvaliacoesModelo(): Promise<AvaliacaoModelo[]> { 
    try { 
        const response = await api.get("/avaliacao/buscar_campos_modelo_padrao"); 
        return response.data;
    } catch (error) { 
        console.log(error);
        return [];
    }
}