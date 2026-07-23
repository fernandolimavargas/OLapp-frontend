import './App.css'
import Dashboard from "./pages/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login  from './pages/Login'
import Layout from './components/Layout';
import ListaClientes from './pages/GestaoClientes/ListaClientes';
import "./style/global.css";
import CadastrarAvaliacao from './pages/AvaliacaoFisica/CadastrarAvaliacao';
import Usuarios from './pages/Usuarios';
import CriarNovoModelo from './pages/AvaliacaoFisica/NovoMenuAvaliacao';
import HistoricoAvaliacao from './pages/AvaliacaoFisica/HistoricoAvaliacao';
import ProtectRoute from './routes/ProtectRoute';
import VideosAulas from './pages/Videos/VideosAulas';

export default function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectRoute />}>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/gestaoClientes/listaClientes' element={<ListaClientes />} />
            <Route path='/avaliacaoFisica/cadastrarAvaliacao' element={<CadastrarAvaliacao />} />
            <Route path='/avaliacaoFisica/NovoMenuAvaliacao' element={<CriarNovoModelo />} />
            <Route path='/avaliacaoFisica/HistoricoAvaliacao' element={<HistoricoAvaliacao />} />
            <Route path='/usuarios' element={<Usuarios />} />
            <Route path="/videos" element={<VideosAulas />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

