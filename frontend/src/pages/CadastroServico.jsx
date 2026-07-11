import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarServico } from "../services/api";

const FORM_INICIAL = {
  descricao: "",
  valor: "",
  preco: "",
  tempoEstimado: "",
};

function CadastroServico() {
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
      await criarServico({
        descricao: form.descricao,
        valor: Number(form.valor),
        preco: Number(form.preco),
        tempoEstimado: Number(form.tempoEstimado),
      });

      navigate("/servicos");
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Novo Serviço</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <Campo label="Descrição" name="descricao" value={form.descricao} onChange={handleChange} />
        <Campo label="Valor (referência)" name="valor" type="number" value={form.valor} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <Campo label="Preço de Venda" name="preco" type="number" value={form.preco} onChange={handleChange} />
          <Campo label="Tempo Estimado (min)" name="tempoEstimado" type="number" value={form.tempoEstimado} onChange={handleChange} />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={salvando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar Serviço"}
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

export default CadastroServico;