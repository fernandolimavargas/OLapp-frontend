import { useState, useEffect} from "react"
import "../../style/GestaoClientes/listaClientes.css"
import { buscarAlunos, type Cliente, type Clientes, inserirCliente} from "@/services/ListaClientes/listaClienteService";

function ListaClientes() {
    const [loading, setLoading] = useState(true); 
    const[nome, setNome] = useState(""); 
    const[dataNascimento, setDataNascimento] = useState(""); 
    const[cpf, setCPF] = useState(""); 
    const[email, setEmail] = useState(""); 
    const[telefone, setTelefone] = useState("");
    const[objetivo, setObjetivo] = useState(""); 
    const[idProfessor, setIdProfessor] = useState(0); 
    const[nomeProfessor, setNomeProfessor] = useState("");
    const[cliente, setCliente] = useState<Cliente>(); 

    const[buscaNome, setBuscaNome] = useState(""); 

    const[clientes, setClientes] = useState<Clientes[]>([])

    function formatarCPF(valor: string) {
        return valor
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function formatarTelefone(valor: string) {
        valor = valor.replace(/\D/g, "");

        valor = valor.replace(
            /^(\d{2})(\d)/,
            "($1)$2"
        );

        valor = valor.replace(
            /(\d{5})(\d)/,
            "$1-$2"
        );

        return valor;
    }

    async function carregarClientes() { 
        const dados = await buscarAlunos(idProfessor, buscaNome);
        if (dados.length > 0)
            setClientes(dados); 
    } 

    useEffect(() => {
        const usuarioStorage =
            localStorage.getItem("usuarioLogado");

        if (usuarioStorage) {
            const usuario = JSON.parse(usuarioStorage);

            setIdProfessor(usuario.id);
            setNomeProfessor(usuario.nome);
        }
    }, []);

    useEffect(() => { 
    
      if (idProfessor > 0) {
        carregarClientes();
        }

    }, [idProfessor, buscaNome]);

    async function addCliente (
        e:React.FormEvent<HTMLFormElement>
    )  {
        e.preventDefault(); 
        
        setLoading(true)

        const cliente: Cliente = { 
            nome,
            dataNascimento, 
            cpf, 
            email,
            telefone,
            objetivo, 
            idProfessor,
            nomeProfessor,
            idPerfil: [2]
        }
        const data = await inserirCliente(cliente); 
        if (data) { 
            setLoading(false);
            limparCampos();
            carregarClientes()
        }
    }

    function limparCampos() { 
        setNome(""); 
        setDataNascimento(""); 
        setCPF(""),
        setEmail(""), 
        setTelefone(""), 
        setObjetivo("")
    }

    return (
        <div className="lista-clientes">
            <div className="lista-clientes-header">
                <h1>Gestão de Clientes</h1>
                <p>Cadastre e gerencia seus clientes</p>
            </div>

            <div className="lista-clientes-body">
                <div className="listagem-clientes card">
                    <div className="listagem-clientes-header">
                        <h2>Lista de Clientes</h2>
                        <input placeholder="Buscar Cliente..."/>
                    </div>

                    <div className="lista-clientes-items">
                        <h3>Clientes</h3>
                        <div className="items-clientes">
                            {clientes.map((c) => (
                                <div key={c.id} className="cliente-item">
                                    <div className="cliente-avatar"> 
                                        {c.nome.charAt(0)}
                                    </div>

                                    <div className="cliente-info">
                                        <strong>{c.nome}</strong>
                                        <span>{c.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="adicionar-cliente card">
                    <h2>Adicionar Novo Cliente</h2>
                    <form className="form-cliente"
                        onSubmit={addCliente}>
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input className="input" 
                            type="text"
                            placeholder="Digite o nome" 
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}/>
                        </div>

                        <div className="form-group">
                            <label>Data de Nascimento</label>
                            <input className="input" 
                            type="date" 
                            placeholder="Selecione a data "
                            value={dataNascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}/>
                        </div>

                        <div className="form-group">
                            <label>CPF</label>
                            <input className="input"
                            type="text" 
                            placeholder="000.000.000-00" 
                            value={cpf}
                            onChange={(e) =>
                            setCPF(formatarCPF(e.target.value))}
                            maxLength={14}
                        />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input className="input" 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label>Numero de Telefone</label>
                            <input className="input" 
                            type="phone" 
                            placeholder="(51) 00000-0000" 
                            value={telefone}
                            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}/>
                        </div>

                        <div className="form-group">
                            <label>Objetivo do treinamento</label>
                            <textarea className="input input-lg"
                            placeholder="Descreva os objetivos do cliente (ex: perda de peso, ganho de massa muscular, condicionamento físico...)" 
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}/>

                        </div>

                        <button type="submit" 
                            className="form-cliente btn-primary"
                            >Adicionar Cliente</button>
                    </form>

                </div>

            </div>
            
        </div>
    )
}

export default ListaClientes;