from flask import flash, render_template, request

from . import bp


@bp.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # TODO: ganti dengan validasi user + role (Flask-Login) pada tahap Auth.
        flash("Tampilan saja: proses login belum dibuat.")
    return render_template("login.html")
