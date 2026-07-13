import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getFornecedores, getProdutos, criarCompraReposicao } from "../services/api";

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function CadastroReposicao() {
  const [fornecedores, setFornecedores] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState(null);

  const [idFornecedor, setIdFornecedor] = useState("");
  const [carrinho, setCarrinho] = useState([]);

  const [idProdutoSelecionado, setIdProdutoSelecionado] = useState("");
  const [qtdSelecionada, setQtdSelecionada] = useState(1);
  const [precoSelecionado, setPrecoSelecionado] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getFornecedores(), getProdutos()])
      .then(([fornecedoresData, produtosData]) => {
        setFornecedores(fornecedoresData);
        setProdutosDisponiveis(produtosData);
      })
      .catch((err) => setErroCarga(err.message))
      .finally(() => setCarregando(false));
  }, []);

  function selecionarProduto(idProduto) {
    setIdProdutoSelecionado(idProduto);
    const produto = produtosDisponiveis.find((p) => p.idProduto === Number(idProduto));
    setPrecoSelecionado(produto ? produto.precoCusto : "");
  }

  function adicionarItem() {
    if (!idProdutoSelecionado || qtdSelecionada <= 0) return;

    const produto = produtosDisponiveis.find((p) => p.idProduto === Number(idProdutoSelecionado));
    if (!produto) return;

    setCarrinho((atual) => {
      const existente = atual.find((i) => i.idProduto === produto.idProduto);
      if (existente) {
        return atual.map((i) =>
          i.idProduto === produto.idProduto
            ? { ...i, qtd: i.qtd + Number(qtdSelecionada) }
            : i
        );
      }
      return [
        ...atual,
        {
          idProduto: produto.idProduto,
          descricao: produto.descricao,
          qtd: Number(qtdSelecionada),
          precoCompra: Number(precoSelecionado || produto.precoCusto),
        },
      ];
    });

    setIdProdutoSelecionado("");
    setQtdSelecionada(1);
    setPrecoSelecionado("");
  }

  function removerItem(idProduto) {
    setCarrinho((atual) => atual.filter((i) => i.idProduto !== idProduto));
  }

  function atualizarPrecoItem(idProduto, novoPreco) {
    setCarrinho((atual) =>
      atual.map((i) =>
        i.idProduto === idProduto ? { ...i, precoCompra: Number(novoPreco) } : i
      )
    );
  }

  const total = carrinho.reduce((soma, i) => soma + i.qtd * i.precoCompra, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    if (carrinho.length === 0) {
      setErro("Adicione ao menos um produto à reposição.");
      return;
    }

    setSalvando(true);
    try {
      await criarCompraReposicao({
        idFornecedor: Number(idFornecedor),
        itens: carrinho.map((i) => ({
          idProduto: i.idProduto,
          qtd: i.qtd,
          precoCompra: i.precoCompra,
        })),
      });
      navigate("/reposicoes");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="p-4">Carregando dados...</p>;
  if (erroCarga) return <p className="p-4 text-red-600">Erro: {erroCarga}</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Nova Reposição de Estoque</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm text-slate-600 mb-1">Fornecedor</label>
          <select
            required
            value={idFornecedor}
            onChange={(e) => setIdFornecedor(e.target.value)}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {fornecedores.map((f) => (
              <option key={f.idFornecedor} value={f.idFornecedor}>
                {f.razaoSocial}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Produtos Repostos</h2>

          <div className="flex gap-2 mb-4">
            <select
              value={idProdutoSelecionado}
              onChange={(e) => selecionarProduto(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um produto...</option>
              {produtosDisponiveis.map((p) => (
                <option key={p.idProduto} value={p.idProduto}>
                  {p.descricao} ({p.marca} {p.modelo})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={qtdSelecionada}
              onChange={(e) => setQtdSelecionada(e.target.value)}
              className="w-20 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Qtd"
            />
            <input
              type="number"
              step="0.01"
              value={precoSelecionado}
              onChange={(e) => setPrecoSelecionado(e.target.value)}
              className="w-28 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Preço custo"
            />
            <button
              type="button"
              onClick={adicionarItem}
              className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700"
            >
              Adicionar
            </button>
          </div>

          {carrinho.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 border-b">
                <tr>
                  <th className="py-2">Produto</th>
                  <th className="py-2">Qtd</th>
                  <th className="py-2">Preço Custo</th>
                  <th className="py-2">Subtotal</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((i) => (
                  <tr key={i.idProduto} className="border-b last:border-0">
                    <td className="py-2">{i.descricao}</td>
                    <td className="py-2">{i.qtd}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={i.precoCompra}
                        onChange={(e) => atualizarPrecoItem(i.idProduto, e.target.value)}
                        className="w-24 border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2">{formatarMoeda(i.qtd * i.precoCompra)}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => removerItem(i.idProduto)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-400">Nenhum produto adicionado ainda.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-end">
          <div className="w-64 flex justify-between text-base font-bold text-slate-800">
            <span>Total</span>
            <span>{formatarMoeda(total)}</span>
          </div>
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Registrar Reposição"}
        </button>
      </form>
    </div>
  );
}

export default CadastroReposicao;