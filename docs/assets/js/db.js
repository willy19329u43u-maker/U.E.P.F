// U.E. Paulo Freire — Simulador de base de datos con localStorage para GitHub Pages
// Todos los datos se guardan en el navegador del usuario (no hay servidor)

const DB_KEY = 'ue_paulo_freire_db_v1';

// Estructura inicial por defecto
const DEFAULT_DB = {
    users: [
        { id: 1, username: 'admin', password: 'Admin123!', full_name: 'Administrador General', email: 'admin@ejemplo.edu.bo', role: 'admin', avatar: 'avatar-admin.svg', active: 1 },
        { id: 2, username: 'secretaria', password: 'Secretaria123!', full_name: 'María Secretaría', email: 'secretaria@ejemplo.edu.bo', role: 'secretaria', avatar: 'avatar-secretaria.svg', active: 1 },
        { id: 3, username: 'docente', password: 'Docente123!', full_name: 'Juan Docente', email: 'docente@ejemplo.edu.bo', role: 'docente', avatar: 'avatar-docente.svg', active: 1 },
        { id: 4, username: 'estudiante', password: 'Estudiante123!', full_name: 'Juan Perez', email: 'estudiante@ejemplo.edu.bo', role: 'estudiante', avatar: 'avatar-estudiante.svg', active: 1 },
        { id: 5, username: 'padre', password: 'Padre123!', full_name: 'Roberto Perez', email: 'padre@ejemplo.edu.bo', role: 'padre', avatar: 'avatar-padre.svg', active: 1 }
    ],
    students: [
        { id: 1, user_id: 4, first_name: 'Juan', last_name: 'Perez', rude: 'RUDE001', ci: 'CI123456', birth_date: '2010-05-10', gender: 'M', address: 'Quintanilla', enrollment_year: 2024, course_id: 1, guardian_name: 'Roberto Perez', guardian_phone: '70011122', guardian_email: 'padre@ejemplo.edu.bo', observations: 'Demo', status: 1 },
        { id: 2, user_id: null, first_name: 'Ana', last_name: 'Lopez', rude: 'RUDE002', ci: 'CI234567', birth_date: '2011-03-15', gender: 'F', address: 'Zona Sur', enrollment_year: 2024, course_id: 1, guardian_name: 'Carmen Lopez', guardian_phone: '70022233', guardian_email: 'carmen@ejemplo.edu.bo', observations: '', status: 1 },
        { id: 3, user_id: null, first_name: 'Carlos', last_name: 'Ruiz', rude: 'RUDE003', ci: 'CI345678', birth_date: '2010-09-22', gender: 'M', address: 'Villa Pagador', enrollment_year: 2024, course_id: 2, guardian_name: 'Luis Ruiz', guardian_phone: '70033344', guardian_email: 'luis@ejemplo.edu.bo', observations: '', status: 1 }
    ],
    courses: [
        { id: 1, name: '1ro', parallel: 'A', level: 'Secundaria' },
        { id: 2, name: '2do', parallel: 'B', level: 'Secundaria' },
        { id: 3, name: '3ro', parallel: 'A', level: 'Secundaria' }
    ],
    subjects: [
        { id: 1, name: 'Matemáticas' },
        { id: 2, name: 'Lenguaje' },
        { id: 3, name: 'Biología' },
        { id: 4, name: 'Física' },
        { id: 5, name: 'Química' }
    ],
    terms: [
        { id: 1, name: '1er Trimestre', start_date: '2026-02-02', end_date: '2026-05-29' },
        { id: 2, name: '2do Trimestre', start_date: '2026-06-08', end_date: '2026-09-18' },
        { id: 3, name: '3er Trimestre', start_date: '2026-09-28', end_date: '2026-11-27' }
    ],
    schedules: [
        { id: 1, course_id: 1, subject_id: 1, teacher_user_id: 3, day_of_week: 'Lunes', start_time: '08:00', end_time: '09:30', classroom: 'Aula 1' },
        { id: 2, course_id: 1, subject_id: 2, teacher_user_id: 3, day_of_week: 'Lunes', start_time: '09:45', end_time: '11:15', classroom: 'Aula 1' },
        { id: 3, course_id: 1, subject_id: 3, teacher_user_id: null, day_of_week: 'Martes', start_time: '08:00', end_time: '09:30', classroom: 'Aula 2' },
        { id: 4, course_id: 2, subject_id: 1, teacher_user_id: 3, day_of_week: 'Miércoles', start_time: '08:00', end_time: '09:30', classroom: 'Aula 3' },
        { id: 5, course_id: 2, subject_id: 4, teacher_user_id: null, day_of_week: 'Jueves', start_time: '10:00', end_time: '11:30', classroom: 'Aula 4' }
    ],
    attendance: [],
    tardies: [],
    grades: [],
    announcements: [
        { id: 1, title: 'Bienvenidos al sistema', content: 'Comunicado público de demostración de la U.E. Paulo Freire.', target_type: 'global', course_id: null, student_id: null, subject_id: null, created_by: 1, created_at: new Date().toISOString() }
    ],
    notifications: [],
    settings: { app_name: 'U.E. Paulo Freire', app_version: '5.0', mail_enabled: '0' }
};

// --- Operaciones de base de datos simulada ---

function initDB() {
    const existing = localStorage.getItem(DB_KEY);
    if (!existing) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DB));
    }
    return getDB();
}

function getDB() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
}

function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function getCollection(name) {
    return (getDB()[name] || []).slice();
}

function addToCollection(name, item) {
    const db = getDB();
    if (!db[name]) db[name] = [];
    item.id = Date.now();
    db[name].push(item);
    saveDB(db);
    return item;
}

function updateInCollection(name, id, updates) {
    const db = getDB();
    if (!db[name]) return null;
    const idx = db[name].findIndex(i => i.id == id);
    if (idx === -1) return null;
    db[name][idx] = { ...db[name][idx], ...updates };
    saveDB(db);
    return db[name][idx];
}

function removeFromCollection(name, id) {
    const db = getDB();
    if (!db[name]) return false;
    db[name] = db[name].filter(i => i.id != id);
    saveDB(db);
    return true;
}
