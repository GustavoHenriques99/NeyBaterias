import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../services/api";

function Login() {
  const [loginUsuario, setLoginUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [entrando, setEntrando] = useState(false);
  const [mostrarAjudaSenha, setMostrarAjudaSenha] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessaoExpirada = searchParams.get("sessaoExpirada") === "1";

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setEntrando(true);

    try {
      await login(loginUsuario, senha);
      navigate("/");
    } catch (err) {
      setErro(err.message);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center mb-6">NeyBaterias</h1>

        {sessaoExpirada && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
            Sua sessão expirou. Faça login novamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Login</label>
            <input
              type="text"
              required
              autoFocus
              value={loginUsuario}
              onChange={(e) => setLoginUsuario(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm text-slate-600">Senha</label>
              <button
                type="button"
                onClick={() => setMostrarAjudaSenha((v) => !v)}
                className="text-xs text-blue-600 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>
            {mostrarAjudaSenha && (
              <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-2">
                Fale com o administrador do sistema — ele pode redefinir sua senha em Configurações → Operadores.
              </p>
            )}
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <button
            type="submit"
            disabled={entrando}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
