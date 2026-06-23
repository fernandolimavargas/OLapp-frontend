import { FilePlus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
// Você pode criar ou importar o CSS correspondente depois se precisar de ajustes finos
import "../../style/AvaliacaoFisica/cadastrarAvaliacao.css"; 

export default function CriarNovoModelo() {
    const [nomeModelo, setNomeModelo] = useState("");
    const [idProfessor, setIdProfessor] = useState(0);
    
    const [camposNovos, setCamposNovos] = useState([
        { nome_campo: "", tipo_campo: "decimal" }
    ]);

    useEffect(() => {
        const usuarioStorage = localStorage.getItem("usuarioLogado");

        if (usuarioStorage) {
            const usuario = JSON.parse(usuarioStorage);
            setIdProfessor(usuario.id);
        } 
    }, []); 

    const adicionarNovoCampoNaTela = () => {
        setCamposNovos([...camposNovos, { nome_campo: "", tipo_campo: "decimal" }]);
    };

    const handleCampoChange = (index: number, propriedade: string, valor: string) => {
        const copiaCampos = [...camposNovos];
        copiaCampos[index] = { ...copiaCampos[index], [propriedade]: valor };
        setCamposNovos(copiaCampos);
    };

    const removerCampoDaTela = (indexParaRemover: number) => {
        // Evita que o professor delete o último campo restante na tela
        if (camposNovos.length === 1) return; 
        setCamposNovos(camposNovos.filter((_, index) => index !== indexParaRemover));
    };

    const salvarModeloNoBanco = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nomeModelo.trim()) {
            alert("Por favor, dê um nome para o tipo de avaliação.");
            return;
        }

        const payload = {
            id_professor_criador: idProfessor,
            nome_modelo: nomeModelo,
            campos: camposNovos.map((c, index) => ({
                nome_campo: c.nome_campo,
                tipo_campo: c.tipo_campo,
                ordem: index + 1
            }))
        };

        console.log("Enviando novo modelo para o C#:", payload);
    };

    return (
        <div className="avaliacao-fisica container py-4">
            {/* Cabeçalho no padrão da tela anterior */}
            <div className="mb-4">
                <h1 className="mb-1">Configurações de Avaliação</h1>
                <p className="text-muted">Monte um novo modelo customizado de avaliação para seus alunos</p>
            </div>

            {/* Card Principal - Dark Mode Style */}
            <div className="card p-4 shadow-sm bg-dark text-light border-0">
                
                <div className="avaliacao-header-row d-flex align-items-center gap-2 mb-4">
                    <FilePlus size={24} />
                    <h5 className="m-0">Estrutura do Novo Modelo</h5>
                </div>

                <form onSubmit={salvarModeloNoBanco}>
                    
                    {/* Input do Nome do Modelo */}
                    <div className="mb-4 cliente-group">
                        <label className="form-label">Nome da Avaliação</label>
                        <input
                            type="text"
                            className="input form-control"
                            placeholder="Ex: Protocolo de Dobras Pollock ou Testes de Força"
                            value={nomeModelo}
                            onChange={(e) => setNomeModelo(e.target.value)}
                        />
                    </div>

                    <hr className="border-secondary my-4" />

                    <div className="mb-3 d-flex align-items-center justify-content-between">
                        <h6 className="text-muted m-0">Campos e Variáveis desta Avaliação</h6>
                    </div>

                    {/* Loop de Campos Dinâmicos convertidos em Linhas Limpas */}
                    {camposNovos.map((campo, index) => (
                        <div key={index} className="row g-2 align-items-end mb-3 bg-secondary bg-opacity-10 p-3 rounded position-relative border border-secondary border-opacity-25">
                            
                            {/* Nome do Campo */}
                            <div className="col-md-7">
                                <label className="form-label text-muted small">Nome do Campo / Métrica</label>
                                <input
                                    type="text"
                                    className="input form-control"
                                    placeholder="Ex: Peitoral, Abdominal, Repetições Máximas..."
                                    value={campo.nome_campo}
                                    onChange={(e) => handleCampoChange(index, "nome_campo", e.target.value)}
                                />
                            </div>

                            {/* Tipo do Input */}
                            <div className="col-md-4">
                                <label className="form-label text-muted small">Tipo de Dado esperado</label>
                                <select
                                    className="input form-control text-light"
                                    value={campo.tipo_campo}
                                    onChange={(e) => handleCampoChange(index, "tipo_campo", e.target.value)}
                                >
                                    <option value="decimal">Decimal (ex: 12.50)</option>
                                    <option value="inteiro">Inteiro (ex: 45)</option>
                                    <option value="texto">Texto Livre</option>
                                    <option value="lista">Lista Postural (Normal / Alterações)</option>
                                </select>
                            </div>

                            {/* Ações / Lixeira */}
                            <div className="col-md-1 d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center border-0 p-2"
                                    title="Remover este campo"
                                    disabled={camposNovos.length === 1} // Não deixa apagar se só houver um
                                    onClick={() => removerCampoDaTela(index)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Container de Botões de Ação Inferiores */}
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4 pt-2">
                        <button
                            type="button"
                            className="btn btn-outline-light d-flex align-items-center gap-2"
                            onClick={adicionarNovoCampoNaTela}
                        >
                            <Plus size={18} /> Adicionar Métrica
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary salvar-avaliacao-btn"
                        >
                            Salvar Novo Modelo
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}