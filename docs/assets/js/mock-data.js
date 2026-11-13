// U.E. Paulo Freire — Datos simulados para versión GitHub Pages (demo)
const MOCK_USERS = {
    admin: { username: 'admin', password: 'Admin123!', full_name: 'Administrador General', email: 'admin@ejemplo.edu.bo', role: 'admin', avatar: 'avatar-admin.svg' },
    secretaria: { username: 'secretaria', password: 'Secretaria123!', full_name: 'María Secretaría', email: 'secretaria@ejemplo.edu.bo', role: 'secretaria', avatar: 'avatar-secretaria.svg' },
    docente: { username: 'docente', password: 'Docente123!', full_name: 'Juan Docente', email: 'docente@ejemplo.edu.bo', role: 'docente', avatar: 'avatar-docente.svg' },
    estudiante: { username: 'estudiante', password: 'Estudiante123!', full_name: 'Juan Perez', email: 'estudiante@ejemplo.edu.bo', role: 'estudiante', avatar: 'avatar-estudiante.svg' },
    padre: { username: 'padre', password: 'Padre123!', full_name: 'Roberto Perez', email: 'padre@ejemplo.edu.bo', role: 'padre', avatar: 'avatar-padre.svg' }
};

const MOCK_DATA = {
    admin: {
        cards: { Usuarios: 5, Estudiantes: 24, Docentes: 12, Cursos: 24 },
        recent: [
            ['Juan Perez', 'Presente', 'Hoy', '08:00'],
            ['Ana Lopez', 'Falta', 'Hoy', '08:05'],
            ['Carlos Ruiz', 'Retraso', 'Hoy', '08:15']
        ]
    },
    secretaria: {
        cards: { Estudiantes: 24, Asistencias: 180, Comunicados: 6 },
        recent: [
            ['Juan Perez', 'Presente', 'Hoy'],
            ['Maria Gomez', 'Presente', 'Hoy'],
            ['Luis Diaz', 'Falta', 'Ayer']
        ]
    },
    docente: {
        subjects: ['Matemáticas', 'Física'],
        recent: [
            ['1ro A - Matemáticas', 'Hoy', '15 presentes'],
            ['2do B - Física', 'Ayer', '14 presentes']
        ],
        schedules: [
            { day: 'Lunes', subject: 'Matemáticas', time: '08:00 - 09:30', room: 'Aula 1' },
            { day: 'Martes', subject: 'Física', time: '10:00 - 11:30', room: 'Aula 3' },
            { day: 'Miércoles', subject: 'Matemáticas', time: '08:00 - 09:30', room: 'Aula 1' }
        ]
    },
    estudiante: {
        grades: [
            { subject: 'Matemáticas', term: '1er Trimestre', score: 85.50 },
            { subject: 'Lenguaje', term: '1er Trimestre', score: 78.00 },
            { subject: 'Biología', term: '1er Trimestre', score: 90.25 }
        ],
        schedules: [
            { day: 'Lunes', subject: 'Matemáticas', time: '08:00 - 09:30' },
            { day: 'Lunes', subject: 'Lenguaje', time: '09:45 - 11:15' },
            { day: 'Martes', subject: 'Biología', time: '08:00 - 09:30' }
        ]
    },
    padre: {
        children: [
            { first_name: 'Juan', last_name: 'Perez', rude: 'RUDE001', curso: '1ro A', recent_attendance: [
                { date: 'Hoy', status: 'Presente' },
                { date: 'Ayer', status: 'Presente' },
                { date: 'Antier', status: 'Retraso' }
            ]}
        ]
    }
};
