from flask import render_template

from . import bp


@bp.route("/kebijakan-privasi")
def privacy():
    return render_template("pages/privacy.html")


@bp.route("/syarat-ketentuan")
def terms():
    return render_template("pages/terms.html")


@bp.route("/pusat-bantuan")
def help_center():
    return render_template("pages/help.html")


@bp.route("/hubungi-hr")
def contact():
    return render_template("pages/contact.html")
