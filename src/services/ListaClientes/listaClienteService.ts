import axios from "axios";
import { api } from "../api";
import type { Perfis } from "../Usuarios/usuariosService";

export interface Cliente { 
    id?: number,
    nome: string,
    dataNascimento: string, 
    cpf: string, 
    email: string, 
    telefone: string, 
    objetivo: string, 
    idProfessor?: number, 
    nomeProfessor: string,
    idPerfil: number[]
}

export interface Clientes { 
    id : number, 
    nome: string
    email: string
}
export async function inserirCliente(cliente: Cliente):Promise<number> { 
    try { 
        const respostas = await api.post("/cliente/inserir_cliente", cliente); 
        return respostas.data;
    } catch (error) { 
        console.error("Erro ao inserir cliente", error); 
        return 0; 
    }
} 

export async function buscarAlunos(idProfessor: number, nome? : string): Promise<Clientes[]>{ 
    try {  
        const response = await api.get(`/cliente/buscar_clientes/${idProfessor}`) 
        return response.data; 
    } catch (error) { 
        console.error("Erro ao buscar cliente", error);
        return []; 
    }
}

export async function buscarAluno(idProfessor: number, idAluno: number): Promise<Cliente | null> { 
    try { 
        const response = await api.get<Cliente>("/cliente/buscar_cliente", {params: { 
                idProfessor, 
                idAluno 
            }}); 
        return response.data; 
    } catch (error) { 
        console.error(error);
        return null;
    }
}

export async function atualizarCliente(cliente: Cliente): Promise<boolean> {
    try { 
        await api.post("/cliente/atualizar_cliente", cliente); 
        return true; 
    } catch (error) { 
        console.error("Erro ao atualizar cliente", error); 
        return false; 
    }
}