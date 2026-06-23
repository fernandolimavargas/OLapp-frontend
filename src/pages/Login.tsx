import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/login.css"

export default function Login() { 
    const[nome, setNome]=  useState("");
    const[usuario, setUsuario] = useState("");
    const[tipoUsuario, setTipoUsuario] = useState<"aluno" | "professor">("aluno");
    const[email, setEmail] = useState("");
    const[senha, setSenha] = useState("");
    const[confirmacaoSenha, setConfirmacaoSenha] = useState("");
    const[celular, setCelular] = useState("");
    
    const[modo, setModo] = useState<"login" | "cadastro">("login");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        try {
            console.log("entrou no try")
            const usuarioLogado = await login(usuario, senha); 

            if (usuarioLogado.id == 0) { 
                alert("Usuário/Senha incorreto ou usuário não existe");
                return; 
            }

            localStorage.setItem(
                "usuarioLogado", 
                JSON.stringify(usuarioLogado)
            )

            navigate("/dashboard");
        } catch (error) {
            alert("ERRO COMPLETO: " + error);
        }
    };

    const handleCadastrar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        try { 
            if (senha === confirmacaoSenha) {
                await login(usuario, senha);
                navigate("/dashboard");
            } else {
                alert("As senhas não conferem");
            }
        } catch (error) {
            alert("Erro ao cadastrar");
        }
    }; 

    return (
        <div className="login-container">
            <div className="logo-card">
                <h1>OLapp</h1>
                <p>Monitoramento de Carga</p>
            </div>    

            <div className="login-card">
                <h2>Acesso ao Sistema</h2>
                <p className="subtitle">
                    Entre com sua conta ou crie uma nova para começar
                </p>

                <div className="tabs">
                    <div className={`tab-slider ${modo === "cadastro" ? "right" : ""}`}></div>

                    <button className={modo === "login" ? "active" : ""}
                        onClick={() => setModo("login")}
                    >Entrar</button>
                    <button className={modo === "cadastro" ? "active" : ""}
                        onClick={() => setModo("cadastro")}>Criar Conta</button>
                </div>

                <form onSubmit={modo === "login" 
                    ? handleLogin : handleCadastrar}> 
                    {modo === "login" &&(
                    <>
                        <input type="text"
                            placeholder="Usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}/>

                        <input type="password"
                            placeholder="Senha"
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)}/>

                        <br></br> 
                    </>)} 

                    {modo === "cadastro" && (
                        <>
                            <input type="text" 
                                placeholder="Nome Completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}/>
                            <input type="text"
                                placeholder="Usuário"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}/>
                            <input type="text" 
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                            <input type="text"
                                placeholder="Celular"
                                value={celular}
                                onChange={(e) => setCelular(e.target.value)}/>
                            <input type="password"
                                placeholder="Senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}/>
                            <input type="password"
                                placeholder="Confirmação de Senha"
                                value={confirmacaoSenha}
                                onChange={(e) => setConfirmacaoSenha(e.target.value)}/>
                        </>
                    )}

                    <button type="submit" 
                        className="btn-login"> 
                    {modo == "login" ? "Entrar" : "Cadatrar"} 
                    </button> 
                </form>
            </div>
        </div>
    );
}