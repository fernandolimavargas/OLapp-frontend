import { api } from "../api";

export interface MenusPersonalizados {
    id: number;           // 👈 Minúsculo
    nomeModelo: string;   // 👈 Minúsculo
    idCriador: number;    // 👈 Minúsculo
    campos: CamposMenuPersonalizado[]; // 👈 Minúsculo
}

export interface CamposMenuPersonalizado {
    idCampo: number;      // 👈 Minúsculo
    campo: string;        // 👈 Minúsculo
    tipo: string;         // 👈 Minúsculo
    obrigatorio: boolean; // 👈 Minúsculo
    ordem: number;        
}


export async function buscarAvaliacoesPersonalizadas(idUsuario:number): Promise<MenusPersonalizados[]> { 
    try {
        const resposta = await api.get(`/MenuPersonalizado/BuscarMenusPersonalizados/${idUsuario}`);
        return resposta.data;
    } catch (error) { 
        console.log(error)
        return [] 
    }
}

export async function inserirAvaliacoesPersonalizadas(menus: MenusPersonalizados) { 
    try { 
        await api.post("/MenuPersonalizado/InserirMenuPersonalizado", menus)
    } catch (error) { 
        console.log(error)
    }
}

export async function excluirAvaliacoesPersonalizadas(idMenu: number) {
    try { 
        console.log(`Excluindo menu personalizado com ID: ${idMenu}`);
        await api.delete(`/MenuPersonalizado/ExcluirMenuPersonalizado/${idMenu}`)
    } catch (error) { 
        console.log(error)
    }
}

export async function atualizarAvaliacoesPersonalizadas(menus: MenusPersonalizados) {
    try { 
        await api.post("/MenuPersonalizado/AtualizarMenuPersonalizado", menus)
    } catch (error) { 
        console.log(error)
    }
}