import os
from datetime import datetime

from flask import Flask


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "ganti-di-produksi")

    from .blueprints.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    @app.context_processor
    def inject_globals():
        return {
            "current_year": datetime.now().year,
            "company_name": os.environ.get("COMPANY_NAME", "[NAMA PERUSAHAAN]"),
            "app_version": "0.1.0",
        }

    return app
