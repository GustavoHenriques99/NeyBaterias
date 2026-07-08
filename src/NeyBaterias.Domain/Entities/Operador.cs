namespace NeyBaterias.Domain.Entities
{
    // Esta classe representa a tabela "usuario" no BANCO.
    // A class se refere ao operador/ funcionario do sistema não  ao Cliente!!!
    public class Operador
    {
        public int IdOperador {get; set;}
        public string Nome {get; set;} = string.Empty; //String.empty, é uma string vazia -> estamos atribui uma valor inicial (string?)
        public string Sobrenome {get; set;} = string.Empty;
        
    }
}