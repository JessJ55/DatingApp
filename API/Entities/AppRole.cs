using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppRole : IdentityRole<int>
    {
        //interconectar las 3 clases(2 entidades y la clase para enlazarlas)
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}