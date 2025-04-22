using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace Bussiness.WebSocketManagement
{
    public class WebSocketNotification
    {
        private WebSocket? _webSocket;

        // WebSocket bağlantısını eklemek
        public void SetWebSocket(WebSocket webSocket)
        {
            if (webSocket == null)
            {
                Console.WriteLine("SetWebSocket called with null WebSocket.");
                return;
            }
            if (_webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                _webSocket.Abort();
                _webSocket.Dispose();
                Console.WriteLine("Old WebSocket connection aborted.");
            }

            _webSocket = webSocket;
            Console.BackgroundColor = ConsoleColor.Blue;
            Console.WriteLine($"WebSocket set: {_webSocket?.State}");
        }

        // WebSocket bağlantısını kaldırmak
        public void RemoveWebSocket()
        {
            Console.BackgroundColor = ConsoleColor.Red;
            Console.WriteLine($"WebSocket removed: {_webSocket?.State}");
            _webSocket = null;
        }

        // Mesajı gönder
        public async Task SendMessageAsync(string message)
        {
            if (_webSocket != null && _webSocket.State == WebSocketState.Open)
            {
                var messageBytes = Encoding.UTF8.GetBytes(message);
                await _webSocket.SendAsync(
                    new ArraySegment<byte>(messageBytes, 0, messageBytes.Length),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None
                );
            }
            else
            {
                Console.WriteLine("No active WebSocket connection.");
            }
        }
    }

}
