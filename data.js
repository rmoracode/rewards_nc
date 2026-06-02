/* ============================================================
   Campeón del Abarrote — Datos mock + lógica de puntos
   AJE Snacks (D'Gussto · Dest)
   Expuesto en window.CDA para todas las vistas del prototipo.
   ============================================================ */
(function () {
  // ---- Configuración de reglas (editable desde Admin > Reglas) ----
  const RULES = [
    { id: 't1', from: 51, to: 80,  rate: 1, label: '51% – 80%',   color: '#94a3b8' },
    { id: 't2', from: 81, to: 100, rate: 2, label: '81% – 100%',  color: '#008751' },
    { id: 't3', from: 101, to: 120, rate: 3, label: '101% – 120%', color: '#FFCC00' },
    { id: 't4', from: 121, to: Infinity, rate: 4, label: '+120%', color: '#f97316' },
  ];

  // ---- Lógica de puntos: progresiva por tramos (estilo escalera) ----
  // Se otorgan puntos por cada punto porcentual de cumplimiento, a la tasa
  // del tramo donde cae ese punto. Debajo de 51% = 0 pts.
  function pointsForCompliance(pct) {
    const p = Math.floor(pct);
    let pts = 0;
    for (let i = 51; i <= p; i++) {
      if (i <= 80) pts += 1;
      else if (i <= 100) pts += 2;
      else if (i <= 120) pts += 3;
      else pts += 4;
    }
    return pts;
  }

  // Desglose por tramo (para mostrar cómo se construyen los puntos)
  function pointsBreakdown(pct) {
    const p = Math.floor(pct);
    return RULES.map((t) => {
      const upper = Math.min(p, t.to === Infinity ? p : t.to);
      const lower = t.from;
      const span = p >= lower ? Math.max(0, upper - lower + 1) : 0;
      return { ...t, span, pts: span * t.rate, active: p >= lower };
    });
  }

  function tierForCompliance(pct) {
    if (pct < 51) return { label: 'Sin puntos', rate: 0, color: '#94a3b8' };
    return RULES.find((t) => pct >= t.from && pct <= t.to) || RULES[RULES.length - 1];
  }

  // Proyección al cierre: extrapola el ritmo de venta actual a los días del mes.
  function projectCompliance(pct, daysElapsed, daysTotal) {
    if (daysElapsed <= 0) return pct;
    return pct * (daysTotal / daysElapsed);
  }

  // ---- Niveles (gamificación) ----
  const LEVELS = [
    { name: 'Bronce',   min: 0,    icon: '🥉', color: '#b45309' },
    { name: 'Plata',    min: 600,  icon: '🥈', color: '#64748b' },
    { name: 'Oro',      min: 1200, icon: '🥇', color: '#d4a017' },
    { name: 'Platino',  min: 2000, icon: '💎', color: '#0ea5e9' },
    { name: 'Leyenda',  min: 3000, icon: '👑', color: '#7c3aed' },
  ];
  function levelFor(seasonPoints) {
    let cur = LEVELS[0], next = null;
    for (let i = 0; i < LEVELS.length; i++) {
      if (seasonPoints >= LEVELS[i].min) { cur = LEVELS[i]; next = LEVELS[i + 1] || null; }
    }
    return { cur, next };
  }

  // ---- Período actual ----
  const PERIOD = { label: 'Junio 2026', daysElapsed: 22, daysTotal: 30 };

  // ---- Vendedor logueado (resuelto vía Chat ID de Telegram) ----
  const ME = {
    id: 'v014',
    chatId: 728401193,
    name: 'Carlos Méndez',
    route: 'GT-014',
    zone: 'Zona Metropolitana',
    budget: 120000,
    sold: 104400,
    avatar: 'CM',
    seasonPoints: 1247,        // puntos acumulados de ranking (temporada)
    redeemablePoints: 845,     // saldo canjeable
    streak: 6,                 // meses sobre meta
    medals: [
      { id: 'm1', icon: '🔥', name: 'Racha x6', desc: '6 meses sobre meta' },
      { id: 'm2', icon: '🚀', name: 'Súper cierre', desc: 'Cerró +115% en mayo' },
      { id: 'm3', icon: '🎯', name: 'Cobertura 100%', desc: 'Visitó toda su ruta' },
      { id: 'm4', icon: '⚡', name: 'Madrugador', desc: '20 días con venta antes de 10am' },
    ],
  };
  ME.compliance = +(ME.sold / ME.budget * 100).toFixed(1);

  // ---- Ranking nacional ----
  const RANKING = [
    { id: 'v007', name: 'María Coc',        route: 'GT-007', zone: 'Occidente',     pts: 1632, comp: 121, trend: 'up' },
    { id: 'v021', name: 'Luis Tzún',        route: 'GT-021', zone: 'Norte',         pts: 1498, comp: 116, trend: 'up' },
    { id: 'v003', name: 'Ana Set',          route: 'GT-003', zone: 'Sur',           pts: 1355, comp: 109, trend: 'down' },
    { id: 'v014', name: 'Carlos Méndez',    route: 'GT-014', zone: 'Metropolitana', pts: 1247, comp: 87,  trend: 'up', me: true },
    { id: 'v019', name: 'Diego Pop',        route: 'GT-019', zone: 'Oriente',       pts: 1190, comp: 103, trend: 'up' },
    { id: 'v002', name: 'Sofía Xol',        route: 'GT-002', zone: 'Metropolitana', pts: 1088, comp: 98,  trend: 'down' },
    { id: 'v028', name: 'Jorge Caal',       route: 'GT-028', zone: 'Norte',         pts: 1004, comp: 95,  trend: 'up' },
    { id: 'v011', name: 'Elena Ical',       route: 'GT-011', zone: 'Occidente',     pts: 921,  comp: 90,  trend: 'flat' },
    { id: 'v016', name: 'Mateo Chub',       route: 'GT-016', zone: 'Sur',           pts: 870,  comp: 84,  trend: 'down' },
    { id: 'v023', name: 'Lucía Bac',        route: 'GT-023', zone: 'Oriente',       pts: 812,  comp: 82,  trend: 'up' },
  ];

  // ---- Catálogo de premios ----
  const PRIZES = [
    { id: 'p1', name: 'Smart TV 50" 4K',        cost: 2400, stock: 8,  cat: 'Tecnología', emoji: '📺', tag: 'Top' },
    { id: 'p2', name: 'Smartphone 128GB',       cost: 1600, stock: 12, cat: 'Tecnología', emoji: '📱', tag: 'Top' },
    { id: 'p3', name: 'Audífonos Inalámbricos', cost: 420,  stock: 30, cat: 'Tecnología', emoji: '🎧', tag: '' },
    { id: 'p4', name: 'Gift Card Q500',         cost: 500,  stock: 99, cat: 'Vales',      emoji: '🎁', tag: 'Popular' },
    { id: 'p5', name: 'Gift Card Q200',         cost: 200,  stock: 99, cat: 'Vales',      emoji: '💳', tag: '' },
    { id: 'p6', name: 'Licuadora Pro',          cost: 650,  stock: 15, cat: 'Hogar',      emoji: '🍹', tag: '' },
    { id: 'p7', name: 'Mochila Campeón',        cost: 180,  stock: 50, cat: 'Marca',      emoji: '🎒', tag: '' },
    { id: 'p8', name: 'Bono Combustible Q300',  cost: 300,  stock: 40, cat: 'Vales',      emoji: '⛽', tag: '' },
  ];

  // ---- Alertas de canje pendientes (Admin) ----
  const REDEMPTIONS = [
    { id: 'r1', vendor: 'María Coc',     route: 'GT-007', prize: 'Smart TV 50" 4K',   cost: 2400, date: '2026-06-01', status: 'pendiente' },
    { id: 'r2', vendor: 'Diego Pop',     route: 'GT-019', prize: 'Audífonos Inalám.', cost: 420,  date: '2026-05-31', status: 'pendiente' },
    { id: 'r3', vendor: 'Ana Set',       route: 'GT-003', prize: 'Gift Card Q500',    cost: 500,  date: '2026-05-30', status: 'aprobado' },
    { id: 'r4', vendor: 'Sofía Xol',     route: 'GT-002', prize: 'Mochila Campeón',   cost: 180,  date: '2026-05-29', status: 'entregado' },
  ];

  // ---- Usuarios / mapeo Chat ID → Ruta (Admin) ----
  const USERS = [
    { id: 'v014', name: 'Carlos Méndez', route: 'GT-014', zone: 'Metropolitana', chatId: 728401193, status: 'activo',    lastSeen: 'Hoy 09:14' },
    { id: 'v007', name: 'María Coc',     route: 'GT-007', zone: 'Occidente',     chatId: 591023774, status: 'activo',    lastSeen: 'Hoy 08:52' },
    { id: 'v021', name: 'Luis Tzún',     route: 'GT-021', zone: 'Norte',         chatId: 803472119, status: 'activo',    lastSeen: 'Ayer 17:30' },
    { id: 'v003', name: 'Ana Set',       route: 'GT-003', zone: 'Sur',           chatId: 442910385, status: 'activo',    lastSeen: 'Hoy 07:41' },
    { id: 'v019', name: 'Diego Pop',     route: 'GT-019', zone: 'Oriente',       chatId: 0,         status: 'sin enlazar', lastSeen: '—' },
  ];

  // ---- Serie de venta diaria del vendedor (para mini-gráfico) ----
  const DAILY = [4.1, 3.6, 5.2, 4.8, 6.1, 2.0, 0, 5.4, 4.9, 6.6, 5.1, 4.2, 6.8, 3.1, 0, 5.9, 6.2, 7.0, 4.4, 5.8, 6.9, 7.2];
  // Serie de puntos emitidos por la red (Admin)
  const NETWORK_POINTS = [820, 910, 760, 1180, 1340, 990, 1420, 1610, 1280, 1750, 1880, 2010];
  const NETWORK_MONTHS = ['Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May','Jun'];

  function money(n) {
    return 'Q' + n.toLocaleString('es-GT', { maximumFractionDigits: 0 });
  }

  window.CDA = {
    RULES, LEVELS, PERIOD, ME, RANKING, PRIZES, REDEMPTIONS, USERS,
    DAILY, NETWORK_POINTS, NETWORK_MONTHS,
    pointsForCompliance, pointsBreakdown, tierForCompliance,
    projectCompliance, levelFor, money,
  };
})();
