import { Circle, Search, User } from "lucide-react";
import "../style/usuarios.css"
import { useEffect, useState } from "react";
import { buscarUsuario, buscarUsuarios, type UsuarioLista , type Usuario, inserirUsuario, alterarUsuario, type Perfis, buscarPerfis} from "../services/Usuarios/usuariosService";

export default function Usuarios() { 
    const[usuarios, setUsuarios] = useState<UsuarioLista[]>([]);
    const[loading, setLoading] = useState(true);
    const[usuarioEscolhido, setUsuarioEscolhido] = useState<Usuario | null>(null);
    const[abrirModal, setAbrirModal] = useState(false);

    const[idusuario, setIdUsuario] = useState(0);
    const[nome, setNome] = useState(""); 
    const[usuarioNome, setUsuarioNome] = useState("");
    const[email, setEmail] = useState("");
    const[celular, setCelular] = useState(""); 
    const[tipo, setTipo] = useState(0); 
    const[senha, setSenha] = useState(""); 
    const[perfisSelecionados, setPerfisSelecionados] = useState<number[]>([]); 

    const[busca, setBusca] = useState("");
    const usuarioFiltros = usuarios.filter((u) => 
        u.nome.toLowerCase().includes(busca.toLocaleLowerCase())); 

    const[editarMode, setEditarMode] = useState(false); 

    const[perfis, setPerfis] = useState<Perfis[]>([]);


    async function carregarUsuarios() { 
            setLoading(true)
            const data = await buscarUsuarios();
            setUsuarios(data);
            setLoading(false);
    }

    async function carregarPerfis() { 
        const data = await buscarPerfis(); 
        setPerfis(data);
    }

    async function carregarUsuario(idUsuario: number) { 
    setIdUsuario(0);

    const data = await buscarUsuario(idUsuario);

    if (data !== null) {  
        setUsuarioEscolhido(data);

        setPerfisSelecionados(
            data.perfil.map(p => p.id)
        );

        setIdUsuario(data.id);
    }
}

    async function handleSalvarUsuario() {

        const idUsuario = await inserirUsuario({
            nome,
            usuarioNome,
            email,
            celular,
            tipo
        });

        if (idUsuario > 0) {
            setAbrirModal(false);
            carregarUsuarios(); 
            carregarUsuario(idUsuario);
        }
    }

    async function handleAlterar() { 
        if (await alterarUsuario(idusuario, {nome,
            usuarioNome,
            email,
            celular,
            tipo,
            senha})) { 
            carregarUsuarios(); 
            carregarUsuario(idusuario);
            }
        setEditarMode(false);
    }
    function abrirModalNovoUsuario() { 
        setNome("");
        setUsuarioNome("");
        setEmail("");
        setCelular("");
        setPerfisSelecionados([]);

        setAbrirModal(true);
    }

    function formatarTelefone(valor: string) {
        // remove tudo que não é número
        valor = valor.replace(/\D/g, "");

        // limita a 11 dígitos (DDD + 9 dígitos)
        valor = valor.slice(0, 11);

        // aplica máscara
        valor = valor.replace(/^(\d{2})(\d)/, "($1)$2");
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

        return valor;
    }

    const togglePerfil = (idPerfil: number) => {
        setPerfisSelecionados((atual) =>
            atual.includes(idPerfil)
                ? atual.filter(id => id !== idPerfil)
                : [...atual, idPerfil]
        );
    };
    
    useEffect(() => { 
        carregarUsuarios();
        carregarPerfis();
    }, []);

    return ( 
        <div className="usuarios-page">
            <div className="usuarios-header">
                <h1>Usuários</h1>
                <p>Listagem de usuários</p>
            </div>    
            <div className="usuarios-content">
                <div className="usuarios-list">
                    <div className="usuarios-list-header">
                        <input placeholder="Buscar usuário..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)} />
                        <Search size={24} />
                    </div>
                    <div className="usuarios-list-items">
                        <div className="usuarios-header-row">
                            <span>ID</span>
                            <span>Usuário</span>
                            <span>Nome</span>
                            <span>Ativo</span>
                        </div>
                        <ul>
                            {usuarioFiltros.map((usuario) => (
                                <li key={usuario.id} 
                                    className="usuario-item" 
                                    onClick={() => carregarUsuario(usuario.id)}
                                >
                                    <span>{usuario.id}</span>
                                    <span>{usuario.usuarioNome}</span>
                                    <span>{usuario.nome}</span>
                                    <Circle
                                        size={12}
                                        color={usuario.ativo ? "green" : "red"}
                                        fill={usuario.ativo ? "green" : "red"}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="adicionar-novo">
                        <button className="btn-primary" onClick={abrirModalNovoUsuario}>Incluir</button>
                    </div>
                </div>

                <div className="usuarios-infos">
                    <div className="usuarios-infos-header">
                        <h2>Informações do Usuário</h2>
                        <div className="botoes-acao">
                            <button className="btn-primary"
                                onClick={() => setEditarMode(true)}>Editar</button>
                            <button
                                className="btn-primary salvar-edicao"
                                onClick={handleAlterar}
                                disabled={!editarMode} >Salvar</button>
                        </div>
                    </div>

                    <div className="usuarios-infos-body">

                        {/* Avatar + Nome */}
                        <div className="usuario-top">
                            <div className="avatar">
                                <User size={36} />
                            </div>

                            <div className="field field-nome">
                                <label>Nome</label>
                                <input type="text" value={usuarioEscolhido?.nome || ""}/>
                            </div>
                        </div>

                        {/* Username */}
                        <div className="field">
                            <label>Usuário</label>
                            <input type="text" value={usuarioEscolhido?.usuarioNome || ""} />
                        </div>

                        {/* Avatar + Nome */}
                       <div className="perfis-container">
                            {perfis.map((perfil) => (
                                <label
                                    key={perfil.id}
                                    className="perfil-item"
                                >
                                    <input
                                        type="checkbox"
                                        checked={perfisSelecionados.includes(perfil.id)}
                                        onChange={() => togglePerfil(perfil.id)}
                                    />

                                    <span>{perfil.nome}</span>
                                </label>
                            ))}
                        </div>

                        {/* Contato */}
                        <div className="field">
                            <label>Email</label>
                            <input type="email" value={usuarioEscolhido?.email || ""}/>
                        </div>

                        <div className="field">
                            <label>Celular</label>
                            <input type="tel" value={usuarioEscolhido?.celular || ""} />
                        </div>

                        {/* Senha */}
                        <div className="field">
                            <label>Senha</label>
                            <input type="password" value={usuarioEscolhido?.senha || ""} />
                        </div>

                    </div>
                </div>
            </div>
            {
                abrirModal && ( 
                    <div className="modal-overlay">
                        <div className="modal-content"> 
                            <h2>Novo Usuário</h2>

                            <input placeholder="Nome" 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}/>

                            <input placeholder="Usuário"
                                value={usuarioNome}
                                onChange={(e) => setUsuarioNome(e.target.value)} />

                            <div className="perfis-container">
                                {perfis.map((perfil) => (
                                    <label
                                        key={perfil.id}
                                        className={`perfil-item ${
                                            perfisSelecionados.includes(perfil.id)
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={perfisSelecionados.includes(perfil.id)}
                                            onChange={() => togglePerfil(perfil.id)}
                                        />

                                        {perfil.nome}
                                    </label>
                                ))}
                            </div>

                            <input placeholder="Email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}/>
                            <input placeholder="Celular" 
                                value={celular}
                                onChange={(e) => setCelular(formatarTelefone(e.target.value))}/>

                            <div className="modal-actions">
                                <button onClick={() => setAbrirModal(false)}>Cancelar</button>
                                <button className="btn-primary"
                                    onClick={handleSalvarUsuario}>Salvar</button>
                            </div>
                        </div>

                    </div> 
                )
            }
        </div>
    )
}