<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Metaproject Pro</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { background-color: #f6f8fa; font-family: 'Inter', sans-serif; color: #1e293b; }
        .sidebar { width: 260px; background: #ffffff; border-right: 1px solid #e2e8f0; position: fixed; height: 100vh; transition: 0.3s; z-index: 50; }
        .nav-link { display: flex; align-items: center; padding: 10px 20px; margin: 4px 12px; border-radius: 8px; color: #64748b; font-size: 0.875rem; font-weight: 500; cursor: pointer; }
        .nav-link:hover { background: #f1f5f9; color: #0f172a; }
        .nav-link.active { background: #e0e7ff; color: #4338ca; }
        .main-content { margin-left: 260px; padding: 32px; transition: 0.3s; }
        .status-pill { padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: white; }
        .bg-monday-green { background-color: #00c875; }
        .bg-monday-yellow { background-color: #ffcb00; }
        .bg-monday-blue { background-color: #0086d6; }
        .bg-monday-red { background-color: #df2f4a; }
        
        @media (max-width: 1024px) {
            .sidebar { transform: translateX(-100%); }
            .sidebar.open { transform: translateX(0); }
            .main-content { margin-left: 0 !important; }
        }

        /* Estilo Gantt Monday */
        .gantt-bar { height: 24px; border-radius: 12px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold; }
    </style>
</head>
<body>
    <div id="overlay" class="fixed inset-0 bg-black/20 hidden z-40" onclick="toggleMenu()"></div>

    <aside id="sidebar" class="sidebar">
        <div class="p-8">
            <h1 class="text-2xl font-black text-indigo-600 tracking-tighter">METAPROJECT</h1>
        </div>
        <nav>
            <div onclick="showTab('dashboard')" class="nav-link active tab-btn" id="btn-dashboard">📊 Dashboard</div>
            <div onclick="showTab('monday')" class="nav-link tab-btn" id="btn-monday">📅 Hoja de Ruta</div>
            <div onclick="showTab('kanban')" class="nav-link tab-btn" id="btn-kanban">📋 Kanban</div>
            <div class="mt-8 px-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equipos</div>
            <div class="nav-link">🚀 UX/UI Design</div>
            <div class="nav-link">💻 Desarrollo</div>
        </nav>
    </aside>

    <main class="main-content">
        <header class="flex justify-between items-center mb-10">
            <button onclick="toggleMenu()" class="lg:hidden p-2 bg-white rounded-lg shadow-sm border">☰</button>
            <h2 id="tab-title" class="text-2xl font-bold">Dashboard General</h2>
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-lg">PF</div>
            </div>
        </header>

        <div id="view-dashboard" class="tab-view">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                    <canvas id="donaChart" width="140" height="140"></canvas>
                    <p class="mt-4 text-2xl font-black text-slate-800">67%</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase">Avance Total</p>
                </div>
                <div class="lg:col-span-3 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 class="text-sm font-bold mb-6 text-slate-500 uppercase tracking-wider">Cronograma Ejecutivo (Gantt)</h3>
                    <div class="space-y-6">
                        <div class="relative">
                            <div class="flex justify-between text-[10px] font-bold mb-2"><span>MAQUETADO FASE 1</span><span class="text-indigo-600">80%</span></div>
                            <div class="w-full bg-slate-100 h-6 rounded-full">
                                <div class="bg-indigo-500 h-full rounded-full flex items-center px-4 text-[9px] text-white font-bold" style="width: 80%">EN TIEMPO</div>
                            </div>
                        </div>
                        <div class="relative">
                            <div class="flex justify-between text-[10px] font-bold mb-2"><span>REVISIÓN CON STAKEHOLDERS</span><span class="text-rose-500">RETRASO</span></div>
                            <div class="w-full bg-slate-100 h-6 rounded-full">
                                <div class="bg-rose-500 h-full rounded-full flex items-center px-4 text-[9px] text-white font-bold" style="width: 100%">DESFASE +4 DÍAS</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 class="text-sm font-bold mb-4">Actualizaciones del Proyecto</h3>
                <div class="flex gap-4 p-4 bg-slate-50 rounded-xl mb-4">
                    <div class="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0"></div>
                    <textarea class="w-full bg-transparent border-none focus:ring-0 text-sm" placeholder="Escribe una actualización..."></textarea>
                </div>
            </div>
        </div>

        <div id="view-monday" class="tab-view hidden">
            <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="p-4 bg-indigo-600 text-white font-bold text-xs tracking-widest uppercase">Grupo: Desarrollo Core</div>
                <table class="w-full text-sm text-left">
                    <thead class="bg-slate-50 text-[10px] text-slate-400 uppercase">
                        <tr>
                            <th class="p-4 border-r w-12 text-center">#</th>
                            <th class="p-4 border-r">Tarea</th>
                            <th class="p-4 border-r text-center w-32">Estado</th>
                            <th class="p-4 border-r text-center w-32">Prioridad</th>
                            <th class="p-4 text-center">Responsable</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-t hover:bg-slate-50 transition">
                            <td class="p-4 border-r text-center text-slate-300">1</td>
                            <td class="p-4 border-r font-medium">Configuración de base de datos Supabase</td>
                            <td class="p-4 border-r text-center"><span class="status-pill bg-monday-green">Listo</span></td>
                            <td class="p-4 border-r text-center"><span class="status-pill bg-monday-blue">Normal</span></td>
                            <td class="p-4 text-center"><div class="w-6 h-6 rounded-full bg-orange-400 mx-auto text-[8px] flex items-center justify-center text-white font-bold">JD</div></td>
                        </tr>
                        <tr class="border-t hover:bg-slate-50 transition">
                            <td class="p-4 border-r text-center text-slate-300">2</td>
                            <td class="p-4 border-r font-medium">Integración de API de Notificaciones</td>
                            <td class="p-4 border-r text-center"><span class="status-pill bg-monday-yellow">En Proceso</span></td>
                            <td class="p-4 border-r text-center"><span class="status-pill bg-monday-red">Urgente</span></td>
                            <td class="p-4 text-center"><div class="w-6 h-6 rounded-full bg-indigo-400 mx-auto text-[8px] flex items-center justify-center text-white font-bold">ME</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="view-kanban" class="tab-view hidden">
            <div class="flex gap-6 overflow-x-auto pb-6">
                <div class="min-w-[300px] flex-1">
                    <div class="flex justify-between mb-4 border-b-4 border-indigo-400 pb-2">
                        <span class="font-bold text-sm">Por Hacer</span>
                        <span class="bg-slate-200 text-[10px] px-2 py-0.5 rounded-full font-bold">3</span>
                    </div>
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 cursor-grab hover:shadow-md transition">
                        <p class="text-xs font-bold mb-2">Diseñar iconos de navegación</p>
                        <div class="flex justify-between items-center">
                            <span class="status-pill bg-slate-400">Diseño</span>
                            <div class="w-5 h-5 rounded-full bg-purple-400"></div>
                        </div>
                    </div>
                </div>
                <div class="min-w-[300px] flex-1">
                    <div class="flex justify-between mb-4 border-b-4 border-monday-yellow pb-2">
                        <span class="font-bold text-sm">En Proceso</span>
                    </div>
                    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3">
                        <p class="text-xs font-bold mb-2">Despliegue en Vercel</p>
                        <span class="status-pill bg-indigo-500">DevOps</span>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <script>
        // NAVEGACIÓN ENTRE PESTAÑAS
        function showTab(tabId) {
            document.querySelectorAll('.tab-view').forEach(v => v.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            
            document.getElementById('view-' + tabId).classList.remove('hidden');
            document.getElementById('btn-' + tabId).classList.add('active');
            
            const titles = { 'dashboard': 'Dashboard General', 'monday': 'Hoja de Ruta', 'kanban': 'Kanban Board' };
            document.getElementById('tab-title').innerText = titles[tabId];
            if(window.innerWidth < 1024) toggleMenu();
        }

        function toggleMenu() {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('overlay').classList.toggle('show');
        }

        // GRÁFICO DASHBOARD
        const ctx = document.getElementById('donaChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [67, 33],
                    backgroundColor: ['#4f46e5', '#f1f5f9'],
                    borderWidth: 0,
                    borderRadius: 10
                }]
            },
            options: { cutout: '85%', plugins: { legend: { display: false } } }
        });
    </script>
</body>
</html>
