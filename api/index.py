import os
import sys

# Pastikan folder root proyek bisa di-import di lingkungan Vercel
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402

# Vercel mencari variabel "app" (WSGI) di file ini
app = create_app()
