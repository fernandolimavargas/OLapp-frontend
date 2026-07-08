import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

type Usuario = { 
    id: number;
    nome: string; 
    usuarioNome: string; 
}

type AuthUsuario = { 
  id: number, 
  nome: string, 
  perfis: Perfis[]
}; 

type Token = { 
  token: string, 
  usuario: AuthUsuario
}

type Perfis = { 
  id: number, 
  nome: string
}

type AuthContextType = {
    usuario: Usuario | null; 
    login: (usuario: string, senha: string) => Promise<Token>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const storage = localStorage.getItem("usuario");
    return storage ? JSON.parse(storage) : null;
  });

  async function login(usuario: string, senha: string) {
    try {
      console.log("Entrou na função login")
      const result = await api.post("/auth/login", null, { params: { usuario, senha}});

      console.log("Chamou")

      return result.data;

    } catch (error: any) {
        console.log("deu erro")
        console.error(error);

        if (error.response?.status === 401) {
          throw new Error("[Frontend] Usuário ou senha inválidos");
        }

        throw new Error("[Frontend] Erro ao fazer login");
    }
  }

  function logout() { 
    setUsuario(null);
    localStorage.removeItem("usuario");
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
    return useContext(AuthContext);
}