import { useEffect, useState } from "react";
import { Pencil, Power, PowerOff } from "lucide-react";
import {
  getOperadores,
  criarOperador,
  atualizarOperador,
  ativarOperador,
  desativarOperador,
} from "../../services/api";

const FORM_INICIAL = {
  nome: "",
  sobrenome: "",
  dataNascimento: "",
  sexo: "M",
  email: "",
  telCelular: "",
  login: "",
  senha: "",
  cargo: "",
  nivelAcesso: 1,
};

function AbaOperadores() {
  const [operadores, setOperadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null); // null = criando novo; objeto = editando esse operador
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    setCarregando(true);
    getOperadores()
      .then(setOperadores)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  function abrirNovo() {
    setEditando(null);
    setForm(FORM_INICIAL);
    setMostrarForm(true);
  }

  function abrirEdicao(operador) {
    setEditando(operador);
    setForm({
      nome: operador.nome,
      sobrenome: operador.sobrenome,
      dataNascimento: "", // a listagem não traz esse campo; ao editar, mantemos o que já está salvo
      sexo: "M",
      email: operador.email,
      telCelular: operador.telCelular,
      login: operador.login,
      senha: "", // não usado na edição
      cargo: operador.cargo,
      nivelAcesso: operador.nivelAcesso,
    });
    setMostrarForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);

    try {
      if (editando) {
        await atualizarOperador(editando.idOperador, {
          nome: form.nome,
          sobrenome: form.sobrenome,
          dataNascimento: form.dataNascimento || "1990-01-01",
          sexo: form.sexo,
          email: form.email,
          telCelular: form.telCelular,
          login: form.login,
          cargo: form.cargo,
          nivelAcesso: Number(form.nivelAcesso),
        });
      } else {
        await criarOperador({
          ...form,
          nivelAcesso: Number(form.nivelAcesso),
        });
      }

      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(operador) {
    try {
      if (operador.ativo) {
        await desativarOperador(operador.idOperador);
      } else {
        await ativarOperador(operador.idOperador);
      }
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  if (carregando) return <p className="text-slate-400">Carregando operadores...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800">Operadores do Sistema</h2>
        {!mostrarForm && (
          <button
            onClick={abrirNovo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            + Novo Operador
          </button>
        )}
      </div>

      {erro && <p className="text-sm text-red-600 mb-4">{erro}</p>}

      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4 mb-6 max-w-lg"
        >
          <h3 className="font-medium text-slate-800">
            {editando ? `Editando: ${editando.nome}` : "Novo Operador"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Nome" name="nome" value={form.nome} onChange={handleChange} />
            <Campo label="Sobrenome" name="sobrenome" value={form.sobrenome} onChange={handleChange} />
          </div>

          {!editando && (
            <Campo
              label="Data de Nascimento"
              name="dataNascimento"
              type="date"
              value={form.dataNascimento}
              onChange={handleChange}
            />
          )}

          <Campo label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
          <Campo label="Telefone/Celular" name="telCelular" value={form.telCelular} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Login" name="login" value={form.login} onChange={handleChange} />
            {!editando && (
              <Campo label="Senha" name="senha" type="password" value={form.senha} onChange={handleChange} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Campo label="Cargo" name="cargo" value={form.cargo} onChange={handleChange} />
            <div>
              <label className="block text-sm text-slate-600 mb-1">Nível de Acesso</label>
              <select
                name="nivelAcesso"
                value={form.nivelAcesso}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>1 - Operador</option>
                <option value={2}>2 - Administrador</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => setMostrarForm(false)}
              className="flex-1 border border-slate-300 text-slate-600 rounded-lg py-2 font-medium hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Login</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Nível</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {operadores.map((op) => (
              <tr key={op.idOperador} className="border-t">
                <td className="px-4 py-3">{op.nome} {op.sobrenome}</td>
                <td className="px-4 py-3">{op.login}</td>
                <td className="px-4 py-3">{op.cargo}</td>
                <td className="px-4 py-3">{op.nivelAcesso}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      op.ativo
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {op.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => abrirEdicao(op)}
                      title="Editar"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => alternarStatus(op)}
                      title={op.ativo ? "Desativar" : "Ativar"}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 ${
                        op.ativo ? "text-red-500" : "text-emerald-500"
                      }`}
                    >
                      {op.ativo ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default AbaOperadores;