import { Dumbbell, FileText, Home, MessageCircle, Users } from "lucide-react";

export const menusItems = [ 
        { 
            label: "Dashboard", 
            icon: Home,
            path: "/dashboard"
        }, 
        { 
            label: "Gestão de Clientes", 
            icon: Users, 
            children: [
                {
                    label: "Lista de Clientes",
                    path: "/gestaoClientes/listaClientes"
                }
            ]
        }, 
        { 
            label: "Avaliação", 
            icon: FileText,
            children: [
                { label: "Nova Avaliação", path: "/avaliacaoFisica/cadastrarAvaliacao" },
                { label: "Histórico de Avaliações", path: "/avaliacaoFisica/HistoricoAvaliacao" },
                { label: "Análise Comparativa", path: "/avaliacaoFisica/analise" }, 
                { label: "Novo menu de avaliação", path: "avaliacaoFisica/NovoMenuAvaliacao"}
            ]
        }, 
        { 
            label: "Treinos e Performance", 
            icon: Dumbbell, 
            children: [
                { label: "Registro de Treino", path: "/treinos/registro" },
                { label: "Histórico de Treinos", path: "/treinos/historico" },
                { label: "Análise de Performance", path: "/treinos/analise" },
                { label: "Videos", path: "/videos"}
            ]
        },
        { 
            label: "WhatsApp + I.A", 
            icon: MessageCircle,
            path: "/whatsapp"
        }
    ]