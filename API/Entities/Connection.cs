namespace API.Entities
{
    public class Connection
    {//al ser una entidad necesitamos un entityFramework un ctor default sino= error

        public Connection()
        {
            
        }
        public Connection(string connectionId, string username)
        {
            ConnectionId = connectionId;
            Username = username;
        }

        public string ConnectionId { get; set; }
        public string Username { get; set; }

        
    }
}