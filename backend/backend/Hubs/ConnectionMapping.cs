using System.Collections.Generic;
using System.Linq;

namespace backend.Hubs
{
    public class ConnectionMapping<T>
    {
        private readonly Dictionary<T, HashSet<string>> _connections =
            new Dictionary<T, HashSet<string>>();

        public int Count
        {
            get
            {
                return _connections.Count;
            }
        }

        public void Add(T key, string connectionId)
        {
            if (key == null)
            {
                // Xử lý trường hợp key là null (tuỳ theo logic của bạn)
                // Ví dụ: throw new ArgumentNullException("key");
            }
            else
            {
                lock (_connections)
                {
                    if (!_connections.ContainsKey(key))
                    {
                        _connections[key] = new HashSet<string>();
                    }

                    _connections[key].Add(connectionId);
                }
            }
        }


        public IEnumerable<string> GetConnections(T key)
        {
            HashSet<string> connections;
            if (_connections.TryGetValue(key, out connections))
            {
                return connections;
            }

            return Enumerable.Empty<string>();
        }

        public void Remove(T key, string connectionId)
        {
            lock (_connections)
            {
                HashSet<string> connections;
                if (!_connections.TryGetValue(key, out connections))
                {
                    return;
                }

                lock (connections)
                {
                    connections.Remove(connectionId);

                    if (connections.Count == 0)
                    {
                        _connections.Remove(key);
                    }
                }
            }
        }
    }
}
