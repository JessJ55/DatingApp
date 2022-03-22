using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MemberDto
    {
         public int Id { get; set; }
        public string Username { get; set; }

        public string  PhotoUrl { get; set; }
      
        public int Age { get; set; }//gracias al Automap ira a leer en appUser un method getAge
        public string KnownAs { get; set; }
        public DateTime Create { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
        
    }
}