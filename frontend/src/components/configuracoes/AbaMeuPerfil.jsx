import { useEffect, useState } from "react";
import { getMeuPerfil, alterarMinhaSenha } from "../../services/api";

function AbaMeuPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroSenha, setErroSenha] = useState(null);
  const [sucessoSenha, setSucessoSenha] = useState(false);

  useEffect(() => {
    getMeuPerfil()
      .then(setPerfil)
      .catch((err) => setErro(err.message))
      .finally(() => setCarregando(false));
  }, []);

  async function handleTrocarSenha(e) {
    e.preventDefault();
    setErroSenha(null);
    setSucessoSenha(false);

    if (novaSenha !== confirmarSenha) {
      setErroSenha("A confirmação não bate com a nova senha.");
      return;
    }

    setSalvando(true);
    try {
      await alterarMinhaSenha({ senhaAtual, novaSenha });
      setSucessoSenha(true);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      setErroSenha(err.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="text-slate-400">Carregando perfil...</p>;
  if (erro) return <p className="text-red-600">{erro}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
      {/* Dados do perfil (somente leitura por enquanto) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Meus Dados</h2>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">Nome</dt>
            <dd className="text-slate-800 font-medium">{perfil.nome} {perfil.sobrenome}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Login</dt>
            <dd className="text-slate-800 font-medium">{perfil.login}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-800 font-medium">{perfil.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Cargo</dt>
            <dd className="text-slate-800 font-medium">{perfil.cargo}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Nível de Acesso</dt>
            <dd className="text-slate-800 font-medium">
              {perfil.nivelAcesso >= 2 ? "Administrador" : "Operador"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Trocar senha */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-slate-800 mb-4">Trocar Senha</h2>
        <form onSubmit={handleTrocarSenha} className="space-y-4">
          <Campo
            label="Senha atual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />
          <Campo
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <Campo
            label="Confirmar nova senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          {erroSenha && <p className="text-sm text-red-600">{erroSenha}</p>}
          {sucessoSenha && <p className="text-sm text-emerald-600">Senha alterada com sucesso!</p>}

          <button
            type="submit"
            disabled={salvando}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Alterar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        minLength={type === "password" ? 4 : undefined}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default AbaMeuPerfil;