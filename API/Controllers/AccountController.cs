using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        public AccountController(DataContext context,ITokenService tokenService)
        {
            _tokenService = tokenService;
            _context = context;
        }

        /*Al enviar la request con info en el cuerpo(body) los paramatros deben ser
        objetos para que obtengan los valores pues sino se quedan a null*/
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if(await UserExist(registerDto.Username)) return BadRequest("UserName is taken");
            
            using var hmac=new HMACSHA512();//el using es para que lo elimine correctamente
            var user =new AppUser
            {
                UserName=registerDto.Username.ToLower(),
                PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt=hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return new UserDto
            {
                Username=user.UserName,
                Token=_tokenService.CreateToken(user)
            };

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user= await _context.Users
            .SingleOrDefaultAsync(x=> x.UserName == loginDto.Username);
            if(user==null) return Unauthorized("Invalid username");
            
            using var hmac= new HMACSHA512(user.PasswordSalt);

            var computeHash =hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for(int i=0; i< computeHash.Length; i++){
                if(computeHash[i]!= user.PasswordHash[i]) return Unauthorized("Invalid password");
            }
            return new UserDto
            {
                Username=user.UserName,
                Token=_tokenService.CreateToken(user)
            };
        }
        private async Task<bool> UserExist(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower()); 
        }
    }
}