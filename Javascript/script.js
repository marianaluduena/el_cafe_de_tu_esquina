/**
 * Lógica funcional para El café de tu esquina
 * Maneja feriados, estados de apertura y tema oscuro/claro.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Iconos Lucide
    lucide.createIcons();

    // Base de datos de Feriados 2026
    const feriados = [
        { date: '2026-01-01', name: 'Año Nuevo' },
        { date: '2026-02-16', name: 'Carnaval' },
        { date: '2026-02-17', name: 'Carnaval' },
        { date: '2026-03-24', name: 'Día de la Memoria' },
        { date: '2026-04-02', name: 'Malvinas / Viernes Santo' },
        { date: '2026-05-01', name: 'Día del Trabajador' },
        { date: '2026-05-25', name: 'Revolución de Mayo' },
        { date: '2026-06-20', name: 'Día de la Bandera' },
        { date: '2026-07-09', name: 'Día de la Independencia' },
        { date: '2026-08-17', name: 'Paso a la Inmortalidad del Gral. José de San Martín.' },
        { date: '2026-10-12', name: 'Día de la Raza' },
        { date: '2026-11-23', name: 'Día de la Soberanía Nacional' },
        { date: '2026-12-08', name: 'Inmaculada Concepción' },
        { date: '2026-12-25', name: 'Navidad' }
    ];

    /**
     * Gestiona el Banner Superior y la lista de Feriados
     */
    function initHolidays() {
        const list = document.getElementById('holiday-list');
        const banner = document.getElementById('holiday-banner');
        const today = new Date().toISOString().split('T')[0];

        let currentHoliday = feriados.find(f => f.date === today);

        // Actualizar Banner
        if (currentHoliday) {
            banner.style.display = 'block';
            banner.innerHTML = `🚨 HOY CERRADO POR: ${currentHoliday.name.toUpperCase()}`;
        } else {
            const next = feriados.find(f => f.date > today);
            if (next) {
                banner.style.display = 'block';
                banner.style.background = 'var(--primary)';
                banner.innerHTML = `📅 Próximo Feriado: ${next.name} (${next.date.split('-').reverse().join('/')}) - Local Cerrado.`;
            }
        }

        // Renderizar Lista
        feriados.forEach(f => {
            const isPast = f.date < today;
            const row = document.createElement('div');
            row.className = `holiday-row ${isPast ? 'past' : ''}`;
            const dateParts = f.date.split('-');
            row.innerHTML = `<span>${f.name}</span><span class="holiday-tag">${dateParts[2]}/${dateParts[1]}</span>`;
            list.appendChild(row);
        });
    }

   
        /**
         * Calcula si el local está abierto según hora y día
         */
        function updateStatus() {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const day = now.getDay();
            const hour = now.getHours();
            const mins = now.getMinutes();
            const time = hour + (mins / 60);
            const pill = document.getElementById('status-pill');

            // Prioridad Feriado
            if (feriados.some(f => f.date === todayStr)) {
                pill.textContent = "○ Cerrado por Feriado";
                pill.className = "closed";
                return;
            }

            let isOpen = false;
            // Lun-Vie: 08:00-12:00 y 16:00-20:00
            if (day >= 1 && day <= 5) {
                if ((time >= 8 && time < 13) || (time >= 16.5 && time < 19.5)) isOpen = true;
            }
            // Sáb: 10:00-12:30 y 17:00-19:30
            if (day === 6) {
                if ((time >= 9 && time < 12.5) || (time >= 17 && time < 19.5)) isOpen = true;
            }

            if (isOpen) {
                pill.textContent = "● Abierto Ahora";
                pill.className = "open";
            } else {
                pill.textContent = "○ Cerrado";
                pill.className = "closed";
            }
        }

        /**
         * Toggle de Modo Oscuro / Claro
         */
        const themeBtn = document.getElementById('themeBtn');
        const themeIcon = document.getElementById('themeIcon');

        themeBtn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            lucide.createIcons(); // Refrescar iconos
        });

        // Ejecutar al cargar
        initHolidays();
        updateStatus();
        setInterval(updateStatus, 60000); // Re-verificar cada minuto
    });
