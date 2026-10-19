using System.ComponentModel;
using System.Data.SqlTypes;
using MySqlConnector;

public partial class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        app.UseSwagger();
        app.UseSwaggerUI();

        string dadosConexao = "Server=localhost; Database=rebortec_db;UID=root;Pwd=980114;";

        app.MapGet("/api/calculo-iva", (double valorBase) =>
        {
            double valorIVA = valorBase * 0.23;
            double total = valorBase + valorIVA;

            return Results.Ok(new
            {
                Mensagem = "Cálculo efetuado com sucesso!",
                Base = valorBase,
                IVA = valorIVA,
                Total = total
            });
        });

        app.MapGet("/Api/clientes", async () =>
        {
            var lista = new List<object>();

            using var ligacao = new MySqlConnection(dadosConexao);
            await ligacao.OpenAsync();

            using var comando = new MySqlCommand("SELECT id, nome, nif FROM clientes", ligacao); //mais tarde tentar colocar o "from cliente" fora dos apostrofo
            using var leitor = await comando.ExecuteReaderAsync();

            while (await leitor.ReadAsync())
            {
                lista.Add(new
                {
                    ID = leitor.GetInt32("id"),
                    Nome = leitor.GetString("nome"),
                    Nif = leitor.GetString("nif"), //Acrescentei a virgula, retirar caso desnecesario

                });
            }
            return Results.Ok(lista);
        });
        
        app.MapPost("/api/clientes", async ( NovoCliente dados) =>
        {

            if (string.IsNullOrWhiteSpace(dados.Nif) || dados.Nif.Length != 9)
            {
                return Results.BadRequest("Erro: O NIF tem de ter extamente 9 dígitos.");
            }
            using var ligacao = new MySqlConnection(dadosConexao);
            await ligacao.OpenAsync();

            string sql = "INSERT INTO clientes (nome,nif) VALUES (@nome, @nif)";
            using var comando = new MySqlCommand(sql, ligacao);
            comando.Parameters.AddWithValue("@nome", dados.Nome);
            comando.Parameters.AddWithValue("@nif", dados.Nif);
            await comando.ExecuteNonQueryAsync();

            return Results.Ok("Cliente guardado no MySQL com sucesso!"); ;

        });

        app.Run();
    }

    public record NovoCliente(string Nome, string Nif);
}