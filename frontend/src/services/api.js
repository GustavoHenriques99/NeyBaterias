const API_BASE_URL = "http://localhost:5001/api";

function getToken() {
  return localStorage.getItem("token");
}

function headersComAuth(extra = {}) {
  const token = getToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: headersComAuth(),
  });
  if (!response.ok) {
    throw new Error(`Erro ao buscar ${endpoint}`);
  }
  return response.json();
}


async function post(endpoint, dados) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: headersComAuth({ "Content-Type": "application/json" }),
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro || erro?.title || `Erro ao salvar em ${endpoint}`);
  }

  return response.json();
}

// Funções de autenticação
export async function login(loginUsuario, senha) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: loginUsuario, senha }),
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro || "Login ou senha inválidos.");
  }

  const dados = await response.json();
  localStorage.setItem("token", dados.token);
  localStorage.setItem("usuario", JSON.stringify({ nome: dados.nome, cargo: dados.cargo, nivelAcesso: dados.nivelAcesso }));
  return dados;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

export function getUsuarioLogado() {
  const dados = localStorage.getItem("usuario");
  return dados ? JSON.parse(dados) : null;
}

export function estaAutenticado() {
  return Boolean(getToken());
}


export function getProdutos() {
  return get("/produtos");
}

export function getVendas() {
  return get("/vendas");
}

export function getSaldoEstoque() {
  return get("/estoque/saldo");
}

export function getMovimentosEstoque() {
  return get("/estoque/movimentos");
}

export function getMovimentosPorProduto(idProduto) {
  return get(`/estoque/movimentos/produto/${idProduto}`);
}

// Funções de fornecedores
export function getFornecedores() {
  return get("/fornecedores");
}

export function criarFornecedor(dados) {
  return post("/fornecedores", dados);
}

// Funções de compra de reposição (entrada de estoque)
export function getComprasReposicao() {
  return get("/comprasreposicao");
}

export function criarCompraReposicao(dados) {
  return post("/comprasreposicao", dados);
}

export function criarProduto(dados) {
  return post("/produtos", dados);
}

export function getServicos() {
  return get("/servicos");
}

export function criarServico(dados) {
  return post("/servicos", dados);
}


//Funçoes do cliente
export function getClientes() {
  return get("/clientes");
}

export function criarClienteFisico(dados) {
  return post("/clientes/fisico", dados);
}

export function criarClienteJuridico(dados) {
  return post("/clientes/juridico", dados);
}

// Funções de vendas
export function criarVenda(dados) {
  return post("/vendas", dados);
}

export function getOperadores() {
  return get("/operador");
}

export function getFormasPagamento() {
  return get("/formaspagamento");
}

export function getItens() {
  return get("/itens");
}