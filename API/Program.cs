// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using API.Data;
// using API.Entities;
// using API.Extensions;
// using API.Middleware;
// using API.SignalR;
// using Microsoft.AspNetCore.Builder;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Hosting;
// using Microsoft.Extensions.Logging;

//cambios para dotnet 6

var builder = WebApplication.CreateBuilder(args);

//añadimos servicios to the container
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddCors();
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSignalR();//servicio para mensajes en directo

//Configururar the Http request pipeline

var app=builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
            
app.UseHttpsRedirection();
//app.UseRouting();

app.UseCors(x => x.AllowAnyHeader()
.AllowAnyMethod()
.AllowCredentials()//para permitir a los mensajes enviar datos para hablar en directo
.WithOrigins("https://localhost:4200"));
           
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();
           
app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");
app.MapFallbackToController("Index", "Fallback");
            
 AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior",true);//dotnet 6.0
//var host = CreateHostBuilder(args).Build();
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context=services.GetRequiredService<DataContext>();
    var userManager=services.GetRequiredService<UserManager<AppUser>>();
    var roleManager=services.GetRequiredService<RoleManager<AppRole>>();

    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager,roleManager);
    //await Seed.SeedUsers(context);
}
catch (Exception ex)
{
    var logger=services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An error occurred during migration");
}
await app.RunAsync();
// namespace API
// {
//     public class Program
//     {
//         public static async Task Main(string[] args)
//         {
//             AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior",true);//dotnet 6.0
//             var host = CreateHostBuilder(args).Build();
//             using var scope = host.Services.CreateScope();
//             var services = scope.ServiceProvider;
//             try
//             {
//                 var context=services.GetRequiredService<DataContext>();
//                 var userManager=services.GetRequiredService<UserManager<AppUser>>();
//                 var roleManager=services.GetRequiredService<RoleManager<AppRole>>();

//                 await context.Database.MigrateAsync();
//                 await Seed.SeedUsers(userManager,roleManager);
//                 //await Seed.SeedUsers(context);
//             }
//             catch (Exception ex)
//             {
//                 var logger=services.GetRequiredService<ILogger<Program>>();
//                 logger.LogError(ex,"An error occurred during migration");
//             }

//             await host.RunAsync();
//         }

//         public static IHostBuilder CreateHostBuilder(string[] args) =>
//             Host.CreateDefaultBuilder(args)
//                 .ConfigureWebHostDefaults(webBuilder =>
//                 {
//                     webBuilder.UseStartup<Startup>();
//                 });
//     }
// }
