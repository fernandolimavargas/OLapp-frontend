import { useState, useEffect} from "react"
import "../../style/GestaoClientes/listaClientes.css"
import { atualizarCliente, buscarAluno, buscarAlunos, type Cliente, type Clientes, inserirCliente} from "@/services/ListaClientes/listaClienteService";

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
    const [cliente, setCliente] = useState<Cliente | null>(null);

    const[buscaNome, setBuscaNome] = useState(""); 

    const[clientes, setClientes] = useState<Clientes[]>([])

    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);

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
        setClientes(dados);
    }

    useEffect(() => {
        const usuarioStorage =
            localStorage.getItem("usuario");

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

    async function addCliente(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            const clienteRequest: Cliente = {
                id: cliente?.id,
                nome,
                dataNascimento,
                cpf,
                email,
                telefone,
                objetivo,
                idProfessor,
                nomeProfessor,
                idPerfil: [2]
            };

            if (cliente) {

                const sucesso = await atualizarCliente(clienteRequest);

                if (sucesso) {

                    await carregarClientes();

                    await carregarDadosCliente(cliente.id!);

                }

            } else {

                const idAluno = await inserirCliente(clienteRequest);

                if (idAluno > 0) {

                    await carregarClientes();

                    setIdSelecionado(idAluno);

                    await carregarDadosCliente(idAluno);

                }

            }

        }
        finally {

            setLoading(false);

        }
    }

    function limparCampos() {
    setCliente(null);
    setIdSelecionado(null);
    setNome("");
    setDataNascimento("");
    setCPF("");
    setEmail("");
    setTelefone("");
    setObjetivo("");
    setLoading(false);
}

    async function carregarDadosCliente(idAluno: number) {

        const dados = await buscarAluno(idProfessor, idAluno);

        if (!dados)
            return;

        setCliente(dados);

        setNome(dados.nome);
        setDataNascimento(
            dados.dataNascimento?.split("T")[0] ?? ""
        );
        setCPF(dados.cpf);
        setEmail(dados.email);
        setTelefone(dados.telefone);
        setObjetivo(dados.objetivo);
    }

    async function selecionarCliente(idAluno: number) {

        setIdSelecionado(idAluno);

        await carregarDadosCliente(idAluno);
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
                                <div
                                    key={c.id}
                                    className={`cliente-item ${
                                        idSelecionado === c.id ? "cliente-item-selecionado" : ""
                                    }`}
                                    onClick={() => selecionarCliente(c.id)}
                                >
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
                    <div className="form-header">
                        <div className="form-header-info">
                            <h2>
                                {cliente ? "Editar Cliente" : "Adicionar Novo Cliente"}
                            </h2>
                            {cliente && (
                                <span className="cliente-editando">
                                    Editando:
                                    <strong> {cliente.nome}</strong>
                                </span>
                            )}
                        </div>
                        {cliente && (
                            <button
                                type="button"
                                className="btn btn-secondary btn-novo"
                                onClick={limparCampos}
                            >
                                + Novo Cliente
                            </button>
                        )}
                    </div>
                    <form
                        className="form-cliente"
                        onSubmit={addCliente}
                    >
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

                        <button
                            type="submit"
                            className="form-cliente btn-primary"
                        >
                            {cliente ? "Salvar Alterações" : "Adicionar Cliente"}
                        </button>
                    </form>

                </div>

            </div>
            
        </div>
    )
}

export default ListaClientes;