using backend.Data;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNet.SignalR.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;
using System.Xml.Linq;

namespace backend.Hubs
{
    public class Hubs : Hub
    {
        private readonly static ConnectionMapping<string> _connections =
            new ConnectionMapping<string>();
        private readonly Dictionary<string, string> userConnections = new Dictionary<string, string>();
        private readonly Dictionary<string, string> pendingConnections = new Dictionary<string, string>();


        public async Task ConnectToChat(string userId)
        {
            // Khi người dùng kết nối, lưu thông tin kết nối của họ
            var connectionId = Context.ConnectionId;
            userConnections[userId] = connectionId;

            // Gửi thông báo cho người dùng vừa kết nối rằng họ đã kết nối thành công
            await Clients.Client(connectionId).SendAsync("ConnectedToChat", userId);
        }

        public void SendChatMessage(string who, string message)
        {

            foreach (var connectionId in _connections.GetConnections(who))
            {
                Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
            }
        }

        public async Task SendConnectionRequest(string fromUserId, string toUserId)
        {
            try
            {
                foreach (var connectionId in _connections.GetConnections(toUserId))
                {
                    await Clients.Client(connectionId).SendAsync("ConnectionRequest", fromUserId);
                }
                return;
                foreach (var entry in userConnections)
                {
                    string userId = entry.Key;
                    string connectionId = entry.Value;

                    // In ra màn hình hoặc ghi vào log
                    Console.WriteLine($"User: {userId}, Connection ID: {connectionId}");
                }
                if (!userConnections.ContainsKey(fromUserId) || !userConnections.ContainsKey(toUserId))
                {
                    var _fromConnectionId = userConnections[fromUserId];
                    await Clients.Client(_fromConnectionId).SendAsync("ConnectedToChat", "You are not connected to the chat.");
                    // Xử lý người dùng không tồn tại hoặc không kết nối
                    return;
                }

                var fromConnectionId = userConnections[fromUserId];
                var toConnectionId = userConnections[toUserId];

                // Kiểm tra xem yêu cầu đã tồn tại hoặc không
                if (pendingConnections.ContainsKey(fromUserId) && pendingConnections[fromUserId] == toUserId)
                {
                    // Người B đã đồng ý kết nối
                    await Clients.Client(fromConnectionId).SendAsync("ConnectionAccepted", toUserId);
                    await Clients.Client(toConnectionId).SendAsync("ConnectionAccepted", fromUserId);
                    pendingConnections.Remove(fromUserId);
                }
                else
                {
                    // Gửi yêu cầu kết nối tới người B
                    await Clients.Client(toConnectionId).SendAsync("ConnectionRequest", fromUserId);
                    pendingConnections[fromUserId] = toUserId;
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi ở đây, ví dụ: ghi log lỗi
                Console.WriteLine(ex.ToString());
            }
        }

        public async Task RefuseConnectionRequest(string fromUserId, string toUserId)
        {
            foreach (var connectionId in _connections.GetConnections(toUserId))
            {
                await Clients.Client(connectionId).SendAsync("ConnectionRefused", fromUserId);
            }
            foreach (var connectionId in _connections.GetConnections(fromUserId))
            {
                await Clients.Client(connectionId).SendAsync("ConnectionRefused", toUserId);
            }

            return;
            // Kiểm tra xem yêu cầu kết nối tồn tại hoặc không
            if (pendingConnections.ContainsKey(toUserId) && pendingConnections[toUserId] == fromUserId)
            {
                var fromConnectionId = userConnections[fromUserId];
                var toConnectionId = userConnections[toUserId];

                // Người B đồng ý kết nối
                await Clients.Client(fromConnectionId).SendAsync("ConnectionAccepted", toUserId);
                await Clients.Client(toConnectionId).SendAsync("ConnectionAccepted", fromUserId);
                pendingConnections.Remove(toUserId);
            }
        }

        public async Task AcceptConnectionRequest(string fromUserId, string toUserId)
        {
            foreach (var connectionId in _connections.GetConnections(toUserId))
            {
                await Clients.Client(connectionId).SendAsync("ConnectionAccepted", fromUserId);
            }
            foreach (var connectionId in _connections.GetConnections(fromUserId))
            {
                await Clients.Client(connectionId).SendAsync("ConnectionAccepted", toUserId);
            }

            return;
            // Kiểm tra xem yêu cầu kết nối tồn tại hoặc không
            if (pendingConnections.ContainsKey(toUserId) && pendingConnections[toUserId] == fromUserId)
            {
                var fromConnectionId = userConnections[fromUserId];
                var toConnectionId = userConnections[toUserId];

                // Người B đồng ý kết nối
                await Clients.Client(fromConnectionId).SendAsync("ConnectionAccepted", toUserId);
                await Clients.Client(toConnectionId).SendAsync("ConnectionAccepted", fromUserId);
                pendingConnections.Remove(toUserId);
            }
        }

        public Task OnConnected(string name)
        {
            //string name = Context.User.Identity.Name;

            _connections.Add(name, Context.ConnectionId);

            return Clients.Client(Context.ConnectionId).SendAsync("ConnectedToChat", name);
        }
    }
}
