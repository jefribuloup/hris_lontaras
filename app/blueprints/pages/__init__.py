# ==============================================================
# NAMA FILE : app/blueprints/pages/__init__.py
# FUNGSI    : Mendefinisikan blueprint "pages" (halaman informasi).
# CATATAN   : Folder app/blueprints/pages/ harus ada, karena
#             app/__init__.py meng-import blueprint ini.
# ==============================================================

from flask import Blueprint

bp = Blueprint("pages", __name__)

from . import views  # noqa: E402,F401
