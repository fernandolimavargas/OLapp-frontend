import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import "../../style/AvaliacaoFisica/cadastrarAvaliacao.css";
import { Tabs, Tab } from '@mui/material';
import { buscarAvaliacoesModelo, BuscarClientes , type AvaliacaoModelo, type CampoAvaliacao, type Clientes} from "@/services/Avaliacao/novaAvaliacao";

export default function CadastrarAvaliacao() {
    const [clientes, setClientes] = useState<Clientes[]>([]);
    const [clienteSelecionado, setClienteSelecionar] = useState<number>(0); 

    const [peso, setPeso] = useState<string>("");
    const [altura, setAltura] = useState<string>("");

    const [modelosPadrao, setModelosPadrao] = useState<AvaliacaoModelo[]>([]);
    const [modelosPersonalizados, setModelosPersonalizados] = useState<AvaliacaoModelo[]>([]);
    const [valoresCampos, setValoresCampos] = useState<Record<number, string>>({});


    const [tabSelecionada, setTabSelecionada] = useState<number>(1);
    
    const [idProfessor, setIdProfessor] = useState(0); 

    const avaliacoesModelos = [
        ...modelosPadrao,
        ...modelosPersonalizados
    ];

    useEffect(() => {
        const usuarioStorage = localStorage.getItem("usuario");

        if (usuarioStorage) {
            const usuario = JSON.parse(usuarioStorage);

            setIdProfessor(usuario.id);

            buscarClientes(usuario.id); 

            buscarCamposDoModelo(usuario.id);
        }
    }, []);

    async function buscarClientes(idProfessorAtual: number) {
        const dados = await BuscarClientes(idProfessorAtual);
        setClientes(dados); 
    }

    async function buscarCamposDoModelo(idProfessorAtual: number) {
        const resposta = await buscarAvaliacoesModelo(idProfessorAtual);

        setModelosPadrao(resposta.padroes);
        setModelosPersonalizados(resposta.personalizados);

        const modelos = [
            ...resposta.padroes,
            ...resposta.personalizados
        ];

        if (modelos.length > 0) {
            setTabSelecionada(modelos[0].idAvaliacao);
        }

        const valoresIniciais: Record<number, string> = {};

        modelos.forEach(modelo => {
            modelo.campos.forEach(campo => {
                if (campo.tipo === "lista") {
                    valoresIniciais[campo.idCampo] = "Normal";
                }
            });
        });

        setValoresCampos(valoresIniciais);
    }

    const handleCampoChange = (idCampo: number, valor: string) => {
        setValoresCampos(prev => ({ ...prev, [idCampo]: valor }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Filtra quais modelos receberam alguma resposta
        const modelosPreenchidos = avaliacoesModelos.filter(modelo => 
            modelo.campos.some(c => valoresCampos[c.idCampo] !== undefined && valoresCampos[c.idCampo] !== "")
        );

        // Estrutura limpa montada para enviar ao backend via POST
        const payloadEnvio = {
            id_cliente: clienteSelecionado,
            id_professor: idProfessor,
            peso_atual: parseFloat(peso),
            altura_atual: parseFloat(altura),
            avaliacoes: modelosPreenchidos.map(modelo => ({
                id_modelo: modelo.idAvaliacao,
                resultados: modelo.campos
                    .filter(c => valoresCampos[c.idCampo])
                    .map(c => ({
                        id_campo: c.idCampo,
                        valor: valoresCampos[c.idCampo]
                    }))
            }))
        };

        console.log("Pronto para o backend C#:", payloadEnvio);
    };

    const modeloAtivo = avaliacoesModelos.find(m => m.idAvaliacao === tabSelecionada);

    return (
        <div className="avaliacao-fisica container py-4">

            <div className="mb-4">
                <h1 className="mb-1">Avaliação Física</h1>
                <p className="text-muted">Cadastrar nova avaliação do cliente</p>
            </div>

            <div className="card p-4 shadow-sm bg-dark text-light border-0">

                <div className="avaliacao-header-row d-flex align-items-center gap-2 mb-4">
                    <FileText size={24} />
                    <h5 className="m-0">Dados da Avaliação</h5>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3 cliente-group">
                        <label className="form-label">Cliente</label>
                        <select className="input" aria-label="Default select example">
                            <option value={0}>Selecione um cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="row mb-3 peso-altura-row">
                        <div className="col-md-6 peso-group">
                            <label className="form-label">Peso (kg)</label>
                            <input
                                type="number"
                                step="any"
                                className="input peso-altura-input"
                                placeholder="Ex: 70.5"
                                value={peso}
                                onChange={(e) => setPeso(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 altura-group">
                            <label className="form-label">Altura (cm)</label>
                            <input
                                type="number"
                                className="form-control input peso-altura-input"
                                placeholder="Ex: 175"
                                value={altura}
                                onChange={(e) => setAltura(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-4 tipo-avaliacao">
                        <label className="form-label avaliacao-label">
                            Tipo de Avaliação
                        </label>

                        <Tabs
                            value={tabSelecionada}
                            onChange={(_, novoIdAvaliacao) => setTabSelecionada(novoIdAvaliacao)}
                            variant="scrollable"
                            scrollButtons="auto"
                            className="avaliacao-tabs"
                        >
                            {avaliacoesModelos.map((modelo) => (
                                <Tab key={modelo.idAvaliacao} 
                                value={modelo.idAvaliacao} 
                                label={modelo.padrao ? modelo.nomeAvaliacao : `⭐ ${modelo.nomeAvaliacao}`} />
                            ))}
                        </Tabs>

                        <div className="avaliacao-tab-content mt-4">
                            <div className="row">
                                {modeloAtivo && modeloAtivo.campos.map((campo, index) => (
                                    <div key={`${tabSelecionada}-${campo.idCampo}-${index}`} className="col-md-4 mb-3">
                                        <label className="form-label">{campo.nomeCampo}</label>
                                        
                                        {campo.tipo === 'lista' ? (
                                            <select 
                                                className="input form-control"
                                                value={valoresCampos[campo.idCampo] || "Normal"}
                                                onChange={(e) => handleCampoChange(campo.idCampo, e.target.value)}
                                            >
                                                <option value="Normal">Normal</option>
                                                <option value="Leve Alteração">Leve Alteração</option>
                                                <option value="Moderada Alteração">Moderada Alteração</option>
                                                <option value="Severa Alteração">Severa Alteração</option>
                                            </select>
                                        ) : (
                                            <input 
                                                type={campo.tipo === 'texto' ? 'text' : 'number'}
                                                step="any"
                                                className="input form-control"
                                                value={valoresCampos[campo.idCampo] || ""}
                                                onChange={(e) => handleCampoChange(campo.idCampo, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary salvar-avaliacao-btn">
                        Salvar Avaliação
                    </button>

                </form>
            </div>
        </div>
    );
}