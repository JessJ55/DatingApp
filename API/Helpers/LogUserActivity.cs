using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
           var resiltContext=await next();

           if (!resiltContext.HttpContext.User.Identity.IsAuthenticated)  return;
           
           var userId=resiltContext.HttpContext.User.GetUserId();
           //var repo=resiltContext.HttpContext.RequestServices.GetService<IUserRepository>();
           var uow=resiltContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
           var user=await uow.UserRepository.GetUserByIdAsync(userId);

           user.LastActive=DateTime.UtcNow;
           await uow.Complete();
           
        }
    }
}