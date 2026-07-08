namespace NeyBaterias.Application.Operadores
{
    //Definindo a obrigatoriedade de preenchimento no cadastro dos operadores.
    public class CadastroOperadorValidacao
    {
        public void Validar(string nome, string sobrenome)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ArgumentException("Nome é obrigatório.");

            if (string.IsNullOrWhiteSpace(sobrenome))
                throw new ArgumentException("Sobrenome é obrigatório.");
        }
    }
}