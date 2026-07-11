import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ListaProdutos from "./pages/ListaProdutos";
import CadastroProduto from "./pages/CadastroProduto";
import ListaClientes from "./pages/ListaClientes";
import CadastroCliente from "./pages/CadastroCliente";
import ListaVenda from "./pages/ListaVenda";
import CadastroVenda from "./pages/CadastroVenda";
import ListaServico from "./pages/ListaServico";
import CadastroServico from "./pages/CadastroServico";
import Estoque from "./pages/Estoque";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<ListaProdutos />} />
        <Route path="/produtos/novo" element={<CadastroProduto />} />
        <Route path="/servicos" element={<ListaServico />} />
        <Route path="/servicos/novo" element={<CadastroServico />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/clientes" element={<ListaClientes />} />
        <Route path="/clientes/novo" element={<CadastroCliente />} />
        <Route path="/vendas" element={<ListaVenda />} />
        <Route path="/vendas/novo" element={<CadastroVenda />} />
      </Route>
    </Routes>
  );
}

export default App;