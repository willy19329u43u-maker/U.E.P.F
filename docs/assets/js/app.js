// U.E. Paulo Freire — App principal para versión estática (GitHub Pages + localStorage)
(function () {
    'use strict';

    // Inicializar base de datos simulada si no existe
    initDB();

    // ---------- Utilidades ----------
    function $(sel) { return document.querySelector(sel); }
    function $$(sel) { return document.querySelectorAll(sel); }
    function show(id) {
        $$('section.page').forEach(function (el) { el.classList.add('hidden'); });
        var el = $(id);
        if (el) el.classList.remove('hidden');
    }
    function setText(id, text) {
        var el = $(id);
        if (el) el.textContent = text;
    }
    function esc(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ---------- Login ----------
    var loginForm = $('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var user = $('#loginUser').value.trim();
            var pass = $('#loginPass').value;
            var btn = $('#loginBtn');
            var error = $('#loginError');

            var u = login(user, pass);
            if (u) {
                error.classList.add('hidden');
                btn.classList.add('loading');
                setTimeout(function () {
                    window.location.href = 'dashboard.html';
                }, 600);
            } else {
                error.classList.remove('hidden');
                btn.classList.remove('loading');
            }
        });
    }

    var pwT = $('#pwToggle'), pwI = $('#pwInput');
    if (pwT && pwI) {
        pwT.addEventListener('click', function (ev) {
            ev.preventDefault();
            var show = pwI.type === 'password';
            pwI.type = show ? 'text' : 'password';
            pwT.textContent = show ? '🙈' : '👁';
            pwI.focus();
        });
    }

    // ---------- Dashboard ----------
    var sidebar = $('#sidebar');
    var menuToggle = $('#menuToggle');
    var sideToggle = $('#sideToggle');
    var logoutBtn = $('#logoutBtn');
    var userNameEl = $('#userName');
    var userRoleEl = $('#userRole');
    var userEmailEl = $('#userEmail');
    var userAvatarEl = $('#userAvatar');

    var currentUser = getCurrentUser();

    // Si no hay sesión en dashboard o login, redirigir apropiadamente
    var isLoginPage = !!$('#loginForm');
    var isDashboardPage = !!$('#dashboardContent');

    if (!currentUser && isDashboardPage) {
        window.location.href = 'login.html';
    }
    if (currentUser && isLoginPage) {
        window.location.href = 'dashboard.html';
    }

    if (currentUser) {
        if (userNameEl) userNameEl.textContent = currentUser.full_name;
        if (userRoleEl) userRoleEl.textContent = currentUser.role;
        if (userEmailEl) userEmailEl.textContent = currentUser.email;
        if (userAvatarEl) {
            userAvatarEl.src = 'assets/img/avatars/' + currentUser.avatar;
            userAvatarEl.onerror = function () { this.src = 'assets/img/avatars/avatar-estudiante.svg'; };
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (ev) {
                ev.preventDefault();
                logout();
                window.location.href = 'login.html';
            });
        }

        renderDashboard(currentUser.role);
    }

    // ---------- Renderizado del dashboard por rol ----------
    function renderDashboard(role) {
        var container = $('#dashboardContent');
        if (!container) return;

        var db = getDB();
        var userId = currentUser.id;
        var html = '';

        // Cabecera de bienvenida
        html += '<section class="card animate-in">\
            <div style="display:flex;align-items:center;gap:16px">\
                <img src="assets/img/avatars/' + esc(currentUser.avatar) + '" alt="Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary)" onerror="this.src=\'assets/img/avatars/avatar-estudiante.svg\'">\
                <div>\
                    <h2 class="metal-text" style="margin:0">¡Hola, ' + esc(currentUser.full_name) + '</h2>\
                    <p style="margin:4px 0 0;color:var(--muted)">' + esc(role) + ' · ' + esc(currentUser.email) + '</p>\
                </div>\
            </div>\
        </section>';

        // ---------- ADMIN / SECRETARIA ----------
        if (role === 'admin' || role === 'secretaria') {
            var totalStudents = (db.students || []).length;
            var totalUsers = (db.users || []).length;
            var totalCourses = (db.courses || []).length;
            var totalAttendance = (db.attendance || []).length;

            html += '<section class="cards">\
                <article class="card stat-card reveal">\
                    <h3>Usuarios</h3>\
                    <strong class="count" data-count="' + totalUsers + '">0</strong>\
                </article>\
                <article class="card stat-card reveal">\
                    <h3>Estudiantes</h3>\
                    <strong class="count" data-count="' + totalStudents + '">0</strong>\
                </article>\
                <article class="card stat-card reveal">\
                    <h3>Cursos</h3>\
                    <strong class="count" data-count="' + totalCourses + '">0</strong>\
                </article>\
                <article class="card stat-card reveal">\
                    <h3>Asistencias registradas</h3>\
                    <strong class="count" data-count="' + totalAttendance + '">0</strong>\
                </article>\
            </section>';

            html += '<section class="card animate-in" style="margin-top:16px;">\
                <h3>📊 Resumen Rápido</h3>\
                <p>Bienvenido al panel de control. Esta versión demo usa almacenamiento local del navegador (localStorage). Los datos se guardan solo en tu navegador.</p>\
                <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">\
                    <button class="btn btn-accent" onclick="showSection(\'students\')">👥 Estudiantes</button>\
                    <button class="btn btn-metal" onclick="showSection(\'attendance\')">✅ Asistencia</button>\
                    <button class="btn" onclick="showSection(\'grades\')">📚 Calificaciones</button>\
                    <button class="btn" onclick="showSection(\'schedules\')">🕒 Horarios</button>\
                    <button class="btn" onclick="showSection(\'announcements\')">📢 Comunicados</button>\
                </div>\
                <div id="section-students" class="hidden section-block" style="margin-top:16px;">\
                    <h4>👥 Estudiantes</h4>\
                    <div class="table-responsive"><table class="table">\
                        <tr><th>Nombre</th><th>RUDE</th><th>Curso</th><th>Estado</th></tr>\
                        ' + renderStudentsTable(db) + '\
                    </table></div>\
                </div>\
                <div id="section-attendance" class="hidden section-block" style="margin-top:16px;">\
                    <h4>✅ Registrar Asistencia</h4>\
                    <form id="attendanceForm" style="display:flex; gap:8px; flex-wrap:wrap; align-items:end;">\
                        <select id="attStudent" class="input" style="flex:1; min-width:200px;">' + renderStudentOptions(db) + '</select>\
                        <select id="attStatus" class="input">\
                            <option value="P">Presente</option>\
                            <option value="F">Falta</option>\
                            <option value="R">Retraso</option>\
                            <option value="L">Licencia</option>\
                            <option value="RC">Retirado</option>\
                        </select>\
                        <input type="date" id="attDate" class="input" value="' + new Date().toISOString().split('T')[0] + '">\
                        <button type="submit" class="btn btn-accent">Registrar</button>\
                    </form>\
                    <div id="attResult" style="margin-top:10px;"></div>\
                    <h4 style="margin-top:20px;">Últimas asistencias</h4>\
                    <div class="table-responsive"><table class="table">\
                        <tr><th>Estudiante</th><th>Fecha</th><th>Estado</th></tr>\
                        ' + renderAttendanceTable(db) + '\
                    </table></div>\
                </div>\
                <div id="section-grades" class="hidden section-block" style="margin-top:16px;">\
                    <h4>📚 Calificaciones</h4>\
                    <div class="table-responsive"><table class="table">\
                        <tr><th>Estudiante</th><th>Materia</th><th>Trimestre</th><th>Nota</th></tr>\
                        ' + renderGradesTable(db) + '\
                    </table></div>\
                </div>\
                <div id="section-schedules" class="hidden section-block" style="margin-top:16px;">\
                    <h4>🕒 Horarios</h4>\
                    <div class="table-responsive"><table class="table">\
                        <tr><th>Día</th><th>Materia</th><th>Hora</th><th>Aula</th></tr>\
                        ' + renderSchedulesTable(db) + '\
                    </table></div>\
                </div>\
                <div id="section-announcements" class="hidden section-block" style="margin-top:16px;">\
                    <h4>📢 Comunicados</h4>\
                    <div class="table-responsive"><table class="table">\
                        <tr><th>Título</th><th>Contenido</th><th>Fecha</th></tr>\
                        ' + renderAnnouncementsTable(db) + '\
                    </table></div>\
                </div>\
            </section>';
        }

        // ---------- DOCENTE ----------
        if (role === 'docente') {
            html += '<section class="card animate-in" style="margin-top:16px; border-left: 4px solid var(--primary);">\
                <h3>👨‍🏫 Panel del Docente</h3>\
                <p>Versión demo para GitHub Pages. Registra asistencia y consulta tus horarios.</p>\
                <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">\
                    <button class="btn btn-metal" onclick="showSection(\'attendanceDoc\')">✅ Tomar Asistencia</button>\
                    <button class="btn btn-accent" onclick="showSection(\'gradesDoc\')">📚 Calificaciones</button>\
                    <button class="btn" onclick="showSection(\'schedulesDoc\')">🕒 Mi Horario</button>\
                </div>\
            </section>';

            html += '<div id="section-attendanceDoc" class="hidden section-block" style="margin-top:16px;">\
                <h4>✅ Registrar Asistencia</h4>\
                <form id="attendanceFormDoc" style="display:flex; gap:8px; flex-wrap:wrap; align-items:end;">\
                    <select id="attStudentDoc" class="input" style="flex:1; min-width:200px;">' + renderStudentOptions(db) + '</select>\
                    <select id="attStatusDoc" class="input">\
                        <option value="P">Presente</option>\
                        <option value="F">Falta</option>\
                        <option value="R">Retraso</option>\
                        <option value="L">Licencia</option>\
                        <option value="RC">Retirado</option>\
                    </select>\
                    <input type="date" id="attDateDoc" class="input" value="' + new Date().toISOString().split('T')[0] + '">\
                    <button type="submit" class="btn btn-accent">Registrar</button>\
                </form>\
                <div id="attResultDoc" style="margin-top:10px;"></div>\
            </div>\
            <div id="section-gradesDoc" class="hidden section-block" style="margin-top:16px;">\
                <h4>📚 Calificaciones</h4>\
                <div class="table-responsive"><table class="table">\
                    <tr><th>Estudiante</th><th>Materia</th><th>Trimestre</th><th>Nota</th></tr>\
                    ' + renderGradesTable(db) + '\
                </table></div>\
            </div>\
            <div id="section-schedulesDoc" class="hidden section-block" style="margin-top:16px;">\
                <h4>🕒 Mi Horario</h4>\
                <div class="table-responsive"><table class="table">\
                    <tr><th>Día</th><th>Materia</th><th>Hora</th><th>Aula</th></tr>\
                    ' + renderSchedulesTable(db, true) + '\
                </table></div>\
            </div>';
        }

        // ---------- PADRE ----------
        if (role === 'padre') {
            var children = (db.students || []).filter(s => s.guardian_email === currentUser.email || s.user_id === userId);
            if (children.length === 0) {
                // Si no hay relación directa, mostrar los estudiantes existentes como demo
                children = (db.students || []).slice(0, 2);
            }
            html += '<section class="card animate-in" style="margin-top:16px; border-left: 4px solid var(--primary);">\
                <h3>👨‍👩‍👦 Panel de Familia</h3>\
                <p>Monitorea el progreso académico y asistencia de tus hijos.</p>\
            </section>';

            children.forEach(function (ch) {
                var chAtt = (db.attendance || []).filter(a => a.student_id == ch.id).sort((x, y) => new Date(y.date) - new Date(x.date)).slice(0, 5);
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>👤 ' + esc(ch.first_name + ' ' + ch.last_name) + '</h3>\
                    <p><strong>RUDE:</strong> ' + esc(ch.rude) + ' | <strong>Curso:</strong> ' + getCourseName(db, ch.course_id) + '</p>';
                if (chAtt.length) {
                    html += '<h4 style="margin-top:15px;">Última Asistencia</h4>\
                        <div class="table-responsive"><table class="table"><tr><th>Fecha</th><th>Estado</th></tr>';
                    chAtt.forEach(function (a) {
                        html += '<tr><td>' + esc(a.date) + '</td><td>' + esc(a.status) + '</td></tr>';
                    });
                    html += '</table></div>';
                }
                html += '</section>';
            });
        }

        // ---------- ESTUDIANTE ----------
        if (role === 'estudiante') {
            var student = (db.students || []).find(s => s.user_id === userId) || (db.students || [])[0];
            var studentGrades = (db.grades || []).filter(g => g.student_id == student.id);
            var studentSched = (db.schedules || []).filter(s => s.course_id == student.course_id);

            html += '<section class="card animate-in" style="margin-top:16px; border-left: 4px solid var(--primary);">\
                <h3>🎓 Mi Panel Estudiantil</h3>\
                <p>Revisa tus calificaciones, horario y asistencia (demo estática).</p>\
            </section>';

            if (studentGrades.length) {
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>📚 Mis Calificaciones</h3>\
                    <div class="table-responsive"><table class="table"><tr><th>Materia</th><th>Trimestre</th><th>Nota</th></tr>';
                studentGrades.forEach(function (g) {
                    html += '<tr><td>' + esc(getSubjectName(db, g.subject_id)) + '</td><td>' + esc(getTermName(db, g.term_id)) + '</td><td><strong>' + esc(g.score) + '</strong></td></tr>';
                });
                html += '</table></div></section>';
            }

            if (studentSched.length) {
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>🕒 Mi Horario</h3>\
                    <div class="table-responsive"><table class="table"><tr><th>Día</th><th>Materia</th><th>Hora</th></tr>';
                studentSched.forEach(function (s) {
                    html += '<tr><td>' + esc(s.day_of_week) + '</td><td>' + esc(getSubjectName(db, s.subject_id)) + '</td><td>' + esc(s.start_time + ' - ' + s.end_time) + '</td></tr>';
                });
                html += '</table></div></section>';
            }
        }

        container.innerHTML = html;

        // Animar contadores
        document.querySelectorAll('.count').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count') || el.textContent || '0', 10);
            el.textContent = target;
        });

        // Configurar formularios de asistencia
        setupAttendanceForm('attendanceForm', 'attResult');
        setupAttendanceForm('attendanceFormDoc', 'attResultDoc');
    }

    window.showSection = function (id) {
        $$('.section-block').forEach(function (el) { el.classList.add('hidden'); });
        var el = $('#section-' + id);
        if (el) el.classList.remove('hidden');
    };

    // ---------- Renderizadores de tablas ----------
    function renderStudentsTable(db) {
        var rows = '';
        (db.students || []).forEach(function (s) {
            rows += '<tr><td>' + esc(s.first_name + ' ' + s.last_name) + '</td><td>' + esc(s.rude) + '</td><td>' + getCourseName(db, s.course_id) + '</td><td>' + (s.status ? 'Activo' : 'Inactivo') + '</td></tr>';
        });
        return rows || '<tr><td colspan="4" style="text-align:center;color:var(--muted);">No hay estudiantes</td></tr>';
    }

    function renderStudentOptions(db) {
        var opts = '';
        (db.students || []).forEach(function (s) {
            opts += '<option value="' + s.id + '">' + esc(s.first_name + ' ' + s.last_name) + ' (' + esc(s.rude) + ')</option>';
        });
        return opts;
    }

    function renderAttendanceTable(db) {
        var rows = '';
        (db.attendance || []).slice(0, 10).reverse().forEach(function (a) {
            var s = (db.students || []).find(st => st.id == a.student_id);
            rows += '<tr><td>' + (s ? esc(s.first_name + ' ' + s.last_name) : 'Desconocido') + '</td><td>' + esc(a.date) + '</td><td>' + esc(a.status) + '</td></tr>';
        });
        return rows || '<tr><td colspan="3" style="text-align:center;color:var(--muted);">Sin registros</td></tr>';
    }

    function renderGradesTable(db) {
        var rows = '';
        (db.grades || []).slice(0, 10).forEach(function (g) {
            var s = (db.students || []).find(st => st.id == g.student_id);
            rows += '<tr><td>' + (s ? esc(s.first_name + ' ' + s.last_name) : 'Desconocido') + '</td><td>' + esc(getSubjectName(db, g.subject_id)) + '</td><td>' + esc(getTermName(db, g.term_id)) + '</td><td><strong>' + esc(g.score) + '</strong></td></tr>';
        });
        return rows || '<tr><td colspan="4" style="text-align:center;color:var(--muted);">Sin calificaciones</td></tr>';
    }

    function renderSchedulesTable(db, teacherOnly) {
        var rows = '';
        (db.schedules || []).forEach(function (s) {
            if (teacherOnly && s.teacher_user_id != currentUser.id) return;
            rows += '<tr><td>' + esc(s.day_of_week) + '</td><td>' + esc(getSubjectName(db, s.subject_id)) + '</td><td>' + esc(s.start_time + ' - ' + s.end_time) + '</td><td>' + esc(s.classroom) + '</td></tr>';
        });
        return rows || '<tr><td colspan="4" style="text-align:center;color:var(--muted);">Sin horarios</td></tr>';
    }

    function renderAnnouncementsTable(db) {
        var rows = '';
        (db.announcements || []).slice(0, 10).reverse().forEach(function (a) {
            rows += '<tr><td>' + esc(a.title) + '</td><td>' + esc(a.content) + '</td><td>' + esc(a.created_at) + '</td></tr>';
        });
        return rows;
    }

    // ---------- Helpers ----------
    function getCourseName(db, id) {
        var c = (db.courses || []).find(x => x.id == id);
        return c ? esc(c.name + ' ' + c.parallel) : 'N/A';
    }
    function getSubjectName(db, id) {
        var s = (db.subjects || []).find(x => x.id == id);
        return s ? esc(s.name) : 'N/A';
    }
    function getTermName(db, id) {
        var t = (db.terms || []).find(x => x.id == id);
        return t ? esc(t.name) : 'N/A';
    }

    function setupAttendanceForm(formId, resultId) {
        var form = $(formId);
        var result = $(resultId);
        if (!form) return;
        form.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var studentId = parseInt($(formId === 'attendanceForm' ? '#attStudent' : '#attStudentDoc').value, 10);
            var status = $(formId === 'attendanceForm' ? '#attStatus' : '#attStatusDoc').value;
            var date = $(formId === 'attendanceForm' ? '#attDate' : '#attDateDoc').value;
            if (!studentId || !status || !date) return;

            var db = getDB();
            var existing = (db.attendance || []).find(a => a.student_id == studentId && a.date == date);
            if (existing) {
                updateInCollection('attendance', existing.id, { status: status, registered_by: currentUser.id });
            } else {
                addToCollection('attendance', {
                    student_id: studentId,
                    date: date,
                    status: status,
                    registered_by: currentUser.id,
                    created_at: new Date().toISOString()
                });
            }
            result.textContent = '✅ Asistencia registrada correctamente.';
            result.style.color = 'var(--primary)';
            setTimeout(function () { result.textContent = ''; }, 3000);
            renderDashboard(currentUser.role);
        });
    }

    // ---------- Sidebar / tema ----------
    if (menuToggle && sidebar) menuToggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    if (sideToggle && sidebar) sideToggle.addEventListener('click', function () { sidebar.classList.toggle('expanded'); });

    var themeToggle = $('#themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('theme-light');
            document.body.classList.toggle('theme-dark');
        });
    }

    // Cerrar alertas
    $$('.alert').forEach(function (a) {
        setTimeout(function () {
            a.style.opacity = '0';
            a.style.transform = 'translateY(-8px)';
            setTimeout(function () { a.remove(); }, 350);
        }, 5000);
    });

    // Buscador en tablas
    $$('.table').forEach(function (table) {
        if (!table.dataset.searchDone && table.rows.length > 4) {
            var inp = document.createElement('input');
            inp.type = 'text';
            inp.placeholder = 'Buscar...';
            inp.className = 'input';
            inp.style.marginBottom = '10px';
            table.parentNode.insertBefore(inp, table);
            inp.addEventListener('keyup', function () {
                var term = inp.value.toLowerCase();
                Array.from(table.rows).forEach(function (row, i) {
                    if (i === 0) return;
                    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
                });
            });
            table.dataset.searchDone = '1';
        }
    });

    function setDevice() {
        var w = window.innerWidth;
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        document.body.classList.add(w < 700 ? 'device-mobile' : (w < 1000 ? 'device-tablet' : 'device-desktop'));
    }
    setDevice();
    window.addEventListener('resize', setDevice);

    // Typewriter
    $$('.typewriter').forEach(function (el) {
        var text = el.getAttribute('data-text') || '';
        el.textContent = '';
        var i = 0;
        var timer = setInterval(function () {
            el.textContent = text.slice(0, ++i);
            if (i >= text.length) clearInterval(timer);
        }, 42);
    });
})();
