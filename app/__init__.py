import os
from datetime import datetime

from flask import Flask


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "ganti-di-produksi")

    from .blueprints.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from .blueprints.pages import bp as pages_bp
    app.register_blueprint(pages_bp)

    @app.context_processor
    def inject_globals():
        return {
            "current_year": datetime.now().year,
            "company_name": os.environ.get("COMPANY_NAME", "[NAMA PERUSAHAAN]"),
            "app_version": "0.1.0",
            "legal_updated": "23 November 2026",
            "hr_email": os.environ.get("HR_EMAIL", "[EMAIL HR]"),
            "hr_phone": os.environ.get("HR_PHONE", "[NOMOR TELEPON HR]"),
            "hr_hours": os.environ.get("HR_HOURS", "Senin–Jumat, 08.00–17.00"),
            "hr_address": os.environ.get("HR_ADDRESS", "[ALAMAT KANTOR]"),
        }

    return app
