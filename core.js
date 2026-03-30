// --- VARIABLES GLOBALES BLINDADAS ---
var supabaseUrl = 'https://tvdkwqbagiccatqrillg.supabase.co';
var supabaseKey = 'sb_publishable_N9RM5G0ySNDSohmjI49Maw_HwOPq-b2';
var _supabase = null;
var currentUser = null;
var currentUserName = "";
var userRole = null;
var allUsers = [];
var searchTimeout = null;

// --- INYECCIÓN DE INTERFAZ GLOBAL Y ESTILOS (UI) ---
const globalUI = `
    <style>
        /* ESTILOS GLOBALES MAESTROS (Reparan la vista móvil y ocultan modales) */
        .sidebar { width: 260px; height: 100vh; position: fixed; top: 0; left: 0; background: rgba(255,255,255,0.8); backdrop-filter: saturate(180%) blur(20px); border-right: 1px solid rgba(0,0,0,0.08); z-index: 1000; transform: translateX(-100%); transition: transform 0.3s ease; }
        @media (min-width: 1024px) { .sidebar { transform: translateX(0); } .main-content { margin-left: 260px; } }
        .sidebar.active { transform: translateX(0); }
        
        .apple-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: rgba(255,255,255,0.98); backdrop-filter: blur(20px); border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); width: 240px; opacity: 0; visibility: hidden; z-index: 1050; transition: all 0.2s ease; transform: translateY(-10px); }
        .apple-dropdown.active { opacity: 1; visibility: visible; transform: translateY(0); }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; z-index: 1200; padding: 20px; }
        .modal-overlay.active { display: flex; }
        .modal-content { background: white; width: 100%; max-width: 450px; border-radius: 28px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }

        /* Buscador Spotlight */
        #searchOverlay { align-items: flex-start; padding-top: 12vh; backdrop-filter: blur(12px); background: rgba(0,0,0,0.3); }
        .search-content { background: rgba(255,255,255,0.95); backdrop-filter: saturate(180%) blur(20px); border-radius: 20px; width: 100%; max-width: 650px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; border: 1px solid rgba(255,255,255,0.4); transform: scale(0.95); opacity: 0; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        #searchOverlay.active .search-content { transform: scale(1); opacity: 1; }
        .search-input { width: 100%; padding: 20px 24px; font-size: 1.1rem; border: none; outline: none; background: transparent; font-weight: 500; color: #1D1D1F; }
        .search-input::placeholder { color: #8E8E93; }
        .search-results { max-height: 50vh; overflow-y: auto; padding: 8px; background: rgba(245,245,247,0.5); border-top: 1px solid rgba(0,0,0,0.05); }
    </style>

    <div id="blockScreen" style="position: fixed; inset: 0; background: #F5F5F7; z-index: 9999; display: none; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px;">
        <div class="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl"><i data-lucide="shield-alert" class="w-8 h-8"></i></div>
        <h1 class="text-3xl font-black tracking-tight text-gray-900 mb-2">Cuenta en Revisión</h1>
        <p class="text-sm text-gray-500 font-medium max-w-sm mb-8">Tu cuenta está a la espera de ser aprobada por un Administrador.</p>
        <button onclick="logout()" class="bg-black text-white px-8 py-3.5 rounded-full text-xs font-bold shadow-lg transition active:scale-95">Cerrar Sesión</button>
    </div>

    <div id="customAlertModal" class="modal-overlay">
        <div class="modal-content max-w-xs text-center p-8 relative">
            <button onclick="closeModal('customAlertModal')" class="absolute top-4 right-4 text-gray-400 hover:text-black transition"><i data-lucide="x" class="w-5 h-5"></i></button>
            <div id="alertIconContainer" class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"><i id="alertIcon" data-lucide="alert-triangle" class="w-6 h-6"></i></div>
            <h3 id="alertTitle" class="text-lg font-bold mb-2 tracking-tight">Título</h3>
            <p id="alertMessage" class="text-xs text-gray-500 mb-8 font-medium leading-relaxed">Mensaje detallado.</p>
            <button onclick="closeModal('customAlertModal')" class="w-full bg-black text-white py-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-lg">Entendido</button>
        </div>
    </div>

    <div id="searchOverlay" class="modal-overlay" onclick="if(event.target === this) closeSearch()">
        <div class="search-content">
            <div class="flex items-center px-2">
                <i data-lucide="search" class="w-5 h-5 text-gray-400 ml-4"></i>
                <input type="text" id="globalSearchInput" oninput="executeSearch(this.value)" placeholder="Buscar tareas, hitos o requerimientos..." class="search-input" autocomplete="off" spellcheck="false">
                <div class="mr-4 flex items-center gap-2">
                    <span class="hidden md:inline-block px-2 py-1 bg-gray-100 text-gray-400 rounded text-[9px] font-bold tracking-widest border border-gray-200 shadow-sm">ESC</span>
                    <button onclick="closeSearch()" class="text-gray-400 hover:text-black transition p-1"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
            </div>
            <div id="globalSearchResults" class="search-results hidden"><p class="text-xs text-gray-400 text-center py-8 font-medium">Escribe algo para comenzar...</p></div>
        </div>
    </div>

    <aside id="sidebar" class="sidebar flex flex-col p-6 no-export">
        <div class="flex justify-between items-center mb-10">
            <a href="index.html" class="text-xl font-bold tracking-tight hover:opacity-70 transition">Gesolva</a>
            <button onclick="toggleMenu()" class="lg:hidden text-gray-400"><i data-lucide="x"></i></button>
        </div>
        <nav class="flex-1 space-y-1" id="mainNav">
            <a href="index.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="index"><i data-lucide="layout-grid" class="w-4 h-4"></i> Dashboard</a>
            <a href="analitica.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="analitica"><i data-lucide="bar-chart-2" class="w-4 h-4"></i> Analítica</a>
            <a href="requerimientos.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="requerimientos"><i data-lucide="layers" class="w-4 h-4"></i> Requerimientos</a>
            <a href="plan_trabajo.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="plan"><i data-lucide="calendar" class="w-4 h-4"></i> Plan de Trabajo</a>
            <a href="archivos.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="archivos"><i data-lucide="folder-open" class="w-4 h-4"></i> Repositorio</a>
            <a href="administracion.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="administracion"><i data-lucide="shield" class="w-4 h-4"></i> Administración</a>
        </nav>
        <div class="mt-auto pt-6 border-t border-gray-100">
            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">AMG ©️ 2026</p>
        </div>
    </aside>

    <header id="mainHeader" class="h-16 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 no-export">
        <button onclick="toggleMenu()" class="lg:hidden text-gray-500"><i data-lucide="menu"></i></button>
        <div class="flex items-center gap-3 ml-auto relative">
            <button onclick="openSearch()" class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full transition text-gray-500 mr-2 group">
                <i data-lucide="search" class="w-4 h-4"></i><span class="text-[10px] font-bold tracking-widest">Buscar... <span class="text-gray-400 font-medium ml-1">Ctrl K</span></span>
            </button>
            <button onclick="openSearch()" class="md:hidden text-gray-400 hover:text-black transition p-2"><i data-lucide="search" class="w-5 h-5"></i></button>

            <div class="relative">
                <button onclick="toggleDropdown('notifMenu')" class="text-gray-400 hover:text-black transition p-2 relative"><i data-lucide="bell" class="w-5 h-5"></i><span id="notif-dot" class="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse hidden"></span></button>
                <div id="notifMenu" class="apple-dropdown p-0 right-0 w-80 max-h-96 flex flex-col overflow-hidden">
                    <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10"><span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notificaciones</span><button onclick="markAllAsRead()" class="text-[10px] text-blue-500 font-bold hover:underline">Marcar leídas</button></div>
                    <div id="notif-list" class="overflow-y-auto max-h-80"><div class="p-4 text-xs text-center text-gray-400 font-medium">Cargando...</div></div>
                </div>
            </div>

            <div class="relative ml-1">
                <button onclick="toggleDropdown('userMenu')" class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition shadow-md" id="userAvatar">--</button>
                <div id="userMenu" class="apple-dropdown p-2 right-0 w-48">
                    <div class="px-4 py-2 border-b border-gray-50 mb-1"><p class="text-[11px] font-bold text-gray-900" id="userNameDisplay">...</p><p class="text-[9px] text-gray-400 font-black uppercase" id="userRoleDisplay">...</p></div>
                    <a href="perfil.html" class="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 rounded-lg"><i data-lucide="user" class="w-3 h-3 text-gray-400"></i> Mi Perfil</a>
                    <button onclick="logout()" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg"><i data-lucide="log-out" class="w-3 h-3 text-red-400"></i> Cerrar Sesión</button>
                </div>
            </div>
        </div>
    </header>
`;

function injectGlobalUI() {
    if (!document.getElementById('mainHeader')) {
        document.body.insertAdjacentHTML('afterbegin', globalUI);
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-item').forEach(link => {
            if (currentPath.includes(link.getAttribute('data-path')) || (currentPath.endsWith('/') && link.getAttribute('data-path') === 'index')) {
                link.classList.remove('text-gray-500', 'hover:bg-gray-50');
                link.classList.add('bg-black', 'text-white', 'font-semibold', 'shadow-lg');
            }
        });
        if(typeof lucide !== 'undefined') lucide.createIcons();
    }
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectGlobalUI); } else { injectGlobalUI(); }

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function toggleMenu() { document.getElementById('sidebar').classList.toggle('active'); }
function toggleDropdown(id) { const drop = document.getElementById(id); const wasActive = drop.classList.contains('active'); document.querySelectorAll('.apple-dropdown').forEach(d => d.classList.remove('active')); if(!wasActive) drop.classList.add('active'); }
document.addEventListener('click', (e) => { if (!e.target.closest('.relative') && !e.target.closest('.apple-dropdown')) document.querySelectorAll('.apple-dropdown').forEach(d => d.classList.remove('active')); });
async function logout() { await _supabase.auth.signOut(); window.location.href = 'login.html'; }

function showAlert(title, message, type = 'error') {
    document.getElementById('alertTitle').innerText = title; document.getElementById('alertMessage').innerText = message;
    const ic = document.getElementById('alertIconContainer'); const icon = document.getElementById('alertIcon');
    if (type === 'error') { ic.className = 'w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4'; icon.setAttribute('data-lucide', 'alert-triangle'); }
    else if (type === 'success') { ic.className = 'w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4'; icon.setAttribute('data-lucide', 'check-circle'); }
    else { ic.className = 'w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'; icon.setAttribute('data-lucide', 'info'); }
    if(typeof lucide !== 'undefined') lucide.createIcons();
    openModal('customAlertModal');
}

async function logActivity(actionText, module = 'plan') {
    if(!currentUser || !_supabase) return;
    await _supabase.from('activity_logs').insert([{ user_id: currentUser.id, action: actionText, module: module }]);
}

async function initCore() {
    if (!_supabase) { _supabase = supabase.createClient(supabaseUrl, supabaseKey); }
    const { data: { user } } = await _supabase.auth.getUser();
    if(!user) { window.location.href='login.html'; return false; }
    currentUser = user;
    const { data: profile } = await _supabase.from('profiles').select('*').eq('id', user.id).single();
    if(profile) {
        if(profile.status !== 'Activo') { document.getElementById('blockScreen').style.display = 'flex'; return false; }
        userRole = profile.role; currentUserName = profile.full_name;
        if(document.getElementById('userAvatar')) {
            document.getElementById('userAvatar').innerText = profile.full_name.substring(0,2).toUpperCase();
            document.getElementById('userNameDisplay').innerText = profile.full_name;
            document.getElementById('userRoleDisplay').innerText = profile.role;
        }
    }
    const { data: usersData } = await _supabase.from('profiles').select('id, full_name').eq('status', 'Activo').order('full_name', { ascending: true });
    if(usersData) allUsers = usersData;
    await loadNotifications();
    return true; 
}

async function loadNotifications() {
    if(!document.getElementById('notif-list')) return;
    const { data: notifs } = await _supabase.from('notifications').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false }).limit(10);
    const list = document.getElementById('notif-list'); const dot = document.getElementById('notif-dot');
    if(notifs && notifs.length > 0) {
        const unread = notifs.some(n => !n.is_read); if(unread) dot.classList.remove('hidden'); else dot.classList.add('hidden');
        list.innerHTML = notifs.map(n => {
            const initials = n.title.substring(0,2).toUpperCase(); const bg = n.is_read ? 'opacity-70' : 'bg-blue-50/30';
            return `<div class="p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 items-start relative ${bg}" onclick="markNotifRead('${n.id}')">${!n.is_read ? `<div class="w-2 h-2 bg-blue-500 rounded-full absolute left-1.5 top-5"></div>` : ''}<div class="w-8 h-8 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-sm">${initials}</div><div><p class="text-xs text-gray-800 leading-snug"><span class="font-bold">${n.title}</span> ${n.message}</p><p class="text-[9px] text-gray-400 font-medium mt-1 uppercase tracking-widest">${new Date(n.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p></div></div>`;
        }).join('');
    } else { list.innerHTML = '<div class="p-6 text-xs text-gray-400 text-center font-medium">No tienes notificaciones nuevas.</div>'; dot.classList.add('hidden'); }
}
async function markNotifRead(id) { await _supabase.from('notifications').update({ is_read: true }).eq('id', id); loadNotifications(); }
async function markAllAsRead() { await _supabase.from('notifications').update({ is_read: true }).eq('user_id', currentUser.id); loadNotifications(); }

// --- LÓGICA DEL BUSCADOR GLOBAL "SPOTLIGHT" ---
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && document.getElementById('searchOverlay') && document.getElementById('searchOverlay').classList.contains('active')) { closeSearch(); }
});
function openSearch() { const overlay = document.getElementById('searchOverlay'); const results = document.getElementById('globalSearchResults'); if(overlay) { overlay.classList.add('active'); results.classList.remove('hidden'); document.getElementById('globalSearchInput').focus(); } }
function closeSearch() { const overlay = document.getElementById('searchOverlay'); if(overlay) { overlay.classList.remove('active'); document.getElementById('globalSearchResults').classList.add('hidden'); document.getElementById('globalSearchInput').value = ''; document.getElementById('globalSearchResults').innerHTML = '<p class="text-xs text-gray-400 text-center py-8 font-medium">Escribe algo para comenzar...</p>'; } }

function executeSearch(query) {
    clearTimeout(searchTimeout); const resultsContainer = document.getElementById('globalSearchResults');
    if (!query || query.trim().length < 2) { resultsContainer.innerHTML = '<p class="text-xs text-gray-400 text-center py-8 font-medium">Escribe al menos 2 letras para buscar...</p>'; return; }
    resultsContainer.innerHTML = '<div class="flex flex-col items-center justify-center py-8"><i data-lucide="loader-2" class="w-6 h-6 text-gray-300 animate-spin mb-2"></i><p class="text-xs text-gray-400 font-medium">Buscando en la base de datos...</p></div>';
    if(typeof lucide !== 'undefined') lucide.createIcons();

    searchTimeout = setTimeout(async () => {
        const q = `%${query.trim()}%`;
        const [reqs, hitos, tasks] = await Promise.all([
            _supabase.from('requirements').select('id, title, priority').ilike('title', q).limit(4),
            _supabase.from('milestones').select('id, title, target_date').ilike('title', q).limit(3),
            _supabase.from('tasks').select('id, title, status, assign').ilike('title', q).limit(5)
        ]);

        let html = '';
        if (reqs.data && reqs.data.length > 0) {
            html += `<div class="px-4 pt-3 pb-1.5"><span class="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded tracking-widest uppercase">Requerimientos</span></div>`;
            reqs.data.forEach(r => { html += `<a href="requerimientos.html" class="flex items-center gap-3 p-3 mx-2 my-1 bg-white hover:bg-gray-50 hover:border-gray-200 border border-transparent rounded-xl transition cursor-pointer group shadow-sm"><div class="w-8 h-8 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition"><i data-lucide="layers" class="w-4 h-4"></i></div><div class="flex-1 overflow-hidden"><p class="text-sm font-bold text-gray-900 truncate leading-snug">${r.title}</p><p class="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5 font-bold">Nivel: <span class="prio-${r.priority} px-1 rounded">${r.priority}</span></p></div><i data-lucide="arrow-right" class="w-4 h-4 text-gray-300 group-hover:text-black transition transform group-hover:translate-x-1"></i></a>`; });
        }
        if (hitos.data && hitos.data.length > 0) {
            html += `<div class="px-4 pt-4 pb-1.5"><span class="text-[9px] font-black text-purple-500 bg-purple-50 px-2 py-1 rounded tracking-widest uppercase">Fases / Hitos</span></div>`;
            hitos.data.forEach(h => { html += `<a href="plan_trabajo.html" class="flex items-center gap-3 p-3 mx-2 my-1 bg-white hover:bg-gray-50 hover:border-gray-200 border border-transparent rounded-xl transition cursor-pointer group shadow-sm"><div class="w-8 h-8 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition"><i data-lucide="flag" class="w-4 h-4"></i></div><div class="flex-1 overflow-hidden"><p class="text-sm font-bold text-gray-900 truncate leading-snug">${h.title}</p><p class="text-[9px] text-gray-400 font-bold mt-0.5">Módulo: Plan de Trabajo</p></div><i data-lucide="arrow-right" class="w-4 h-4 text-gray-300 group-hover:text-black transition transform group-hover:translate-x-1"></i></a>`; });
        }
        if (tasks.data && tasks.data.length > 0) {
            html += `<div class="px-4 pt-4 pb-1.5"><span class="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded tracking-widest uppercase">Actividades (Tareas)</span></div>`;
            tasks.data.forEach(t => { html += `<a href="plan_trabajo.html" class="flex items-center gap-3 p-3 mx-2 my-1 bg-white hover:bg-gray-50 hover:border-gray-200 border border-transparent rounded-xl transition cursor-pointer group shadow-sm"><div class="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition"><i data-lucide="check-square" class="w-4 h-4"></i></div><div class="flex-1 overflow-hidden"><p class="text-sm font-bold text-gray-900 truncate leading-snug">${t.title}</p><p class="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5 font-bold">Resp: ${t.assign} • Est: <span class="status-${t.status} px-1 rounded">${t.status}</span></p></div><i data-lucide="arrow-right" class="w-4 h-4 text-gray-300 group-hover:text-black transition transform group-hover:translate-x-1"></i></a>`; });
        }
        if (html === '') { html = '<div class="py-12 text-center"><i data-lucide="search-x" class="w-10 h-10 text-gray-300 mx-auto mb-3"></i><p class="text-sm font-bold text-gray-600">No hay coincidencias</p><p class="text-xs text-gray-400 mt-1">Intenta buscar con otras palabras clave.</p></div>'; }
        resultsContainer.innerHTML = html;
        if(typeof lucide !== 'undefined') lucide.createIcons();
    }, 400); 
}
