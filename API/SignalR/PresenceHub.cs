using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync(){

           var isOnline= await _tracker.UserConnected(Context.User.GetUsername(),Context.ConnectionId);
           if (isOnline)
           {
               await Clients.Others.SendAsync("UserIsOnline",Context.User.GetUsername());
           }
            

            var currentUsers=await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers",currentUsers);
            //await Clients.All.SendAsync("GetOnlineUsers",currentUsers);//para mostrar a 
            //todos user quien esta conectado

        }
        //para poder conocer quien esta conectado y quien no usaremos u diccionario clave valor
         public override async Task OnDisconnectedAsync(Exception exception){
             
           var isOffline= await _tracker.UserDisconnected(Context.User.GetUsername(),
           Context.ConnectionId); 

           if (isOffline)
           {
                await Clients.Others.SendAsync("UserIsOffline",Context.User.GetUsername());
           }
           

            // var currentUsers=await _tracker.GetOnlineUsers();
            // await Clients.All.SendAsync("GetOnlineUsers",currentUsers);//para mostrar a 
            //todos user quien esta desconectado pensar si GetOfflineUsers aunque no hay metodo

            await base.OnDisconnectedAsync(exception);
        }

    }
}