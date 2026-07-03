import "../../style/AvaliacaoFisica/novoMenuAvaliacao.css";
import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  ClipboardList,
  Folder,
} from "lucide-react";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  buscarAvaliacoesPersonalizadas,
  type MenusPersonalizados,
  inserirAvaliacoesPersonalizadas,
  excluirAvaliacoesPersonalizadas,
  atualizarAvaliacoesPersonalizadas,
  CamposMenuPersonalizado,
} from "@/services/Avaliacao/novoMenuAvaliacao";

// Correção dos imports do Dialog (Tudo centralizado no shadcn)


// Correção do Input (Usando o do seu projeto/shadcn em vez do Material UI)
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TIPO_CAMPO_LABELS = {
  decimal: "Decimal (ex: 12.50)",
  inteiro: "Inteiro (ex: 45)",
  texto: "Texto Livre",
  lista: "Lista Postural (Normal / Alterações)",
};

export default function CriarNovoModelo() {
  const [idProfessor, setIdProfessor] = useState(0);
  const [menusPersonalizados, setMenusPersonalizados] = useState<MenusPersonalizados[]>([]);
  const [ready, setReady] = useState(false);
  const [busca, setBusca] = useState("");
  
  const [open, setOpen] = useState(false);
  const [nomeModelo, setNomeModelo] = useState("");
  const [camposNovos, setCamposNovos] = useState<CamposMenuPersonalizado[]>([
    {
        idCampo: 0,
        campo: "",
        tipo: "decimal",
        obrigatorio: false,
        ordem: 1
    }
]);
  
  const [removeId, setRemoveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [idModeloEdicao, setIdModeloEdicao] = useState<number | null>(null);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuarioLogado");
    if (usuarioStorage) {
      const usuario = JSON.parse(usuarioStorage);
      setIdProfessor(usuario.id);
      buscarMenus(usuario.id);
    } else {
      setReady(true);
    }
  }, []);

  async function buscarMenus(idProfessor: number) {
    try {
      setReady(false);
      const resposta = await buscarAvaliacoesPersonalizadas(idProfessor);
      setMenusPersonalizados(resposta || []);
    } catch (error) {
      toast.error("Erro ao carregar modelos");
    } finally {
      setReady(true);
    }
  }

  const filtrados = useMemo(() => {
    return menusPersonalizados.filter((m) =>
      m.nomeModelo.toLowerCase().includes(busca.trim().toLowerCase())
    );
  }, [menusPersonalizados, busca]);

  function abrirNovo() {
    setIdModeloEdicao(null);

    setNomeModelo("");
    setCamposNovos([
        {
            idCampo: 0,
            campo: "",
            tipo: "decimal",
            obrigatorio: false,
            ordem: 1
        }
    ]);

    setOpen(true);
}

  const adicionarNovoCampoNaTela = () => {
    setCamposNovos([
      ...camposNovos,
      { idCampo: 0, campo: "", tipo: "decimal", obrigatorio: false, ordem: camposNovos.length + 1 }
    ]);
  };

  const handleCampoChange = (index: number, propriedade: string, valor: any) => {
    const copiaCampos = [...camposNovos];
    copiaCampos[index] = { ...copiaCampos[index], [propriedade]: valor };
    setCamposNovos(copiaCampos);
  };

  const removerCampoDaTela = (indexParaRemover: number) => {
    if (camposNovos.length === 1) return;
    const filtrados = camposNovos.filter((_, index) => index !== indexParaRemover);
    const reordenados = filtrados.map((campo, index) => ({
      ...campo,
      ordem: index + 1
    }));
    setCamposNovos(reordenados);
  };

  const salvarModeloNoBanco = async () => {
    if (loading) return;

    if (!nomeModelo.trim()) {
      toast.error("Por favor, dê um nome para o tipo de avaliação.");
      return;
    }

    for (const c of camposNovos) {
      if (!c.campo.trim()) {
        toast.error("Preencha o nome de todas as métricas.");
        return;
      }
    }

    const novoMenu: MenusPersonalizados = {
    id: idModeloEdicao ?? 0,
    nomeModelo: nomeModelo.trim(),
    idCriador: idProfessor,
    campos: camposNovos.map(c => ({
        idCampo: c.idCampo ?? 0,
        campo: c.campo ?? c.campo,
        tipo: c.tipo ?? c.tipo,
        obrigatorio: c.obrigatorio,
        ordem: c.ordem
    }))
};

    try {
      setLoading(true);
      if (idModeloEdicao) {
        await atualizarAvaliacoesPersonalizadas(novoMenu);
      } else {
        await inserirAvaliacoesPersonalizadas(novoMenu);
      }
      toast.success("Modelo de avaliação salvo com sucesso!");
      setOpen(false);
      await buscarMenus(idProfessor);
    } catch (error) {
      toast.error("Erro ao salvar o modelo.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirModelo = async () => {
    try { 
      await excluirAvaliacoesPersonalizadas(removeId as number);
      setRemoveId(null);

      await buscarMenus(idProfessor);
    } catch (error) {
      toast.error("Erro ao excluir o modelo.");
    }
  };

  const editarModelo = (menu: MenusPersonalizados) => {
    setIdModeloEdicao(menu.id);

    setNomeModelo(menu.nomeModelo);

    setCamposNovos(
        menu.campos.map(c => ({
            idCampo: c.idCampo,
            campo: c.campo,
            tipo: c.tipo,
            obrigatorio: c.obrigatorio,
            ordem: c.ordem
        }))
    );

    setOpen(true);
};

  

  return (
    /* Adicionada a classe modelo-page-container para ativar seu CSS */
    <div className="modelo-page-container min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header principal */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <ClipboardList className="h-3.5 w-3.5" />
              Gestão de Avaliações
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Configurações de Avaliação
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Monte modelos customizados de avaliação para aplicar aos seus alunos.
            </p>
          </div>
          <Button onClick={abrirNovo} size="lg" className="local-btn-gradient gap-2">
            <Plus className="h-4 w-4" />
            Nova avaliação
          </Button>
        </header>

        {/* Barra de Busca */}
        <div className="mb-6 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar avaliação por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9 local-glass-card"
          />
        </div>

        {/* Listagem Dinâmica */}
        {!ready ? (
          <div className="text-sm text-muted-foreground text-center py-12">Carregando...</div>
        ) : filtrados.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center local-glass-card">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ClipboardList className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {menusPersonalizados.length > 0 ? "Nenhuma avaliação encontrada" : "Crie sua primeira avaliação"}
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {menusPersonalizados.length > 0
                ? "Tente outro termo de busca."
                : "Defina um modelo com métricas personalizadas para padronizar suas avaliações."}
            </p>
            {menusPersonalizados.length === 0 && (
              <Button onClick={abrirNovo} className="mt-6 gap-2 local-btn-gradient">
                <Plus className="h-4 w-4" />
                Nova avaliação
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtrados.map((menu) => (
              <div key={menu.id} className="group local-glass-card local-glass-card-hover rounded-[14px] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-primary shrink-0" />
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {menu.nomeModelo}
                      </h3>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => editarModelo(menu)}
                      aria-label="Editar"
                      className="h-8 w-8 hover:bg-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setRemoveId(menu.id)}
                      aria-label="Excluir"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {menu.campos?.length || 0} {(menu.campos?.length === 1) ? "métrica" : "métricas"}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {menu.campos && menu.campos.length > 0 ? (
                      menu.campos.map((campo, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1 font-normal local-badge">
                          {campo.campo}
                          <span className="text-[10px] opacity-70 ml-1">
                            ({campo.tipo})
                          </span>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Nenhum campo cadastrado</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog Formulario: Nova Avaliação */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle>Nova avaliação</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Defina o nome do modelo e os campos/métricas que devem ser preenchidos.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nomeModelo">Nome da avaliação</Label>
              <Input
                id="nomeModelo"
                value={nomeModelo}
                onChange={(e) => setNomeModelo(e.target.value)}
                placeholder="Ex: Protocolo de Dobras Pollock ou Testes de Força"
                className="bg-background border-border"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <Label>Campos e Variáveis desta Avaliação</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={adicionarNovoCampoNaTela}
                  className="gap-1.5 border-border hover:bg-muted"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar Métrica
                </Button>
              </div>

              <div className="space-y-3">
                {camposNovos.map((campo, idx) => (
                  <div key={idx} className="border border-border rounded-[14px] p-4 bg-muted/40 relative">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Métrica {idx + 1}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={camposNovos.length === 1}
                        onClick={() => removerCampoDaTela(idx)}
                        aria-label="Remover campo"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label className="text-xs">Nome do campo / Métrica</Label>
                        <Input
                          value={campo.campo}
                          onChange={(e) => handleCampoChange(idx, "campo", e.target.value)}
                          placeholder="Ex: Peitoral, Abdominal..."
                          className="bg-background border-border"
                        />
                      </div>

                      <div className="grid gap-1.5">
                        <Label className="text-xs">Tipo de Dado esperado</Label>
                        <Select
                          value={campo.tipo}
                          onValueChange={(v) => handleCampoChange(idx, "tipo", v)}
                        >
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border text-foreground">
                            {Object.entries(TIPO_CAMPO_LABELS).map(([value, label]) => (
                              <SelectItem key={value} value={value} className="focus:bg-muted">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="border-border text-foreground hover:bg-muted">
              Cancelar
            </Button>
            <Button onClick={salvarModeloNoBanco} className="local-btn-gradient">
              {idModeloEdicao ? "Salvar Alterações" : "Salvar Modelo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alerta de Confirmação de Exclusão */}
      <AlertDialog open={removeId !== null} onOpenChange={(o) => !o && setRemoveId(null)}>
        <AlertDialogContent className="bg-card border-border text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir modelo de avaliação?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta ação removerá permanentemente o modelo selecionado da sua listagem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-foreground hover:bg-muted">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluirModelo} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}