namespace NeyBaterias.Application.DTOs
{
    // public class AuthDTOs
    // {
        
    // }

    public class LoginDto
    {
        public string Login { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    public class LoginRespostaDto
    {
        public string Token { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Cargo { get; set; } = string.Empty;
        public int NivelAcesso { get; set; }
    }
}