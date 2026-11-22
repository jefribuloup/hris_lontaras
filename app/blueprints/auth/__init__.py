# ==============================================================
# NAMA FILE : app/blueprints/auth/__init__.py
# FUNGSI    : Mendefinisikan blueprint "auth" (halaman login).
# CATATAN   : Nama blueprint harus "auth" (bukan "pages").
# ==============================================================

from flask import Blueprint

bp = Blueprint("auth", __name__)

from . import views  # noqa: E402,F401
