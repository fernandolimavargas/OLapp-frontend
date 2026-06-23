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
export async function inserirCliente(cliente: Cliente):Promise<boolean> { 
    try { 
        await api.post("/cliente/inserir_cliente", cliente); 
        return true;
    } catch (error) { 
        console.error("Erro ao inserir cliente", error); 
        return false; 
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