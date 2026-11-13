// U.E. Paulo Freire — Autenticación con localStorage (simulación de sesión)
const SESSION_KEY = 'ue_paulo_freire_session';

function login(username, password) {
    const db = getDB();
    const user = db.users.find(u => u.username === username && u.password === password && u.active === 1);
    if (!user) return null;

    const session = {
        user: {
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        },
        loggedInAt: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session.user;
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw).user;
    } catch (e) {
        return null;
    }
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Reutilizar getDB de db.js (ambos se cargan en el mismo scope global)
function getDB() {
    return JSON.parse(localStorage.getItem('ue_paulo_freire_db_v1') || '{}');
}
