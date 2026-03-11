// --- CONEXIÓN A BASE DE DATOS ---
const supabaseUrl = 'https://tvdkwqbagiccatqrillg.supabase.co';
const supabaseKey = 'sb_publishable_N9RM5G0ySNDSohmjI49Maw_HwOPq-b2';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- VARIABLES GLOBALES ---
let currentUser = null;
let currentUserName = "";
let userRole = null;
let allUsers = [];

// --- INYECCIÓN DE INTERFAZ GLOBAL (UI) ---
const globalUI = `
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

    <aside id="sidebar" class="sidebar flex flex-col p-6 no-export">
        <div class="flex justify-between items-center mb-10">
            <a href="index.html" class="text-xl font-bold tracking-tight hover:opacity-70 transition">MetaProject</a>
            <button onclick="toggleMenu()" class="lg:hidden text-gray-400"><i data-lucide="x"></i></button>
        </div>
        <nav class="flex-1 space-y-1" id="mainNav">
            <a href="index.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="index"><i data-lucide="layout-grid" class="w-4 h-4"></i> Dashboard</a>
            <a href="requerimientos.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="requerimientos"><i data-lucide="layers" class="w-4 h-4"></i> Requerimientos</a>
            <a href="plan_trabajo.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="plan"><i data-lucide="calendar" class="w-4 h-4"></i> Plan de Trabajo</a>
            <a href="presupuesto.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="presupuesto"><i data-lucide="dollar-sign" class="w-4 h-4"></i> Presupuesto</a>
            <a href="administracion.html" class="nav-item flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition text-sm" data-path="administracion"><i data-lucide="shield" class="w-4 h-4"></i> Administración</a>
        </nav>
        <div class="mt-auto pt-6 border-t border-gray-100">
            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center leading-relaxed">AMG ©️ 2026</p>
        </div>
    </aside>

    <header id="mainHeader" class="h-16 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 no-export">
        <button onclick="toggleMenu()" class="lg:hidden text-gray-500"><i data-lucide="menu"></i></button>
        <div class="flex items-center gap-4 ml-auto relative">
            <div class="relative">
                <button onclick="toggleDropdown('notifMenu')" class="text-gray-400 hover:text-black transition p-2 relative"><i data-lucide="bell" class="w-5 h-5"></i><span id="notif-dot" class="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse hidden"></span></button>
                <div id="notifMenu" class="apple-dropdown p-0 right-0 w-80 max-h-96 flex flex-col overflow-hidden">
                    <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10"><span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Notificaciones</span><button onclick="markAllAsRead()" class="text-[10px] text-blue-500 font-bold hover:underline">Marcar leídas</button></div>
                    <div id="notif-list" class="overflow-y-auto max-h-80"><div class="p-4 text-xs text-center text-gray-400 font-medium">Cargando...</div></div>
                </div>
            </div>
            <div class="relative">
                <button onclick="toggleDropdown('userMenu')" class="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:scale-105 transition" id="userAvatar">--</button>
                <div id="userMenu" class="apple-dropdown p-2 right-0 w-48">
                    <div class="px-4 py-2 border-b border-gray-50 mb-1"><p class="text-[11px] font-bold" id="userNameDisplay">...</p><p class="text-[9px] text-gray-400 font-black uppercase" id="userRoleDisplay">...</p></div>
                    <a href="perfil.html" class="flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 rounded-lg"><i data-lucide="user" class="w-3 h-3 text-gray-400"></i> Mi Perfil</a>
                    <button onclick="logout()" class="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg"><i data-lucide="log-out" class="w-3 h-3 text-red-400"></i> Cerrar Sesión</button>
                </div>
            </div>
        </div>
    </header>
`;

document.body.insertAdjacentHTML('afterbegin', globalUI);

// Destacar el menú activo según la URL
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-item').forEach(link => {
    if (currentPath.includes(link.getAttribute('data-path'))) {
        link.classList.remove('text-gray-500', 'hover:bg-gray-50');
        link.classList.add('bg-black', 'text-white', 'font-semibold', 'shadow-lg');
    }
});

// --- FUNCIONES GLOBALES ---
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
    lucide.createIcons(); openModal('customAlertModal');
}

async function logActivity(actionText, module = 'plan') {
    if(!currentUser) return;
    await _supabase.from('activity_logs').insert([{ user_id: currentUser.id, action: actionText, module: module }]);
}

// --- AUTENTICACIÓN Y NOTIFICACIONES BASE ---
async function initCore() {
    const { data: { user } } = await _supabase.auth.getUser();
    if(!user) { window.location.href='login.html'; return false; }
    currentUser = user;

    const { data: profile } = await _supabase.from('profiles').select('*').eq('id', user.id).single();
    if(profile) {
        if(profile.status !== 'Activo') { document.getElementById('blockScreen').style.display = 'flex'; return false; }
        userRole = profile.role; currentUserName = profile.full_name;
        document.getElementById('userAvatar').innerText = profile.full_name.substring(0,2).toUpperCase();
        document.getElementById('userNameDisplay').innerText = profile.full_name;
        document.getElementById('userRoleDisplay').innerText = profile.role;
    }

    const { data: usersData } = await _supabase.from('profiles').select('id, full_name').eq('status', 'Activo').order('full_name', { ascending: true });
    if(usersData) allUsers = usersData;

    await loadNotifications();
    return true; // Autenticado exitosamente
}

async function loadNotifications() {
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
