import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  Users,
  Truck,
  Settings,
  Wrench,
  PackagePlus,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { getUsuarioLogado, logout } from "../services/api";

const menuItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/servicos", label: "Serviços", icon: Wrench },
  { to: "/estoque", label: "Estoque", icon: Boxes },
  { to: "/vendas", label: "Vendas", icon: ShoppingCart },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/fornecedores", label: "Fornecedores", icon: Truck },
  { to: "/reposicoes", label: "Reposições", icon: PackagePlus },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

function Layout() {
  const usuario = getUsuarioLogado();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleNavClick() {
    // Fecha o menu ao navegar — só importa em telas pequenas (no desktop o
    // menu já fica sempre visível, então isso não afeta nada lá).
    setMenuAberto(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Overlay escurecido atrás do menu, só aparece em telas pequenas quando o menu está aberto */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Menu lateral: vira gaveta deslizante em telas pequenas, fixo a partir de lg */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${menuAberto ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <span className="text-lg font-bold text-white">NeyBaterias</span>
          <button
            onClick={() => setMenuAberto(false)}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {usuario && (
          <div className="px-3 py-4 border-t border-slate-800">
            <div className="px-3 mb-2">
              <p className="text-sm font-medium text-white">{usuario.nome}</p>
              <p className="text-xs text-slate-400">{usuario.cargo}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior — só aparece em telas pequenas, com o botão de abrir o menu */}
        <header className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20">
          <button
            onClick={() => setMenuAberto(true)}
            className="text-slate-600 hover:text-slate-900"
            aria-label="Abrir menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-slate-800">NeyBaterias</span>
          <span className="w-[22px]" />
        </header>

        {/* Conteúdo da página atual */}
        <main className="flex-1 p-3 sm:p-6 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
