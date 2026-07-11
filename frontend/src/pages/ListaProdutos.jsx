import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProdutos } from "../services/api";

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

  if (carregando) return <p className="p-4">Carregando produtos...</p>;
  if (erro) return <p className="p-4 text-red-600">Erro: {erro}</p>;

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <Link
        to="/produtos/novo"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        + Novo Produto
      </Link>
    </div>
    
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold mb-4">Produtos</h1>
    //   <ul className="space-y-2">
    //     {produtos.map((produto) => (
    //       <li key={produto.idProduto} className="border rounded p-2">
    //         {produto.descricao} — R$ {produto.precoVenda}
    //       </li>
    //     ))}
    //   </ul>
    // </div>
  );
}

export default ListaProdutos;