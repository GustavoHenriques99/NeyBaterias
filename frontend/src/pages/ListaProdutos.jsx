import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Check, X, Search, Trash2 } from "lucide-react";
import { getProdutos, atualizarProduto, deletarProduto } from "../services/api";
import ConfirmarExclusao from "../components/ConfirmarExclusao";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});
  const [salvando, setSalvando] = useState(false);

  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  function carregar() {
    setCarregando(true);
    getProdutos()
      .then(setProdutos)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos
      .filter((p) => p.descricao.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => a.descricao.localeCompare(b.descricao, "pt-BR"));
  }, [produtos, busca]);

  function iniciarEdicao(produto) {
    setEditandoId(produto.idProduto);
    setFormEdicao({
      descricao: produto.descricao,
      amperagem: produto.amperagem,
      marca: produto.marca,
      modelo: produto.modelo,
      precoCusto: produto.precoCusto,
      precoVenda: produto.precoVenda,
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setFormEdicao({});
  }

  function handleChangeEdicao(campo, valor) {
    setFormEdicao((atual) => ({ ...atual, [campo]: valor }));
  }

  async function salvarEdicao(id) {
    setSalvando(true);
    try {
      await atualizarProduto(id, {
        descricao: formEdicao.descricao,
        amperagem: formEdicao.amperagem,
        marca: formEdicao.marca,
        modelo: formEdicao.modelo,
        precoCusto: Number(formEdicao.precoCusto),
        precoVenda: Number(formEdicao.precoVenda),
      });
      cancelarEdicao();
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return;
    setExcluindo(true);
    try {
      await deletarProduto(produtoParaExcluir.idProduto);
      setProdutoParaExcluir(null);
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setExcluindo(false);
    }
  }

  if (carregando) return <p className="p-4">Carregando produtos...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-4">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link
          to="/produtos/novo"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

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
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map((p) => {
              const emEdicao = editandoId === p.idProduto;

              return (
                <tr key={p.idProduto} className="border-t">
                  {emEdicao ? (
                    <>
                      <td className="px-4 py-2">
                        <InputInline value={formEdicao.descricao} onChange={(v) => handleChangeEdicao("descricao", v)} />
                      </td>
                      <td className="px-4 py-2">
                        <InputInline value={formEdicao.marca} onChange={(v) => handleChangeEdicao("marca", v)} />
                      </td>
                      <td className="px-4 py-2">
                        <InputInline value={formEdicao.modelo} onChange={(v) => handleChangeEdicao("modelo", v)} />
                      </td>
                      <td className="px-4 py-2">
                        <InputInline value={formEdicao.amperagem} onChange={(v) => handleChangeEdicao("amperagem", v)} />
                      </td>
                      <td className="px-4 py-2">
                        <InputInline type="number" value={formEdicao.precoCusto} onChange={(v) => handleChangeEdicao("precoCusto", v)} />
                      </td>
                      <td className="px-4 py-2">
                        <InputInline type="number" value={formEdicao.precoVenda} onChange={(v) => handleChangeEdicao("precoVenda", v)} />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => salvarEdicao(p.idProduto)}
                            disabled={salvando}
                            title="Salvar"
                            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelarEdicao}
                            title="Cancelar"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">{p.descricao}</td>
                      <td className="px-4 py-3">{p.marca}</td>
                      <td className="px-4 py-3">{p.modelo}</td>
                      <td className="px-4 py-3">{p.amperagem}</td>
                      <td className="px-4 py-3">R$ {p.precoCusto.toFixed(2)}</td>
                      <td className="px-4 py-3">R$ {p.precoVenda.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => iniciarEdicao(p)}
                            title="Editar"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setProdutoParaExcluir(p)}
                            title="Excluir"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {produtosFiltrados.length === 0 && (
          <p className="p-4 text-sm text-slate-400">Nenhum produto encontrado.</p>
        )}
      </div>

      {(
        <ConfirmarExclusao
          aberto={!!produtoParaExcluir}
          titulo="Excluir produto"
          mensagem={`Deseja excluir o produto "${produtoParaExcluir?.descricao}"?`}
          onConfirmar={confirmarExclusao}
          onCancelar={() => setProdutoParaExcluir(null)}
          excluindo={excluindo}
        />
      )}
    </div>
  );
}

function InputInline({ value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default ListaProdutos;