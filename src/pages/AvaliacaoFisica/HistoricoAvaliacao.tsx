import { useEffect, useMemo, useState } from "react";
import { buscarHistoricoAluno, BuscarClientes, type Clientes } from "@/services/Avaliacao/historicoAvaliacao";
import { Scale, Ruler, TrendingUp, Calendar } from "lucide-react"; // Ícones para o Dashboard
import "../../style/AvaliacaoFisica/historicoAvaliacao.css"; 

export default function HistoricoAvaliacao() {
    const [clientes, setClientes] = useState<Clientes[]>([]);
    const [idAluno, setIdAluno] = useState<number>(0);
    const [historico, setHistorico] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // 1. Carrega a lista de clientes para o Select ao montar a tela
    useEffect(() => {
        async function carregarClientes() {
            const usuarioStorage = localStorage.getItem("usuarioLogado");
            if (usuarioStorage) {
                const usuario = JSON.parse(usuarioStorage);
                const dados = await BuscarClientes(usuario.id);
                setClientes(dados);
            }
        }
        carregarClientes();
    }, []);

    // 2. Dispara a busca do histórico AUTOMATICAMENTE toda vez que o idAluno mudar
    useEffect(() => {
        if (idAluno > 0) {
            carregarHistorico();
        } else {
            setHistorico(null);
        }
    }, [idAluno]);

    async function carregarHistorico() {
        try {
            setLoading(true);
            const resultado = await buscarHistoricoAluno(idAluno);
            setHistorico(resultado);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Descobre dinamicamente todas as categorias (Modelos) presentes no histórico do aluno
    const todasCategorias = useMemo(() => {
        if (!historico?.avaliacoes) return [];
        const categorias = historico.avaliacoes.flatMap((a: any) => 
            a.campos.map((c: any) => c.categoria)
        );
        return Array.from(new Set(categorias)) as string[];
    }, [historico]);

    return (
        <div className="avaliacao-fisica container py-4 text-light">
            <div className="mb-4">
                <h2>Histórico de Avaliações</h2>
                <p className="text-muted">Acompanhe a evolução completa do aluno</p>
            </div>

            {/* SELECT PARA ESCOLHER O ALUNO */}
            <div className="card p-4 bg-dark border-0 shadow-sm mb-4">
                <div className="mb-3">
                    <label className="form-label text-muted">Selecione o Aluno para analisar</label>
                    <select 
                        className="input form-control text-light" 
                        value={idAluno}
                        onChange={(e) => setIdAluno(parseInt(e.target.value))}
                    >
                        <option value={0}>Selecione um aluno...</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && <div className="text-center py-5">Carregando histórico...</div>}

            {historico && !loading && (
                <>
                    {/* DASHBOARD DINÂMICO */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-3">
                            <div className="card p-3 bg-dark border-0 shadow-sm text-center">
                                <p className="text-muted small mb-1">Total de Avaliações</p>
                                <strong className="fs-3 text-primary">{historico?.avaliacoes?.length ?? 0}</strong>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 bg-dark border-0 shadow-sm text-center">
                                <p className="text-muted small mb-1">Primeira Avaliação</p>
                                <strong className="fs-5">{historico?.avaliacoes?.[historico.avaliacoes.length - 1]?.dataAvaliacao ?? '--'}</strong>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 bg-dark border-0 shadow-sm text-center">
                                <p className="text-muted small mb-1">Última Avaliação</p>
                                <strong className="fs-5 text-success">{historico?.avaliacoes?.[0]?.dataAvaliacao ?? '--'}</strong>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 bg-dark border-0 shadow-sm text-center">
                                <p className="text-muted small mb-1">Último Peso Registrado</p>
                                <strong className="fs-5 text-warning">{historico?.avaliacoes?.[0]?.pesoAtual ?? '--'} kg</strong>
                            </div>
                        </div>
                    </div>

                    {/* LINHA DO TEMPO */}
                    <div className="timeline-container">
                        <h4 className="mb-4 text-muted">Linha do Tempo de Evolução</h4>

                        {historico.avaliacoes.map((avaliacao: any) => (
                            <div key={avaliacao.idAvaliacaoReal} className="card p-4 bg-dark border border-secondary border-opacity-25 mb-4 shadow-sm">
                                
                                <div className="d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25 pb-3 mb-3">
                                    <div>
                                        <h5 className="m-0 text-primary d-flex align-items-center gap-2">
                                            <Calendar size={18}/> {avaliacao.dataAvaliacao}
                                        </h5>
                                        <span className="text-muted small">Aplicado por: {avaliacao.professor}</span>
                                    </div>
                                    <div className="d-flex gap-4">
                                        <span className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 px-3 py-1 rounded fs-6">
                                            <Scale size={16} className="text-warning"/> {avaliacao.pesoAtual} kg
                                        </span>
                                        <span className="d-flex align-items-center gap-2 bg-secondary bg-opacity-25 px-3 py-1 rounded fs-6">
                                            <Ruler size={16} className="text-info"/> {avaliacao.alturaAtual} cm
                                        </span>
                                    </div>
                                </div>

                                {/* LISTAR APENAS AS CATEGORIAS QUE FORAM PREENCHIDAS NESSA AVALIAÇÃO */}
                                {todasCategorias.map(categoria => {
                                    const camposDessaCategoria = avaliacao.campos.filter((c: any) => c.categoria === categoria);
                                    if (camposDessaCategoria.length === 0) return null; // Oculta abas que o prof não preencheu nesse dia

                                    return (
                                        <div key={categoria} className="mb-4">
                                            <h6 className="text-muted mb-2 border-start border-primary border-3 ps-2">{categoria}</h6>
                                            <div className="row g-2">
                                                {camposDessaCategoria.map((campo: any) => (
                                                    <div key={campo.idCampo} className="col-md-4">
                                                        <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-25 rounded p-2">
                                                            <span className="text-muted d-block small">{campo.nomeCampo}</span>
                                                            <strong className="text-light">{campo.valor}</strong>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}