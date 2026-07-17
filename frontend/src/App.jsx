import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ListaProdutos from "./pages/ListaProdutos";
import CadastroProduto from "./pages/CadastroProduto";
import EditarProduto from "./pages/EditarProduto";
import ListaClientes from "./pages/ListaClientes";
import CadastroCliente from "./pages/CadastroCliente";
import EditarCliente from "./pages/EditarCliente";
import ListaVenda from "./pages/ListaVenda";
import CadastroVenda from "./pages/CadastroVenda";
import ListaServico from "./pages/ListaServico";
import CadastroServico from "./pages/CadastroServico";
import EditarServico from "./pages/EditarServico";
import Estoque from "./pages/Estoque";
import ListaFornecedor from "./pages/ListaFornecedor";
import CadastroFornecedor from "./pages/CadastroFornecedor";
import EditarFornecedor from "./pages/EditarFornecedor";
import CadastroReposicao from "./pages/CadastroReposicao";
import ListaReposicao from "./pages/ListaReposicao";
import Configuracoes from "./pages/Configuracoes";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >
        <Route path="/" element={<Dashboard />} />

        {/* Produtos */}
        <Route path="/produtos" element={<ListaProdutos />} />
        <Route path="/produtos/novo" element={<CadastroProduto />} />
        <Route path="/produtos/:id/editar" element={<EditarProduto />} />

        {/* Serviços */}
        <Route path="/servicos" element={<ListaServico />} />
        <Route path="/servicos/novo" element={<CadastroServico />} />
        <Route path="/servicos/:id/editar" element={<EditarServico />} />

        {/* Estoque */}
        <Route path="/estoque" element={<Estoque />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ListaClientes />} />
        <Route path="/clientes/novo" element={<CadastroCliente />} />
        <Route path="/clientes/:id/editar" element={<EditarCliente />} />

        {/* Vendas */}
        <Route path="/vendas" element={<ListaVenda />} />
        <Route path="/vendas/novo" element={<CadastroVenda />} />

        {/* Fornecedores */}
        <Route path="/fornecedores" element={<ListaFornecedor />} />
        <Route path="/fornecedores/novo" element={<CadastroFornecedor />} />
        <Route path="/fornecedores/:id/editar" element={<EditarFornecedor />} />

        {/* Reposições */}
        <Route path="/reposicoes" element={<ListaReposicao />} />
        <Route path="/reposicoes/novo" element={<CadastroReposicao />} />

        {/* Configurações */}
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>
    </Routes>
  );
}

export default App;