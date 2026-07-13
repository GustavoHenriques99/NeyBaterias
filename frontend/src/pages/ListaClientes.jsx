import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getClientes } from "../services/api";
import { useFiltroLista } from "../hooks/useFiltroLista";
import BarraBusca from "../components/BarraBusca";
import Paginacao from "../components/Paginacao";

function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getClientes()
      .then(setClientes)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  const obterCampoOrdenacao = useCallback(
    (c) => (c.tipo === "Fisico" ? c.nome : c.razaoSocial) || "",
    []
  );
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
  } = useFiltroLista(clientes, obterCampoOrdenacao);

  if (carregando) return <p className="p-4">Carregando clientes...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
        <Link
          to="/clientes/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Novo Cliente
        </Link>
      </div>

      <BarraBusca
        busca={busca}
        onBuscaChange={setBusca}
        ordem={ordem}
        onAlternarOrdem={alternarOrdem}
        placeholder="Pesquisar cliente pelo nome..."
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome / Razão Social</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">CPF / CNPJ</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {itensPaginados.map((c) => (
              <tr key={c.idCliente} className="border-t">
                <td className="px-4 py-3">
                  {c.tipo === "Fisico" ? c.nome : c.razaoSocial}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.tipo === "Fisico"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {c.tipo === "Fisico" ? "Pessoa Física" : "Pessoa Jurídica"}
                  </span>
                </td>
                <td className="px-4 py-3">{c.tipo === "Fisico" ? c.cpf : c.cnpj}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.ativo
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {c.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itensPaginados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum cliente encontrado.</p>
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

export default ListaClientes;