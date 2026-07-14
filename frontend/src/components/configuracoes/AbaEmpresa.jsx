import { useEffect, useState } from "react";
import { getConfiguracaoEmpresa, atualizarConfiguracaoEmpresa } from "../../services/api";

const FORM_INICIAL = {
  nomeEmpresa: "",
  cnpj: "",
  endereco: "",
  telefone: "",
  email: "",
};

function AbaEmpresa() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    getConfiguracaoEmpresa()
      .then(setForm)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
    setSucesso(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      await atualizarConfiguracaoEmpresa(form);
      setSucesso(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="text-slate-400">Carregando dados da empresa...</p>;

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-lg">
        <h2 className="font-semibold text-slate-800 mb-4 text-center">Dados da Empresa</h2>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <Campo label="Nome da Empresa" name="nomeEmpresa" value={form.nomeEmpresa} onChange={handleChange} />
          <Campo label="CNPJ" name="cnpj" value={form.cnpj} onChange={handleChange} obrigatorio={false} />
          <Campo label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} obrigatorio={false} />

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} obrigatorio={false} />
            <Campo label="Email" name="email" type="email" value={form.email} onChange={handleChange} obrigatorio={false} />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {sucesso && <p className="text-sm text-emerald-600">Dados salvos com sucesso!</p>}

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = "text", obrigatorio = true }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={obrigatorio}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default AbaEmpresa;