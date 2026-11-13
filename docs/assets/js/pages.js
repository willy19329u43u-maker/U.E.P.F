// U.E. Paulo Freire — Lógica de la versión estática para GitHub Pages
(function () {
    'use strict';

    var currentUser = null;

    // --- Utilidades ---
    function $(sel) { return document.querySelector(sel); }
    function show(id) { document.querySelectorAll('section.page').forEach(function (el) { el.classList.add('hidden'); }); var el = $(id); if (el) el.classList.remove('hidden'); }
    function setText(id, text) { var el = $(id); if (el) el.textContent = text; }

    // --- Login ---
    var loginForm = $('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            var user = $('#loginUser').value.trim();
            var pass = $('#loginPass').value;
            var btn = $('#loginBtn');
            var error = $('#loginError');

            var u = MOCK_USERS[user];
            if (u && u.password === pass) {
                currentUser = u;
                error.classList.add('hidden');
                btn.classList.add('loading');
                setTimeout(function () {
                    // Guardar en sessionStorage para simular sesión
                    sessionStorage.setItem('ue_user', JSON.stringify(currentUser));
                    window.location.href = 'dashboard.html';
                }, 700);
            } else {
                error.classList.remove('hidden');
                btn.classList.remove('loading');
            }
        });
    }

    // Botón de ojo para password
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

    // --- Dashboard ---
    var sidebar = $('#sidebar');
    var menuToggle = $('#menuToggle');
    var sideToggle = $('#sideToggle');
    var logoutBtn = $('#logoutBtn');
    var userNameEl = $('#userName');
    var userRoleEl = $('#userRole');
    var userEmailEl = $('#userEmail');
    var userAvatarEl = $('#userAvatar');
    var themeToggle = $('#themeToggle');

    if (currentUser === null && sessionStorage.getItem('ue_user')) {
        currentUser = JSON.parse(sessionStorage.getItem('ue_user'));
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
                sessionStorage.removeItem('ue_user');
                currentUser = null;
                window.location.href = 'login.html';
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                document.body.classList.toggle('theme-light');
                document.body.classList.toggle('theme-dark');
            });
        }

        renderDashboard(currentUser.role);
    }

    function renderDashboard(role) {
        var container = $('#dashboardContent');
        if (!container) return;
        var data = MOCK_DATA[role] || {};

        var html = '';

        // Cabecera de bienvenida
        html += '<section class="card animate-in">\
            <div style="display:flex;align-items:center;gap:16px">\
                <img src="assets/img/avatars/' + currentUser.avatar + '" alt="Avatar" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary)" onerror="this.src=\'assets/img/avatars/avatar-estudiante.svg\'">\
                <div>\
                    <h2 class="metal-text" style="margin:0">¡Hola, ' + currentUser.full_name + '</h2>\
                    <p style="margin:4px 0 0;color:var(--muted)">' + role + ' · ' + currentUser.email + '</p>\
                </div>\
            </div>\
        </section>';

        // Admin / Secretaría
        if (role === 'admin' || role === 'secretaria') {
            html += '<section class="cards">';
            Object.entries(data.cards || {}).forEach(function (pair) {
                html += '<article class="card stat-card reveal">\
                    <h3>' + pair[0] + '</h3>\
                    <strong class="count" data-count="' + pair[1] + '">0</strong>\
                </article>';
            });
            html += '</section>';

            html += '<section class="card animate-in" style="margin-top:16px;">\
                <h3>📊 Resumen Rápido de Actividad</h3>\
                <p>Bienvenido al panel de control. Esta es la versión demo para GitHub Pages (estática).</p>\
                <div style="margin-top:10px;">\
                    <a href="#" class="btn btn-accent">🚨 Ver Alertas Tempranas</a>\
                    <a href="#" class="btn btn-metal">👥 Gestionar Usuarios</a>\
                </div>\
            </section>';

            if (data.recent) {
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>Últimos Registros de Asistencia</h3>\
                    <div class="table-responsive"><table class="table"><tr><th>Estudiante</th><th>Estado</th><th>Fecha</th><th>Hora</th></tr>';
                data.recent.forEach(function (r) {
                    html += '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
                });
                html += '</table></div></section>';
            }
        }

        // Docente
        if (role === 'docente') {
            html += '<section class="card animate-in" style="margin-top:16px; border-left: 4px solid var(--primary);">\
                <h3>👨‍🏫 Panel del Docente</h3>\
                <p>Versión demo estática. Aquí podrías registrar asistencia e ingresar calificaciones.</p>\
                <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">\
                    <a href="#" class="btn btn-metal">✅ Tomar Asistencia Hoy</a>\
                    <a href="#" class="btn btn-accent">📚 Ingresar Calificaciones</a>\
                    <a href="#" class="btn">🕒 Mi Horario</a>\
                </div>\
            </section>';

            if (data.schedules) {
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>🕒 Mi Horario</h3>\
                    <div class="table-responsive"><table class="table"><tr><th>Día</th><th>Materia</th><th>Hora</th><th>Aula</th></tr>';
                data.schedules.forEach(function (s) {
                    html += '<tr><td>' + s.day + '</td><td>' + s.subject + '</td><td>' + s.time + '</td><td>' + s.room + '</td></tr>';
                });
                html += '</table></div></section>';
            }
        }

        // Padre
        if (role === 'padre') {
            html += '<section class="card animate-in" style="margin-top:16px; border-left: 4px solid var(--primary);">\
                <h3>👨‍👩‍👦 Panel de Familia</h3>\
                <p>Monitorea el progreso académico y asistencia de tus hijos.</p>\
            </section>';

            if (data.children) {
                data.children.forEach(function (ch) {
                    html += '<section class="card animate-in" style="margin-top:16px;">\
                        <h3>👤 ' + ch.first_name + ' ' + ch.last_name + '</h3>\
                        <p><strong>RUDE:</strong> ' + ch.rude + ' | <strong>Curso:</strong> ' + ch.curso + '</p>';
                    if (ch.recent_attendance) {
                        html += '<h4 style="margin-top:15px;">Última Asistencia</h4>\
                            <div class="table-responsive"><table class="table"><tr><th>Fecha</th><th>Estado</th></tr>';
                        ch.recent_attendance.forEach(function (a) {
                            html += '<tr><td>' + a.date + '</td><td>' + a.status + '</td></tr>';
                        });
                        html += '</table></div>';
                    }
                    html += '</section>';
                });
            }
        }

        // Estudiante
        if (role === 'estudiante') {
            html += '<section class="card animate-in" style="margin-top:16px; border-left: 4px solid var(--primary);">\
                <h3>🎓 Mi Panel Estudiantil</h3>\
                <p>Revisa tus calificaciones y horario (demo estática).</p>\
                <div style="margin-top:15px;">\
                    <a href="#" class="btn btn-metal">📚 Ver mis Calificaciones</a>\
                    <a href="#" class="btn btn-accent">🕒 Mi Horario</a>\
                </div>\
            </section>';

            if (data.grades) {
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>📚 Mis Calificaciones Recientes</h3>\
                    <div class="table-responsive"><table class="table"><tr><th>Materia</th><th>Trimestre</th><th>Nota</th></tr>';
                data.grades.forEach(function (g) {
                    html += '<tr><td>' + g.subject + '</td><td>' + g.term + '</td><td><strong>' + g.score + '</strong></td></tr>';
                });
                html += '</table></div></section>';
            }

            if (data.schedules) {
                html += '<section class="card animate-in" style="margin-top:16px;">\
                    <h3>🕒 Mi Horario</h3>\
                    <div class="table-responsive"><table class="table"><tr><th>Día</th><th>Materia</th><th>Hora</th></tr>';
                data.schedules.forEach(function (s) {
                    html += '<tr><td>' + s.day + '</td><td>' + s.subject + '</td><td>' + s.time + '</td></tr>';
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
    }

    // Sidebar toggle
    if (menuToggle && sidebar) menuToggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    if (sideToggle && sidebar) sideToggle.addEventListener('click', function () { sidebar.classList.toggle('expanded'); });

    // Cerrar alertas
    document.querySelectorAll('.alert').forEach(function (a) {
        setTimeout(function () {
            a.style.opacity = '0';
            a.style.transform = 'translateY(-8px)';
            setTimeout(function () { a.remove(); }, 350);
        }, 5000);
    });

    // Buscador en tablas
    document.querySelectorAll('.table').forEach(function (table) {
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

    // Dispositivo
    function setDevice() {
        var w = window.innerWidth;
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        document.body.classList.add(w < 700 ? 'device-mobile' : (w < 1000 ? 'device-tablet' : 'device-desktop'));
    }
    setDevice();
    window.addEventListener('resize', setDevice);

    // Typewriter en hero si existe
    document.querySelectorAll('.typewriter').forEach(function (el) {
        var text = el.getAttribute('data-text') || '';
        el.textContent = '';
        var i = 0;
        var timer = setInterval(function () {
            el.textContent = text.slice(0, ++i);
            if (i >= text.length) clearInterval(timer);
        }, 42);
    });
})();
