import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getFornecedores } from "../services/api";
import { useFiltroLista } from "../hooks/useFiltroLista";
import BarraBusca from "../components/BarraBusca";
import Paginacao from "../components/Paginacao";

function ListaFornecedor() {
  const [fornecedores, setFornecedores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getFornecedores()
      .then(setFornecedores)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const obterCampoOrdenacao = useCallback((f) => f.razaoSocial || "", []);
  const {
    busca,
    setBusca,
    ordem,
    alternarOrdem,
    pagina,
    setPagina,
    totalPaginas,
    itensPaginados,
    totalFiltrados,
    itensPorPagina,
  } = useFiltroLista(fornecedores, obterCampoOrdenacao);

  if (carregando) return <p className="p-4">Carregando fornecedores...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
        <Link
          to="/fornecedores/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo Fornecedor
        </Link>
      </div>

      <BarraBusca
        busca={busca}
        onBuscaChange={setBusca}
        ordem={ordem}
        onAlternarOrdem={alternarOrdem}
        placeholder="Pesquisar fornecedor pelo nome..."
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Razão Social</th>
              <th className="px-4 py-3">CNPJ</th>
              <th className="px-4 py-3">Contato</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((f) => (
              <tr key={f.idFornecedor} className="border-t">
                <td className="px-4 py-3">{f.razaoSocial}</td>
                <td className="px-4 py-3">{f.cnpj}</td>
                <td className="px-4 py-3">{f.contato}</td>
                <td className="px-4 py-3">{f.telefone}</td>
                <td className="px-4 py-3">{f.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum fornecedor encontrado.</p>
        )}
        <Paginacao
          pagina={pagina}
          totalPaginas={totalPaginas}
          onPaginaChange={setPagina}
          totalFiltrados={totalFiltrados}
          itensPorPagina={itensPorPagina}
        />
      </div>
    </div>
  );
}

export default ListaFornecedor;