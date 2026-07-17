import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarProduto } from "../services/api";

const FORM_INICIAL = {
  descricao: "",
  valor: "",
  amperagem: "",
  marca: "",
  modelo: "",
  precoCusto: "",
  precoVenda: "",
};

function CadastroProduto() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      await criarProduto({
        descricao: form.descricao,
        valor: Number(form.valor),
        amperagem: form.amperagem,
        marca: form.marca,
        modelo: form.modelo,
        precoCusto: Number(form.precoCusto),
        precoVenda: Number(form.precoVenda),
      });

      navigate("/produtos");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Novo Produto</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <Campo label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} />
        <Campo label="Valor (referência)" name="valor" type="number" value={form.valor} onChange={handleChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Amperagem" name="amperagem" value={form.amperagem} onChange={handleChange} />
          <Campo label="Marca" name="marca" value={form.marca} onChange={handleChange} />
        </div>

        <Campo label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Preço de Custo" name="precoCusto" type="number" value={form.precoCusto} onChange={handleChange} />
          <Campo label="Preço de Venda" name="precoVenda" type="number" value={form.precoVenda} onChange={handleChange} />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Produto"}
        </button>
      </form>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default CadastroProduto;