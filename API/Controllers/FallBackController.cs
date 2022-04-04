using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /*Para el error de actualizar y no encuentre la ruta de angular usaremos un controlador de reserva
    que hacer para cuando no encuentre la ruta*/
    public class FallBackController : Controller
    {
        public ActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot","index.html"),"text/HTML");
        }
    }
}