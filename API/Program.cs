using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API
{

    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();//.Run();
            using var scope = host.Services.CreateScope();
            var serices = scope.ServiceProvider;

            try
            {
                var context = serices.GetRequiredService<DataContext>();
                await context.Database.MigrateAsync();
                await Seed.SeedData(context);
            }
            catch (Exception exc)
            {
                var logger = serices.GetRequiredService<ILogger>();
                logger.LogError(exc, "An error occured while migration Db.");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}