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
using AutoMapper;
using Microsoft.AspNetCore.Identity;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        //private readonly DataContext _context;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        public AccountController(UserManager<AppUser> userManager,SignInManager<AppUser> signInManager,
         ITokenService tokenService,IMapper mapper)//DataContext context
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
          //  _context = context;
        }

        /*Al enviar la request con info en el cuerpo(body) los paramatros deben ser
        objetos para que obtengan los valores pues sino se quedan a null*/
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {

            if (await UserExist(registerDto.Username)) return BadRequest("UserName is taken");

            var user = _mapper.Map<AppUser>(registerDto);

            //using var hmac = new HMACSHA512();//el using es para que lo elimine correctamente

            user.UserName=registerDto.Username.ToLower();
            // user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            // user.PasswordSalt=hmac.Key;




            // var user =new AppUser
            // {
            //     UserName=registerDto.Username.ToLower(),
            //     PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            //     PasswordSalt=hmac.Key
            // };
            // _context.Users.Add(user);
            // await _context.SaveChangesAsync();
            var result=await _userManager.CreateAsync(user,registerDto.Password);
            if(!result.Succeeded) return BadRequest(result.Errors);

            var roleResult =await _userManager.AddToRoleAsync(user,"Member");

            if(!roleResult.Succeeded) return BadRequest(result.Errors);

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs=user.KnownAs,
                Gender=user.Gender
            };

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users //antes _context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());//antes sin ToLower

            if (user == null) return Unauthorized("Invalid username");
            var result =await _signInManager.CheckPasswordSignInAsync(user,loginDto.Password,false);

            if(!result.Succeeded) return Unauthorized();

            // using var hmac = new HMACSHA512(user.PasswordSalt);

            // var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            // for (int i = 0; i < computeHash.Length; i++)
            // {
            //     if (computeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            // }

            return new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs=user.KnownAs,
                Gender=user.Gender
            };
        }
        private async Task<bool> UserExist(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());//antes _context
        }
    }
}