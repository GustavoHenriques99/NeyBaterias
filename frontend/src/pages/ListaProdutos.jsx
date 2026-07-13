import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getProdutos } from "../services/api";
import { useFiltroLista } from "../hooks/useFiltroLista";
import BarraBusca from "../components/BarraBusca";
import Paginacao from "../components/Paginacao";

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getProdutos()
      .then((dados) => setProdutos(dados))
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const obterCampoOrdenacao = useCallback((p) => p.descricao || "", []);
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
  } = useFiltroLista(produtos, obterCampoOrdenacao);

  if (carregando) return <p className="p-4">Carregando produtos...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Produtos</h1>
        <Link
          to="/produtos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo Produto
        </Link>
      </div>

      <BarraBusca
        busca={busca}
        onBuscaChange={setBusca}
        ordem={ordem}
        onAlternarOrdem={alternarOrdem}
        placeholder="Pesquisar produto pelo nome..."
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Descrição</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Amperagem</th>
              <th className="px-4 py-3">Preço Custo</th>
              <th className="px-4 py-3">Preço Venda</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((p) => (
              <tr key={p.idProduto} className="border-t">
                <td className="px-4 py-3">{p.descricao}</td>
                <td className="px-4 py-3">{p.marca}</td>
                <td className="px-4 py-3">{p.modelo}</td>
                <td className="px-4 py-3">{p.amperagem}</td>
                <td className="px-4 py-3">{formatarMoeda(p.precoCusto)}</td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {formatarMoeda(p.precoVenda)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum produto encontrado.</p>
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

export default ListaProdutos;