from flask import flash, render_template, request

from . import bp


@bp.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # TODO: ganti dengan validasi user + role (Flask-Login) pada tahap Auth.
        flash("Tampilan saja: proses login belum dibuat.")
        # Turbo mewajibkan: jika form gagal, balas 422 (jika sukses, redirect dengan kode 303).
        return render_template("login.html"), 422
    return render_template("login.html")
