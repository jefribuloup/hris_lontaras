from flask import Blueprint

bp = Blueprint("pages", __name__)

from . import views  # noqa: E402,F401
