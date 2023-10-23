import http.server
import socketserver

# Define the port you want to run the server on
PORT = 8000

# Create a simple HTTP server
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    # Start the server
    httpd.serve_forever()
