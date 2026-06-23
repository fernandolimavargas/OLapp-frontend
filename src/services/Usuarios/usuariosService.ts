import axios from "axios";
import { api } from "../api";

export interface UsuarioLista { 
    id: number; 
    usuarioNome: string; 
    nome: string;
    ativo: boolean; 
}

export interface Perfis { 
    id: number, 
    nome: string; 
}

export async function buscarUsuarios(): Promise<UsuarioLista[]> { 
    try { 
        const response = await api.get("/usuario/buscar_usuarios");
        return response.data;
    } catch (error) { 
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
}

export type Usuario = { 
    id: number;
    usuarioNome: string;
    nome: string;
    perfil: Perfis[];
    email: string;
    celular: string;
    senha: string;
    ativo: boolean;
}

export async function buscarUsuario(idUsuario: number): Promise<Usuario | null> { 
    try { 
        const response = await api.get(`/usuario/buscar_usuario/${idUsuario}`)
        return response.data; 
    } catch (error) { 
        console.error("Erro ao buscar usuario", error)
        return null;
    }
}

export type CriarUsuario = { 
    nome: string;
    usuarioNome: string;
    email: string;
    celular: string;
    tipo: number; 
    senha?: string;
}

export async function inserirUsuario(usuario: CriarUsuario): Promise<number> { 
    try { 
        usuario.senha = "olapp12345";
        const response = await api.post("/usuario/cadastrar_usuario", usuario); 
        return response.data;
        
    } catch (error) { 
        console.error("Erro ao inserir usuário", error)
        return 0;
    }
}

export async function alterarUsuario(idUsuario: number, usuario: CriarUsuario): Promise<boolean> { 
    try  {
        await api.post(`/usuario/alterar_usuario/${idUsuario}`, {idUsuario, usuario}); 
        return true; 
    } catch (error) { 
        console.error("Erro ao alterar usuário", error); 
        return false;
    }
}

export async function buscarPerfis(): Promise<Perfis[]> { 
    try {
        const response = await api.get(`/usuario/buscar_perfis`);
        return response.data;
    } catch (error) { 
        console.error("Erro ao buscar perfis", error);
        return [];
    }
}