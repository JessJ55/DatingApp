using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser: IdentityUser<int>
    {
        //las propiedades comentadas vienen heredadas de la interface
        //IdendityUser
        // public int Id { get; set; }
        // public string UserName { get; set; }

        // public byte[] PasswordHash { get; set; }
        // public byte[] PasswordSalt { get; set; }

        public DateTime DateofBirth { get; set; }
        //string? es para decirle que puede ser nullable pero solo si pone en api.csproj
        // <Nullable>enable</Nullable> dentro de propertygroup sino sale error
        public string KnownAs { get; set; }
        public DateTime Create { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public ICollection<Photo> Photos { get; set; }

        // public int GetAge()
        // {
        //     return DateofBirth.CalculateAge();
        // }


        public ICollection<UserLike> LikedByUsers { get; set; }
        public ICollection<UserLike> LikedUsers { get; set; }

        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }

        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}