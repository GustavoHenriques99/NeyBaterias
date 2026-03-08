namespace SistemaNB
{
    public class Usuario
    {

        //Declarando as variaveis
        public String nome { get; set; }
        public String sobrenome { get; set; }
        public DateTime dataNascimento { get; set; } // para receber a data de nascimento do usuario
        public String sexo { get; set; }
        public String telefone { get; set; }
        public String login { get; set; }
        public String senha { get; set; }
        public DateTime dataAdmissao { get; set; } // para receber a data de admissão do usuario
        public String cargo { get; set; }
        public bool ativo { get; set; } // para indicar se o usuario está ativo ou não

        //Criando o construtor da classe Usuario
        public Usuario(String nome, String sobrenome, DateTime dataNascimento, String sexo, String telefone, String login, String senha, DateTime dataAdmissao, String cargo)
        {
            this.nome = nome;
            this.sobrenome = sobrenome;
            this.dataNascimento = dataNascimento;
            this.sexo = sexo;
            this.telefone = telefone;
            this.login = login;
            this.senha = senha;
            this.dataAdmissao = dataAdmissao;
            this.cargo = cargo;
            this.ativo = true; // por padrão, o usuario é cadastrado como ativo
        }

        //Criando o método para coletar as informações do usuario
        public static Usuario cadastrarUsuario()
        {
            Console.WriteLine("\n=== CADASTRO DE USUARIO ===");
            Console.Write("Digite seu nome: ");
            string nome = Console.ReadLine() ?? "";

            Console.Write("Digite o sobrenome: ");
            string sobrenome = Console.ReadLine() ?? "";

            Console.Write("Digite a data de nascimento (dd/MM/yyyy): ");
            DateTime dataNascimento;
            while (!DateTime.TryParseExact(Console.ReadLine(), "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out dataNascimento))
            {
                Console.Write("Data inválida. Digite a data de nascimento (dd/MM/yyyy): ");
            }

            Console.Write("Digite o sexo (M/F): ");
            string sexo = (Console.ReadLine() ?? "").ToUpper();
            while (sexo != "M" && sexo != "F")
            {
                Console.Write("Sexo inválido. Digite o sexo (M/F): ");
                sexo = (Console.ReadLine() ?? "").ToUpper();
            }

            Console.Write("Digite o telefone: ");
            string telefone = Console.ReadLine() ?? "";

            Console.Write("Digite o login: ");
            string login = Console.ReadLine() ?? "";

            Console.Write("Digite a senha: ");
            string senha = Console.ReadLine() ?? "";

            Console.Write("Digite a data de admissão (dd/MM/yyyy): ");
            DateTime dataAdmissao;
            while (!DateTime.TryParseExact(Console.ReadLine(), "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out dataAdmissao))
            {
                Console.Write("Data inválida. Digite a data de admissão (dd/MM/yyyy): ");
            }

            Console.Write("Digite o cargo: ");
            string cargo = Console.ReadLine() ?? "";

            return new Usuario(nome, sobrenome, dataNascimento, sexo, telefone, login, senha, dataAdmissao, cargo);

        }

        public static void exibirUsuario(Usuario usuario)
        {
            Console.WriteLine("\n== Informações do Usuario ==");
            Console.WriteLine($"Nome: {usuario.nome} {usuario.sobrenome}");
            Console.WriteLine($"Data de Nascimento: {usuario.dataNascimento:dd/MM/yyyy}");
            Console.WriteLine($"Sexo: {usuario.sexo}");
            Console.WriteLine($"Telefone: {usuario.telefone}");
            Console.WriteLine($"Login: {usuario.login}");
            // NÃO EXIBIR A SENHA POR QUESTÕES DE SEGURANÇA
            Console.WriteLine($"Data de Admissão: {usuario.dataAdmissao:dd/MM/yyyy}");
            Console.WriteLine($"Cargo: {usuario.cargo}");
            Console.WriteLine($"Ativo: {(usuario.ativo ? "Sim" : "Não")}");
        }

    }
}