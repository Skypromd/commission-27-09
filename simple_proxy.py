#!/usr/bin/env python3
"""
Простой HTTP сервер-прокси для обхода ограничений хостов
"""
import http.server
import socketserver
import urllib.request
import urllib.parse
from urllib.error import URLError

class ProxyHTTPRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Проксируем запросы к React dev серверу
            target_url = f"http://localhost:3000{self.path}"
            
            req = urllib.request.Request(target_url)
            
            # Копируем заголовки (кроме Host)
            for header, value in self.headers.items():
                if header.lower() not in ['host', 'connection']:
                    req.add_header(header, value)
            
            response = urllib.request.urlopen(req)
            
            # Отправляем статус
            self.send_response(response.status)
            
            # Копируем заголовки ответа
            for header, value in response.headers.items():
                if header.lower() not in ['connection', 'transfer-encoding']:
                    self.send_header(header, value)
            
            # Добавляем CORS заголовки
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
            self.send_header('Access-Control-Allow-Headers', '*')
            
            self.end_headers()
            
            # Передаем содержимое
            self.wfile.write(response.read())
            
        except URLError as e:
            self.send_error(502, f"Bad Gateway: {e}")
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {e}")

    def do_POST(self):
        self.do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

if __name__ == "__main__":
    PORT = 3002
    with socketserver.TCPServer(("0.0.0.0", PORT), ProxyHTTPRequestHandler) as httpd:
        print(f"🔀 Proxy server запущен на порту {PORT}")
        print(f"Проксирует запросы к http://localhost:3000")
        httpd.serve_forever()