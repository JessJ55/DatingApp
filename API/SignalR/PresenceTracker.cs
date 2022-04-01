using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.SignalR
{
    public class PresenceTracker
    {
        /*el dictio se comparte con todos los users que se conecten a nuestro server
        si los users actualizan al mismo tiempo = problemas = solu es bloquearlo
        Ademas el dictionario se comporta como un singleton */
        private static readonly Dictionary<string, List<string>> OnlineUsers =
        new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)//Task
        {
            bool isOnline=false;
            lock (OnlineUsers)//bloqueo nuestro 
            {
                if (OnlineUsers.ContainsKey(username))
                {
                    OnlineUsers[username].Add(connectionId);
                }
                else
                {
                    OnlineUsers.Add(username, new List<string> { connectionId });
                    isOnline=true;
                }

            }

            return Task.FromResult(isOnline); 
            //Task.CompletedTask;
        }



        public Task<bool> UserDisconnected(string username, string connectionId)//Task
        {
            bool isOffline=false;
            lock (OnlineUsers)//bloqueo nuestro 
            {
                if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                OnlineUsers[username].Remove(connectionId);
                if (OnlineUsers[username].Count == 0)
                {
                    OnlineUsers.Remove(username);
                    isOffline=true;
                }
            }
            return Task.FromResult(isOffline);

        }


        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            lock (OnlineUsers)
            {
                onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        }


        public Task<List<string>> GetConnectionsForUser(string username)
        {
            List<string> connectionIds;
            lock(OnlineUsers){
                connectionIds=OnlineUsers.GetValueOrDefault(username);


            }

            return Task.FromResult(connectionIds);
        }

    }

}