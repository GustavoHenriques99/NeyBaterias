import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getFornecedores, deletarFornecedor, podeCadastrar, podeEditar, podeExcluir } from "../services/api";
import { useFiltroLista } from "../hooks/useFiltroLista";
import BarraBusca from "../components/BarraBusca";
import Paginacao from "../components/Paginacao";
import ConfirmarExclusao from "../components/ConfirmarExclusao";

function ListaFornecedor() {
  const [fornecedores, setFornecedores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [itemParaExcluir, setItemParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  function carregar() {
    setCarregando(true);
    getFornecedores()
      .then(setFornecedores)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }

  useEffect(() => { carregar(); }, []);

  const obterCampoOrdenacao = useCallback((f) => f.razaoSocial || "", []);
  const { busca, setBusca, ordem, alternarOrdem, pagina, setPagina, totalPaginas, itensPaginados, totalFiltrados, itensPorPagina } =
    useFiltroLista(fornecedores, obterCampoOrdenacao);

  async function confirmarExclusao() {
    setExcluindo(true);
    try {
      await deletarFornecedor(itemParaExcluir.idFornecedor);
      setItemParaExcluir(null);
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) return <p className="p-4">Carregando fornecedores...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Fornecedores</h1>
        {podeCadastrar() && (
          <Link to="/fornecedores/novo" className="bg-blue-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Novo Fornecedor
          </Link>
        )}
      </div>

      <BarraBusca busca={busca} onBuscaChange={setBusca} ordem={ordem} onAlternarOrdem={alternarOrdem} placeholder="Pesquisar fornecedor pelo nome..." />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-2 py-2 sm:px-4 sm:py-3">Razão Social</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">CNPJ</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3">Contato</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3">Telefone</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">Email</th>
              <th className="px-2 py-2 sm:px-4 sm:py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((f) => (
              <tr key={f.idFornecedor} className="border-t">
                <td className="px-2 py-2 sm:px-4 sm:py-3">{f.razaoSocial}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">{f.cnpj}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{f.contato}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3">{f.telefone}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 hidden md:table-cell">{f.email}</td>
                <td className="px-2 py-2 sm:px-4 sm:py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {podeEditar() && (
                      <Link to={`/fornecedores/${f.idFornecedor}/editar`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                        <Pencil size={16} />
                      </Link>
                    )}
                    {podeExcluir() && (
                      <button onClick={() => setItemParaExcluir(f)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && <p className="p-4 text-sm text-slate-400">Nenhum fornecedor encontrado.</p>}
        <Paginacao pagina={pagina} totalPaginas={totalPaginas} onPaginaChange={setPagina} totalFiltrados={totalFiltrados} itensPorPagina={itensPorPagina} />
      </div>

      <ConfirmarExclusao
        aberto={!!itemParaExcluir}
        titulo="Excluir fornecedor"
        mensagem={`Deseja excluir "${itemParaExcluir?.razaoSocial}"?`}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setItemParaExcluir(null)}
        excluindo={excluindo}
      />
    </div>
  );
}

export default ListaFornecedor;