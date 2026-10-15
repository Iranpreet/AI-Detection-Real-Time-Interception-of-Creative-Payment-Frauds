#!/usr/bin/env python3
"""
ShieldUPI / AI Fraud Shield - Unified Application Launcher
Starts the FastAPI ML backend on http://127.0.0.1:8000 and opens the browser.
"""

import os
import sys
import webbrowser
import time

def main():
    print("==================================================================")
    print("       ShieldUPI | AI Detection of Creative Payment Frauds       ")
    print("                 Project CC6-AI02 - Cybercup 2026                 ")
    print("==================================================================")
    print("1. Loading Scikit-Learn Models & NLP Intent Pipeline...")
    
    # Check if uvicorn is available
    try:
        import uvicorn
        from backend.server import app
        
        port = 8008
        url = f"http://127.0.0.1:{port}"
        print(f"2. Starting ShieldUPI Server on {url}...")
        print(f"3. Opening web interface in your default browser...")
        
        # Open browser in a separate non-blocking call after a small delay
        def open_browser():
            time.sleep(1.2)
            webbrowser.open(url)
            
        import threading
        threading.Thread(target=open_browser, daemon=True).start()
        
        print("\nShieldUPI is running! Press CTRL+C to stop.")
        uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
        
    except ImportError as e:
        print(f"Note: {e}. Launching lightweight Python static HTTP server on port 8080...")
        import http.server
        import socketserver
        
        PORT = 8080
        url = f"http://127.0.0.1:{PORT}"
        print(f"Serving ShieldUPI on {url}")
        
        def open_browser():
            time.sleep(1.0)
            webbrowser.open(url)
            
        import threading
        threading.Thread(target=open_browser, daemon=True).start()
        
        Handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Server active at {url}. Pure Client-Side ML Engine enabled.")
            httpd.serve_forever()

if __name__ == "__main__":
    main()
