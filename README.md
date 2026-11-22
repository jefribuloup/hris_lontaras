# HRIS — Human Resource Information System

Aplikasi HRIS perusahaan untuk mengelola data karyawan, absensi, cuti, payroll, dan proses SDM lainnya.
Dikembangkan bertahap: **Flask + HTML (Jinja2)** untuk MVP, dengan arsitektur yang siap dimigrasi ke **Next.js**.

---

## 1. Tujuan

- Satu sumber data karyawan yang rapi (single source of truth).
- Mengotomasi proses rutin: absensi, cuti, lembur, penggajian.
- Alur persetujuan (approval) yang jelas dan tercatat.
- Dasar yang bisa diperluas: rekrutmen, kinerja, pelatihan.

## 2. Scope Pengembangan

| Fase | Modul | Status |
|------|-------|--------|
| **MVP (Fase 1)** | Auth & Role, Core HR, Absensi, Cuti & Izin, Approval Flow | Direncanakan |
| **Fase 2** | Lembur, Payroll (BPJS, PPh21, slip gaji), Reimburse | Direncanakan |
| **Fase 3** | Rekrutmen & Onboarding, Kinerja (KPI), Pelatihan, Offboarding | Direncanakan |
| **Fase 4** | Migrasi frontend ke Next.js, mobile/PWA, integrasi (fingerprint, WhatsApp, email) | Opsional |

## 3. Tech Stack

**Saat ini (MVP)**
- Backend: Python 3.11+, Flask, Flask-SQLAlchemy, Flask-Migrate (Alembic), Flask-Login
- Frontend: HTML + Jinja2 + CSS (Bootstrap/Tailwind) + sedikit JavaScript
- Database: PostgreSQL (produksi), SQLite (development)
- Lainnya: openpyxl (export Excel), WeasyPrint/ReportLab (slip gaji PDF)

**Target migrasi**
- Frontend: Next.js (React) yang mengonsumsi REST API Flask
- Backend Flask tetap dipakai sebagai API murni (JSON)

## 4. Strategi Agar Mudah Migrasi ke Next.js

1. **Pisahkan logika bisnis dari tampilan.** Semua aturan bisnis ada di `services/`, bukan di route/template.
2. **Buat API JSON sejak awal.** Setiap modul punya blueprint `api` (`/api/v1/...`) selain blueprint halaman HTML.
3. **Gunakan REST yang konsisten**, format respons seragam: `{ "success": true, "data": ..., "message": "" }`.
4. **Autentikasi berbasis session sekarang, siap JWT nanti.** Lapisan auth dibungkus dalam satu modul.
5. **Validasi memakai schema** (Marshmallow/Pydantic) agar kontrak data jelas.
6. Saat migrasi: template Jinja2 diganti halaman Next.js; backend tidak perlu ditulis ulang.

### 4b. Navigasi Tanpa Reload (Turbo Drive)

Semua halaman berpindah tanpa reload penuh memakai [Turbo Drive](https://turbo.hotwired.dev/) (file di `app/static/js/vendor/`, dimuat di `base.html`). Tidak perlu mengubah link atau form yang ada.

- Semua template meng-extend `templates/base.html`; footer ada di `templates/partials/footer.html`.
- CSS/JS khusus halaman diletakkan di `{% block head %}`.
- **Form POST wajib:** jika sukses, `redirect(url, code=303)`; jika gagal validasi, `render_template(...), 422`.
- Script halaman memakai event delegation (lihat `static/js/login.js`), bukan `DOMContentLoaded`.
- Elemen yang harus tetap ada antar halaman (mis. sidebar): beri atribut `data-turbo-permanent` dan `id` tetap.
- Matikan Turbo untuk link tertentu (download, logout): `data-turbo="false"`.
- Saat migrasi ke Next.js, mekanisme ini digantikan router Next.js.

## 5. Struktur Folder

```
hris/
├── app/
│   ├── __init__.py            # app factory
│   ├── config.py
│   ├── extensions.py          # db, migrate, login_manager
│   ├── models/                # SQLAlchemy models per modul
│   │   ├── core.py
│   │   ├── attendance.py
│   │   ├── leave.py
│   │   ├── approval.py
│   │   └── payroll.py
│   ├── services/              # logika bisnis (dipakai HTML & API)
│   ├── schemas/               # validasi & serialisasi
│   ├── blueprints/
│   │   ├── auth/
│   │   ├── core/              # views.py (HTML) + api.py (JSON)
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── approval/
│   │   └── payroll/
│   ├── templates/
│   └── static/
├── migrations/
├── tests/
├── .env.example
├── requirements.txt
├── wsgi.py
└── README.md
```

## 6. Role & Hak Akses

| Role | Akses |
|------|-------|
| **Super Admin** | Semua pengaturan sistem, manajemen user & role |
| **HR Admin** | Kelola data karyawan, verifikasi cuti/lembur, payroll |
| **Manager / Atasan** | Lihat tim, setujui cuti/lembur, nilai kinerja |
| **Karyawan** | Profil sendiri, absen, ajukan cuti/lembur, lihat slip gaji |

Tabel: `users`, `roles`, `permissions`, `role_permissions`.

## 7. Komponen Data & Tabel

> Konvensi: semua tabel punya `id`, `created_at`, `updated_at`; tabel penting memakai `is_active` / soft delete.

### 7.1 Auth & Pengaturan
| Tabel | Kolom utama |
|-------|-------------|
| `users` | id, employee_id, email, password_hash, role_id, is_active, last_login |
| `roles` | id, name, description |
| `permissions` | id, code, description |
| `role_permissions` | role_id, permission_id |
| `audit_logs` | id, user_id, action, table_name, record_id, old_value, new_value, ip_address |
| `notifications` | id, user_id, title, message, is_read, link |

### 7.2 Core HR (Master Data)
| Tabel | Kolom utama |
|-------|-------------|
| `companies` | id, name, address, npwp, logo |
| `branches` | id, company_id, name, address, latitude, longitude, radius_m |
| `departments` | id, company_id, parent_id, name, head_employee_id |
| `positions` | id, department_id, name, grade_id |
| `grades` | id, name, level, min_salary, max_salary |
| `employees` | id, nik_perusahaan, full_name, nik_ktp, gender, birth_place, birth_date, marital_status, religion, phone, personal_email, address, branch_id, department_id, position_id, manager_id, join_date, employment_status, photo, is_active |
| `employee_families` | id, employee_id, name, relationship, birth_date, is_dependent |
| `employee_educations` | id, employee_id, level, institution, major, year_start, year_end |
| `employee_documents` | id, employee_id, doc_type, file_path, expired_at |
| `employment_contracts` | id, employee_id, contract_type (PKWT/PKWTT/Magang), start_date, end_date, salary_basic, status |
| `employee_bank_accounts` | id, employee_id, bank_name, account_no, account_holder |
| `employee_tax_info` | id, employee_id, npwp, ptkp_status, bpjs_kes_no, bpjs_tk_no |

### 7.3 Absensi & Shift
| Tabel | Kolom utama |
|-------|-------------|
| `shifts` | id, name, start_time, end_time, break_minutes, late_tolerance_min |
| `work_schedules` | id, employee_id, shift_id, date |
| `attendances` | id, employee_id, date, check_in, check_out, check_in_lat, check_in_lng, check_in_photo, check_out_lat, check_out_lng, status (hadir/telat/alpa/izin/cuti), late_minutes, work_minutes, source |
| `attendance_corrections` | id, attendance_id, requested_check_in, requested_check_out, reason, approval_request_id |
| `holidays` | id, date, name, type (nasional/cuti bersama/perusahaan) |
| `overtime_requests` | id, employee_id, date, start_time, end_time, total_hours, reason, approval_request_id |

### 7.4 Cuti & Izin
| Tabel | Kolom utama |
|-------|-------------|
| `leave_types` | id, name, default_quota, is_paid, requires_attachment, carry_over_max |
| `leave_balances` | id, employee_id, leave_type_id, year, quota, used, remaining |
| `leave_requests` | id, employee_id, leave_type_id, start_date, end_date, total_days, reason, attachment, status, approval_request_id |

### 7.5 Approval Flow (generik)
| Tabel | Kolom utama |
|-------|-------------|
| `approval_flows` | id, name, request_type (leave/overtime/correction/reimburse), is_active |
| `approval_flow_steps` | id, flow_id, step_order, approver_type (atasan/hr/role/user), approver_ref |
| `approval_requests` | id, flow_id, request_type, request_id, requester_id, current_step, status (pending/approved/rejected/cancelled) |
| `approval_actions` | id, approval_request_id, step_order, approver_id, action, note, acted_at |

### 7.6 Payroll (Fase 2)
| Tabel | Kolom utama |
|-------|-------------|
| `salary_components` | id, name, type (earning/deduction), calc_type (fixed/percent/formula), is_taxable |
| `employee_salaries` | id, employee_id, component_id, amount, effective_date |
| `payroll_periods` | id, month, year, start_date, end_date, status (draft/processed/approved/paid) |
| `payslips` | id, period_id, employee_id, gross, total_deduction, pph21, bpjs_company, bpjs_employee, net_salary |
| `payslip_items` | id, payslip_id, component_id, description, amount |
| `reimbursements` | id, employee_id, category, amount, receipt_file, status, approval_request_id |

### 7.7 Fase 3 (ringkas)
`job_openings`, `applicants`, `interviews`, `onboarding_tasks`, `kpi_periods`, `kpi_items`, `performance_reviews`, `trainings`, `training_participants`, `certifications`, `resignations`, `clearance_items`.

## 8. Relasi Utama (ringkas)

```
companies 1─* branches 1─* employees *─1 departments
employees *─1 positions *─1 grades
employees 1─* employment_contracts / families / educations / documents
employees 1─* attendances / leave_requests / overtime_requests / payslips
employees *─1 employees (manager_id)        -- hirarki atasan
leave_requests / overtime_requests / attendance_corrections
        └── 1─1 approval_requests 1─* approval_actions
```

## 9. Workflow Utama

### 9.1 Onboarding Karyawan Baru
1. HR Admin input data karyawan + kontrak.
2. Sistem membuat akun `users` + role Karyawan.
3. Sistem membuat `leave_balances` sesuai aturan.
4. Karyawan login, melengkapi profil & dokumen.

### 9.2 Absensi Harian
1. Karyawan check-in (waktu server + lokasi/foto) lalu sistem validasi radius cabang & shift.
2. Status otomatis: hadir / telat.
3. Check-out lalu sistem menghitung jam kerja.
4. Lupa absen? Ajukan **koreksi** lalu approval atasan lalu data absensi diperbarui.
5. Akhir hari: job menandai karyawan tanpa absen & tanpa cuti sebagai **alpa**.

### 9.3 Pengajuan Cuti
1. Karyawan pilih jenis cuti + tanggal; sistem cek saldo & bentrok tanggal.
2. Dibuat `approval_requests` (status pending).
3. Atasan setuju/tolak, lalu HR verifikasi (jika diatur di flow).
4. Jika disetujui: saldo berkurang, absensi pada tanggal tersebut berstatus **cuti**.
5. Notifikasi ke karyawan di setiap perubahan status.

### 9.4 Lembur (Fase 2)
Karyawan ajukan, atasan setuju, HR verifikasi, jam lembur masuk perhitungan payroll periode berjalan.

### 9.5 Payroll Bulanan (Fase 2)
1. HR buat `payroll_periods` (draft).
2. Sistem menarik: gaji pokok, tunjangan, absensi (potongan alpa/telat), lembur, reimburse.
3. Hitung BPJS & PPh21, lalu hasilkan `payslips`.
4. HR review, lalu approval pimpinan, lalu status **paid**.
5. Slip gaji tersedia di akun karyawan (PDF).

### 9.6 Offboarding (Fase 3)
Pengajuan resign, approval, clearance (aset, akses), kontrak berakhir, akun dinonaktifkan.

## 10. Aturan Bisnis Awal (bisa diubah di pengaturan)

- Toleransi telat per shift (`late_tolerance_min`).
- Kuota cuti tahunan default 12 hari; berlaku setelah masa kerja tertentu.
- Cuti tidak boleh bentrok dengan pengajuan lain yang masih aktif.
- Data yang sudah masuk payroll **terkunci** (tidak bisa diedit tanpa unlock).
- Semua perubahan data sensitif (gaji, kontrak, status) dicatat di `audit_logs`.

## 11. API (rencana endpoint, prefix `/api/v1`)

```
POST   /auth/login
GET    /employees            POST /employees
GET    /employees/{id}       PUT  /employees/{id}
POST   /attendance/check-in  POST /attendance/check-out
GET    /attendance?month=&employee_id=
GET    /leave/balances       POST /leave/requests
GET    /approvals/inbox      POST /approvals/{id}/action
GET    /payroll/payslips     (Fase 2)
```

## 12. Roadmap Pengerjaan

1. [ ] Setup project, app factory, config, database & migrasi
2. [ ] Auth, role & permission, audit log
3. [ ] Master data: company, cabang, departemen, jabatan, grade
4. [ ] CRUD karyawan + dokumen + kontrak + import Excel
5. [ ] Shift, jadwal, absensi, koreksi, hari libur
6. [ ] Cuti: jenis, saldo, pengajuan
7. [ ] Approval flow generik + notifikasi
8. [ ] Dashboard (HR & karyawan) + export laporan Excel
9. [ ] Testing, seed data, deployment
10. [ ] Fase 2: lembur, payroll, reimburse
11. [ ] Fase 3: rekrutmen, kinerja, pelatihan, offboarding
12. [ ] Fase 4: frontend Next.js + PWA

## 13. Menjalankan Project (setelah kode dibuat)

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # isi SECRET_KEY & DATABASE_URL
flask db upgrade
flask run
```

## 14. Catatan Keamanan

- Password di-hash (bcrypt/werkzeug), tidak pernah disimpan plain text.
- Data pribadi (NIK KTP, rekening, NPWP, gaji) dibatasi per role dan di-log aksesnya.
- Upload dokumen divalidasi tipe & ukuran, disimpan di luar folder publik.
- Mematuhi prinsip pelindungan data pribadi (UU PDP).

---

**Lisensi:** (tentukan)
**Pengembang:** (isi)
