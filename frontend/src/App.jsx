import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ListaProdutos from "./pages/ListaProdutos";
import CadastroProduto from "./pages/CadastroProduto";
import ListaClientes from "./pages/ListaClientes";
import CadastroCliente from "./pages/CadastroCliente";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/produtos" element={<ListaProdutos />} />
        <Route path="/produtos/novo" element={<CadastroProduto />} />
        <Route path="/clientes" element={<ListaClientes />} />
        <Route path="/clientes/novo" element={<CadastroCliente />} />
      </Route>
    </Routes>
  );
}

export default App;