using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Entities;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)//DataContext context
        {
            if (await userManager.Users.AnyAsync()) return;
            {
                var userData=await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
                var users=  JsonSerializer.Deserialize<List<AppUser>>(userData);
                if(users==null) return;

                var roles=new List<AppRole> {
                    new AppRole{Name="Member"},
                    new AppRole{Name="Admin"},
                    new AppRole{Name="Moderator"},
                };

                foreach (var role in roles)
                {
                    await roleManager.CreateAsync(role);
                }
                
                foreach (var user in users)
                {
                    //using var hmac=new HMACSHA512();
                    user.Photos.First().IsApproved = true;//para photoschalenge
                    user.UserName=user.UserName.ToLower();
                    await userManager.CreateAsync(user,"Passw0rd");//se encarga de guardar los cambios el solo
                    // user.PasswordSalt=hmac.Key;
                    // user.PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes("Passw0rd"));
                    //cuando cree los datos de bd fueron PAssw0rd
                    await userManager.AddToRoleAsync(user,"Member");
                   //await context.Users.AddAsync(user);
                }

                var admin=new AppUser{
                    UserName="admin"
                };

                await userManager.CreateAsync(admin,"Passw0rd");
                await userManager.AddToRolesAsync(admin, new [] {"Admin","Moderator"});
            }


            //await context.SaveChangesAsync();
        }
    }
}