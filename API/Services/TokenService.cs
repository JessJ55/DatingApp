using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;//la misma clave se usa para ambos token cifrar/descifrar
        private readonly UserManager<AppUser> _userManager;
        public TokenService(IConfiguration config,UserManager<AppUser> userManager)
        {
            _userManager = userManager;
           _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }

        public async Task<string> CreateToken(AppUser user)//antes de usar los roles y userManager era string solo
        {
            var claims= new List<Claim>{//reclamos del header 
                new Claim(JwtRegisteredClaimNames.NameId,user.Id.ToString()),
                 new Claim(JwtRegisteredClaimNames.UniqueName,user.UserName)
            };
            var roles=await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var creds=new SigningCredentials(_key,SecurityAlgorithms.HmacSha512Signature);//firma el token

            var tokenDescriptor = new SecurityTokenDescriptor{
                Subject= new ClaimsIdentity(claims),
                Expires=DateTime.Now.AddDays(7),
                SigningCredentials=creds
            };
            var TokenHandler=new JwtSecurityTokenHandler();
            var token=TokenHandler.CreateToken(tokenDescriptor);
            return TokenHandler.WriteToken(token);

        }
    }
}