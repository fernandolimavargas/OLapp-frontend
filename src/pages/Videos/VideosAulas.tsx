import { useMemo, useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Folder,
  FolderPlus,
  Video as VideoIcon,
  ArrowLeft,
  ExternalLink,
  Search,
  Clock,
  Play,
  GraduationCap,
  UserCog,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Pasta,
  type Video,
  type VideoSource,
  VIDEO_SOURCE_LABELS,
  detectarOrigem,
  getYoutubeEmbed,
  useVideos,
} from "@/services/Videos/VideosAulas";
import { toast } from "sonner";
import "../../style/Video/video.css"

type Role = "professor" | "aluno";
const ROLE_KEY = "videos:role";

export default function VideosAulas() {
  const {
    pastas,
    videos,
    ready,
    createPasta,
    renamePasta,
    removePasta,
    createVideo,
    updateVideo,
    removeVideo,
  } = useVideos();

  const [role, setRole] = useState<Role>("professor");
  useEffect(() => {
    const r = (typeof window !== "undefined" && localStorage.getItem(ROLE_KEY)) as Role | null;
    if (r === "aluno" || r === "professor") setRole(r);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  const [pastaAtual, setPastaAtual] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [pastaDialog, setPastaDialog] = useState<{
    open: boolean;
    editing: Pasta | null;
  }>({ open: false, editing: null });
  const [videoDialog, setVideoDialog] = useState<{
    open: boolean;
    editing: Video | null;
  }>({ open: false, editing: null });
  const [removePastaId, setRemovePastaId] = useState<string | null>(null);
  const [removeVideoId, setRemoveVideoId] = useState<string | null>(null);
  const [playing, setPlaying] = useState<Video | null>(null);

  const isAluno = role === "aluno";
  const hoje = new Date().toISOString().slice(0, 10);

  // filtros aluno: esconde vídeos com publicarEm > hoje
  const videosVisiveis = useMemo(
    () =>
      isAluno
        ? videos.filter((v) => !v.publicarEm || v.publicarEm <= hoje)
        : videos,
    [videos, isAluno, hoje],
  );

  // breadcrumb
  const trilha = useMemo(() => {
    const arr: Pasta[] = [];
    let cur = pastaAtual;
    while (cur) {
      const p = pastas.find((x) => x.id === cur);
      if (!p) break;
      arr.unshift(p);
      cur = p.parentId;
    }
    return arr;
  }, [pastaAtual, pastas]);

  const subpastas = useMemo(
    () =>
      pastas
        .filter((p) => p.parentId === pastaAtual)
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    [pastas, pastaAtual],
  );

  const videosPasta = useMemo(
    () =>
      videosVisiveis
        .filter((v) => v.pastaId === pastaAtual)
        .filter((v) =>
          v.titulo.toLowerCase().includes(busca.trim().toLowerCase()),
        )
        .sort((a, b) => a.titulo.localeCompare(b.titulo)),
    [videosVisiveis, pastaAtual, busca],
  );

  // busca global (mostra também resultados de fora da pasta atual)
  const buscaGlobal = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return [];
    return videosVisiveis
      .filter(
        (v) =>
          v.pastaId !== pastaAtual &&
          v.titulo.toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [busca, videosVisiveis, pastaAtual]);

  function pastaNome(id: string | null): string {
    if (!id) return "Biblioteca";
    return pastas.find((p) => p.id === id)?.nome ?? "—";
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <VideoIcon className="h-3.5 w-3.5" />
              {isAluno ? "Vídeo aulas" : "Biblioteca de vídeos"}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {isAluno ? "Vídeo aulas" : "Vídeos"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAluno
                ? "Acesse os vídeos disponibilizados pelo seu professor."
                : "Organize seus vídeos em pastas e subpastas. Publique de imediato ou agende para uma data futura."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="glass-card flex items-center rounded-full p-1">
              <button
                onClick={() => setRole("professor")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  !isAluno
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserCog className="h-3.5 w-3.5" /> Professor
              </button>
              <button
                onClick={() => setRole("aluno")}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  isAluno
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" /> Aluno
              </button>
            </div>
            {!isAluno && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setPastaDialog({ open: true, editing: null })}
                  className="gap-2"
                >
                  <FolderPlus className="h-4 w-4" />
                  Nova pasta
                </Button>
                <Button
                  onClick={() => setVideoDialog({ open: true, editing: null })}
                  size="lg"
                  className="btn-gradient gap-2 border-0"
                >
                  <Plus className="h-4 w-4" />
                  Novo vídeo
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-1.5 text-sm">
          <button
            onClick={() => setPastaAtual(null)}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 transition hover:bg-accent ${
              pastaAtual === null ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            <Folder className="h-3.5 w-3.5" />
            Biblioteca
          </button>
          {trilha.map((p, i) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => setPastaAtual(p.id)}
                className={`rounded-md px-2 py-1 transition hover:bg-accent ${
                  i === trilha.length - 1
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {p.nome}
              </button>
            </span>
          ))}
          {pastaAtual !== null && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                const cur = pastas.find((p) => p.id === pastaAtual);
                setPastaAtual(cur?.parentId ?? null);
              }}
              className="ml-auto gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Voltar
            </Button>
          )}
        </div>

        <div className="mb-6 relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar vídeo por título..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="glass-card pl-9"
          />
        </div>

        {!ready ? (
          <div className="text-sm text-muted-foreground">Carregando...</div>
        ) : (
          <div className="space-y-8">
            {/* Pastas */}
            {subpastas.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Pastas
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {subpastas.map((p) => {
                    const nSub = pastas.filter((x) => x.parentId === p.id).length;
                    const nVid = videosVisiveis.filter((v) => v.pastaId === p.id).length;
                    return (
                      <PastaCard
                        key={p.id}
                        pasta={p}
                        nSub={nSub}
                        nVid={nVid}
                        canManage={!isAluno}
                        onOpen={() => setPastaAtual(p.id)}
                        onEdit={() =>
                          setPastaDialog({ open: true, editing: p })
                        }
                        onDelete={() => setRemovePastaId(p.id)}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Vídeos */}
            <section>
              <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Vídeos
              </h2>
              {videosPasta.length === 0 && subpastas.length === 0 ? (
                <EmptyState
                  onCreate={() =>
                    setVideoDialog({ open: true, editing: null })
                  }
                  canManage={!isAluno}
                />
              ) : videosPasta.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
                  Nenhum vídeo nesta pasta.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {videosPasta.map((v) => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      hoje={hoje}
                      canManage={!isAluno}
                      onPlay={() => setPlaying(v)}
                      onEdit={() =>
                        setVideoDialog({ open: true, editing: v })
                      }
                      onDelete={() => setRemoveVideoId(v.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {buscaGlobal.length > 0 && (
              <section>
                <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Encontrados em outras pastas
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {buscaGlobal.map((v) => (
                    <VideoCard
                      key={v.id}
                      video={v}
                      hoje={hoje}
                      canManage={!isAluno}
                      pastaHint={pastaNome(v.pastaId)}
                      onPlay={() => setPlaying(v)}
                      onEdit={() =>
                        setVideoDialog({ open: true, editing: v })
                      }
                      onDelete={() => setRemoveVideoId(v.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <PastaDialog
        open={pastaDialog.open}
        editing={pastaDialog.editing}
        pastaAtualId={pastaAtual}
        pastas={pastas}
        onClose={() => setPastaDialog({ open: false, editing: null })}
        onSave={(nome, parentId) => {
          if (pastaDialog.editing) {
            renamePasta(pastaDialog.editing.id, nome);
            toast.success("Pasta atualizada");
          } else {
            createPasta(nome, parentId);
            toast.success("Pasta criada");
          }
          setPastaDialog({ open: false, editing: null });
        }}
      />

      <VideoDialog
        open={videoDialog.open}
        editing={videoDialog.editing}
        pastaAtualId={pastaAtual}
        pastas={pastas}
        onClose={() => setVideoDialog({ open: false, editing: null })}
        onSave={(data) => {
          if (videoDialog.editing) {
            updateVideo(videoDialog.editing.id, data);
            toast.success("Vídeo atualizado");
          } else {
            createVideo(data);
            toast.success("Vídeo adicionado");
          }
          setVideoDialog({ open: false, editing: null });
        }}
      />

      <AlertDialog
        open={removePastaId !== null}
        onOpenChange={(o) => !o && setRemovePastaId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pasta?</AlertDialogTitle>
            <AlertDialogDescription>
              A pasta, subpastas e todos os vídeos dentro serão removidos. Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removePastaId) {
                  removePasta(removePastaId);
                  toast.success("Pasta excluída");
                }
                setRemovePastaId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={removeVideoId !== null}
        onOpenChange={(o) => !o && setRemoveVideoId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir vídeo?</AlertDialogTitle>
            <AlertDialogDescription>
              O vídeo será removido da biblioteca. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removeVideoId) {
                  removeVideo(removeVideoId);
                  toast.success("Vídeo excluído");
                }
                setRemoveVideoId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PlayerDialog video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

function EmptyState({
  onCreate,
  canManage,
}: {
  onCreate: () => void;
  canManage: boolean;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <VideoIcon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        {canManage ? "Nenhum vídeo por aqui" : "Sem vídeos disponíveis"}
      </h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        {canManage
          ? "Adicione seu primeiro vídeo (YouTube, OneDrive ou Google Drive) ou crie uma pasta para organizar."
          : "Assim que o professor publicar vídeos, eles aparecerão aqui."}
      </p>
      {canManage && (
        <Button onClick={onCreate} className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Novo vídeo
        </Button>
      )}
    </div>
  );
}

function PastaCard({
  pasta,
  nSub,
  nVid,
  canManage,
  onOpen,
  onEdit,
  onDelete,
}: {
  pasta: Pasta;
  nSub: number;
  nVid: number;
  canManage: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group glass-card glass-card-hover flex items-center gap-3 rounded-[14px] p-4">
      <button
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Folder className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {pasta.nome}
          </div>
          <div className="text-xs text-muted-foreground">
            {nSub > 0 && `${nSub} pasta${nSub === 1 ? "" : "s"} · `}
            {nVid} vídeo{nVid === 1 ? "" : "s"}
          </div>
        </div>
      </button>
      {canManage && (
        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
          <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Renomear">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onDelete}
            aria-label="Excluir"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function VideoCard({
  video,
  hoje,
  canManage,
  pastaHint,
  onPlay,
  onEdit,
  onDelete,
}: {
  video: Video;
  hoje: string;
  canManage: boolean;
  pastaHint?: string;
  onPlay: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const agendado = video.publicarEm && video.publicarEm > hoje;
  const embed = getYoutubeEmbed(video.url);

  return (
    <div className="group glass-card glass-card-hover overflow-hidden rounded-[14px]">
      <button
        onClick={onPlay}
        className="relative flex aspect-video w-full items-center justify-center bg-black/40"
      >
        {embed ? (
          <img
            src={`https://img.youtube.com/vi/${embed.split("/embed/")[1]}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
          />
        ) : (
          <VideoIcon className="h-10 w-10 text-muted-foreground" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition group-hover:scale-110">
            <Play className="h-5 w-5 translate-x-0.5" />
          </div>
        </div>
        <Badge
          variant="secondary"
          className="absolute right-2 top-2 bg-black/60 text-white backdrop-blur"
        >
          {VIDEO_SOURCE_LABELS[video.origem]}
        </Badge>
      </button>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {video.titulo}
            </h3>
            {video.descricao && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {video.descricao}
              </p>
            )}
          </div>
          {canManage && (
            <div className="flex shrink-0 gap-0.5">
              <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Editar" className="h-8 w-8">
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={onDelete}
                aria-label="Excluir"
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {pastaHint && (
            <Badge variant="outline" className="gap-1 font-normal">
              <Folder className="h-3 w-3" />
              {pastaHint}
            </Badge>
          )}
          {agendado && (
            <Badge className="gap-1 bg-amber-500/20 font-normal text-amber-300 hover:bg-amber-500/20">
              <Clock className="h-3 w-3" />
              Agendado {formatDate(video.publicarEm!)}
            </Badge>
          )}
          <a
            href={video.url}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" /> Abrir
          </a>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function PastaDialog({
  open,
  editing,
  pastaAtualId,
  pastas,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: Pasta | null;
  pastaAtualId: string | null;
  pastas: Pasta[];
  onClose: () => void;
  onSave: (nome: string, parentId: string | null) => void;
}) {
  const [nome, setNome] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);

  useMemo(() => {
    if (open) {
      setNome(editing?.nome ?? "");
      setParentId(editing ? editing.parentId : pastaAtualId);
    }
  }, [open, editing, pastaAtualId]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Renomear pasta" : "Nova pasta"}
          </DialogTitle>
          <DialogDescription>
            Organize seus vídeos em pastas e subpastas.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="pasta-nome">Nome da pasta</Label>
            <Input
              id="pasta-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Exercícios de costas"
            />
          </div>
          {!editing && (
            <div className="grid gap-2">
              <Label>Pasta pai</Label>
              <Select
                value={parentId ?? "__root__"}
                onValueChange={(v) => setParentId(v === "__root__" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__root__">Biblioteca (raiz)</SelectItem>
                  {pastas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!nome.trim()) {
                toast.error("Informe o nome da pasta");
                return;
              }
              onSave(nome.trim(), parentId);
            }}
            className="btn-gradient border-0"
          >
            {editing ? "Salvar" : "Criar pasta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function VideoDialog({
  open,
  editing,
  pastaAtualId,
  pastas,
  onClose,
  onSave,
}: {
  open: boolean;
  editing: Video | null;
  pastaAtualId: string | null;
  pastas: Pasta[];
  onClose: () => void;
  onSave: (data: Omit<Video, "id" | "criadoEm">) => void;
}) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [url, setUrl] = useState("");
  const [origem, setOrigem] = useState<VideoSource>("youtube");
  const [pastaId, setPastaId] = useState<string | null>(null);
  const [publicarEm, setPublicarEm] = useState("");

  useMemo(() => {
    if (open) {
      setTitulo(editing?.titulo ?? "");
      setDescricao(editing?.descricao ?? "");
      setUrl(editing?.url ?? "");
      setOrigem(editing?.origem ?? "youtube");
      setPastaId(editing ? editing.pastaId : pastaAtualId);
      setPublicarEm(editing?.publicarEm ?? "");
    }
  }, [open, editing, pastaAtualId]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Editar vídeo" : "Novo vídeo"}
          </DialogTitle>
          <DialogDescription>
            Cole a URL do YouTube, OneDrive ou Google Drive.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="video-titulo">Título</Label>
            <Input
              id="video-titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Agachamento livre — execução"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="video-url">URL do vídeo</Label>
            <Input
              id="video-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setOrigem(detectarOrigem(e.target.value));
              }}
              placeholder="https://youtube.com/... | https://1drv.ms/... | https://drive.google.com/..."
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Origem</Label>
              <Select value={origem} onValueChange={(v) => setOrigem(v as VideoSource)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(VIDEO_SOURCE_LABELS) as VideoSource[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {VIDEO_SOURCE_LABELS[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Pasta</Label>
              <Select
                value={pastaId ?? "__root__"}
                onValueChange={(v) => setPastaId(v === "__root__" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__root__">Biblioteca (raiz)</SelectItem>
                  {pastas.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="video-desc">Descrição (opcional)</Label>
            <Textarea
              id="video-desc"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              placeholder="Notas, foco do exercício, séries..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="video-publicar" className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" />
              Publicar em (opcional)
            </Label>
            <Input
              id="video-publicar"
              type="date"
              value={publicarEm}
              onChange={(e) => setPublicarEm(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Se a data for futura, o vídeo fica oculto para os alunos até lá.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (!titulo.trim()) return toast.error("Informe o título");
              if (!url.trim()) return toast.error("Informe a URL");
              onSave({
                titulo: titulo.trim(),
                descricao: descricao.trim() || undefined,
                url: url.trim(),
                origem,
                pastaId,
                publicarEm: publicarEm || undefined,
              });
            }}
            className="btn-gradient border-0"
          >
            {editing ? "Salvar alterações" : "Adicionar vídeo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PlayerDialog({
  video,
  onClose,
}: {
  video: Video | null;
  onClose: () => void;
}) {
  const embed = video ? getYoutubeEmbed(video.url) : null;
  return (
    <Dialog open={video !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{video?.titulo}</DialogTitle>
          {video?.descricao && (
            <DialogDescription>{video.descricao}</DialogDescription>
          )}
        </DialogHeader>
        {video && (
          <div className="overflow-hidden rounded-lg bg-black">
            {embed ? (
              <iframe
                src={embed}
                title={video.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 p-6 text-center">
                <VideoIcon className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Prévia não disponível para {VIDEO_SOURCE_LABELS[video.origem]}. Abra em nova aba:
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir vídeo
                </a>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
