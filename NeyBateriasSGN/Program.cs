using SistemaNB;

class Program
{
    static void Main()
    {
        Usuario usuario = Usuario.cadastrarUsuario();

        Usuario.exibirUsuario(usuario);
    }
}