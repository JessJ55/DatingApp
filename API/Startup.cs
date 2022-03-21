using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Extensions;
using API.Interfaces;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;

        }

        //public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //     services.AddScoped<ITokenService,TokenService>();
            //    services.AddDbContext<DataContext>(options =>
            //     {
            //         options.UseSqlite(_config.GetConnectionString("DefaultConnection"));
            //     });
            services.AddApplicationServices(_config);
            services.AddControllers();
            services.AddCors();
            services.AddIdentityServices(_config);
            // services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            // .AddJwtBearer(options =>
            // {
            //     options.TokenValidationParameters = new TokenValidationParameters
            //     {
            //         ValidateIssuerSigningKey= true,
            //         IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokenkey"])),
            //         ValidateIssuer=false,
            //         ValidateAudience=false,
            //     };
            // });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {//super imp ordenar aqui todos los metodos
            app.UseMiddleware<ExceptionMiddleware>();
            // if (env.IsDevelopment())
            // {
            //     //app.UseMiddleware<ExceptionMiddleware>();
            //     app.UseDeveloperExceptionPage();
            //     app.UseSwagger();
            //     app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            // }

            app.UseHttpsRedirection();

            app.UseRouting();
            /*en cors es para resolver el error que nos da por NO permitir los navegadores
            diferentes origenes de rutas por esto debemos usar withorigins con la ruta
            del front-end*/
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins
            ("https://localhost:4200"));//debe revisar el orden y al activar certificado
            //y ser valido la path es https no http
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
