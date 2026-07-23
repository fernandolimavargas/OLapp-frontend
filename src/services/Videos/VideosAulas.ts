import { useCallback, useEffect, useState } from "react";

export type VideoSource = "youtube" | "onedrive" | "drive" | "outro";

export const VIDEO_SOURCE_LABELS: Record<VideoSource, string> = {
  youtube: "YouTube",
  onedrive: "OneDrive",
  drive: "Google Drive",
  outro: "Outro",
};

export interface Pasta {
  id: string;
  nome: string;
  parentId: string | null;
  criadoEm: string;
}

export interface Video {
  id: string;
  pastaId: string | null; // null = raiz
  titulo: string;
  descricao?: string;
  url: string;
  origem: VideoSource;
  publicarEm?: string; // ISO date; se futura, oculto para alunos
  criadoEm: string;
}

const PASTAS_KEY = "videos:pastas:v1";
const VIDEOS_KEY = "videos:videos:v1";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function detectarOrigem(url: string): VideoSource {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("onedrive") || u.includes("1drv.ms")) return "onedrive";
  if (u.includes("drive.google")) return "drive";
  return "outro";
}

function loadPastas(): Pasta[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PASTAS_KEY);
    if (!raw) return seedPastas();
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function loadVideos(): Video[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(VIDEOS_KEY);
    if (!raw) return seedVideos();
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function seedPastas(): Pasta[] {
  const costas: Pasta = {
    id: "seed-costas",
    nome: "Exercícios de Costas",
    parentId: null,
    criadoEm: new Date().toISOString(),
  };
  const iniciante: Pasta = {
    id: "seed-costas-ini",
    nome: "Iniciante",
    parentId: costas.id,
    criadoEm: new Date().toISOString(),
  };
  const pernas: Pasta = {
    id: "seed-pernas",
    nome: "Pernas",
    parentId: null,
    criadoEm: new Date().toISOString(),
  };
  const arr = [costas, iniciante, pernas];
  window.localStorage.setItem(PASTAS_KEY, JSON.stringify(arr));
  return arr;
}

function seedVideos(): Video[] {
  const v: Video[] = [
    {
      id: uid(),
      pastaId: "seed-costas-ini",
      titulo: "Remada curvada — introdução",
      descricao: "Postura e execução básica",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      origem: "youtube",
      criadoEm: new Date().toISOString(),
    },
    {
      id: uid(),
      pastaId: "seed-pernas",
      titulo: "Agachamento livre",
      url: "https://youtu.be/dQw4w9WgXcQ",
      origem: "youtube",
      criadoEm: new Date().toISOString(),
    },
  ];
  window.localStorage.setItem(VIDEOS_KEY, JSON.stringify(v));
  return v;
}

export function useVideos() {
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPastas(loadPastas());
    setVideos(loadVideos());
    setReady(true);
  }, []);

  const persistPastas = useCallback((next: Pasta[]) => {
    setPastas(next);
    window.localStorage.setItem(PASTAS_KEY, JSON.stringify(next));
  }, []);

  const persistVideos = useCallback((next: Video[]) => {
    setVideos(next);
    window.localStorage.setItem(VIDEOS_KEY, JSON.stringify(next));
  }, []);

  const createPasta = useCallback(
    (nome: string, parentId: string | null) => {
      const nova: Pasta = {
        id: uid(),
        nome,
        parentId,
        criadoEm: new Date().toISOString(),
      };
      persistPastas([nova, ...pastas]);
      return nova;
    },
    [pastas, persistPastas],
  );

  const renamePasta = useCallback(
    (id: string, nome: string) => {
      persistPastas(pastas.map((p) => (p.id === id ? { ...p, nome } : p)));
    },
    [pastas, persistPastas],
  );

  const removePasta = useCallback(
    (id: string) => {
      // remove pasta + descendentes + vídeos dentro delas
      const toRemove = new Set<string>();
      const walk = (pid: string) => {
        toRemove.add(pid);
        pastas.filter((p) => p.parentId === pid).forEach((c) => walk(c.id));
      };
      walk(id);
      persistPastas(pastas.filter((p) => !toRemove.has(p.id)));
      persistVideos(
        videos.filter((v) => !v.pastaId || !toRemove.has(v.pastaId)),
      );
    },
    [pastas, videos, persistPastas, persistVideos],
  );

  const createVideo = useCallback(
    (data: Omit<Video, "id" | "criadoEm">) => {
      const novo: Video = {
        ...data,
        id: uid(),
        criadoEm: new Date().toISOString(),
      };
      persistVideos([novo, ...videos]);
      return novo;
    },
    [videos, persistVideos],
  );

  const updateVideo = useCallback(
    (id: string, data: Partial<Omit<Video, "id" | "criadoEm">>) => {
      persistVideos(videos.map((v) => (v.id === id ? { ...v, ...data } : v)));
    },
    [videos, persistVideos],
  );

  const removeVideo = useCallback(
    (id: string) => {
      persistVideos(videos.filter((v) => v.id !== id));
    },
    [videos, persistVideos],
  );

  return {
    pastas,
    videos,
    ready,
    createPasta,
    renamePasta,
    removePasta,
    createVideo,
    updateVideo,
    removeVideo,
  };
}

export function getYoutubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    return null;
  }
  return null;
}
