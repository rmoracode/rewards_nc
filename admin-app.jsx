/* Panel Admin — shell (sidebar/topbar) + Dashboard */
const D = window.CDA;

const NAV = [
  { id: 'dash', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { id: 'premios', label: 'Premios', icon: 'M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7a3 3 0 10-3-3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3 3' },
  { id: 'ventas', label: 'Cargar Ventas', icon: 'M4 4h16v16H4zM8 4v16M4 9h16M4 14h16' },
  { id: 'usuarios', label: 'Vendedores', icon: 'M17 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9.5 10a4 4 0 100-8 4 4 0 000 8zM23 20v-2a4 4 0 00-3-3.87M16 3.13A4 4 0 0116 11' },
  { id: 'reglas', label: 'Reglas de Puntos', icon: 'M12 2v4m0 12v4M2 12h4m12 0h4M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5' },
];

function Kpi({ label, value, unit, delta, deltaUp, icon, accent }) {
  return (
    <Card style={{ flex: 1, minWidth: 200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</div>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: accent.bg, color: accent.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{icon}</div>
      </div>
      <div className="disp" style={{ fontSize: 42, color: 'var(--navy)', marginTop: 8 }}>{value}<span style={{ fontSize: 18, color: 'var(--slate)', marginLeft: 4 }}>{unit}</span></div>
      {delta && <div style={{ fontSize: 13, fontWeight: 700, color: deltaUp ? 'var(--aje-green)' : 'var(--red)', marginTop: 2 }}>{deltaUp ? '▲' : '▼'} {delta}</div>}
    </Card>
  );
}

function Dashboard() {
  const activos = D.USERS.filter((u) => u.status === 'activo').length;
  const pendientes = D.REDEMPTIONS.filter((r) => r.status === 'pendiente').length;
  const avgComp = Math.round(D.RANKING.reduce((s, r) => s + r.comp, 0) / D.RANKING.length);
  const emitidos = D.NETWORK_POINTS[D.NETWORK_POINTS.length - 1];

  return (
    <div>
      <SectionHead title="DASHBOARD" sub={`Resumen de la campaña · ${D.PERIOD.label}`} />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <Kpi label="Vendedores activos" value={activos} unit={`/ ${D.USERS.length}`} delta="1 sin enlazar" deltaUp={false} icon="👥" accent={{ bg: '#eaf1ff', fg: '#2a5bd7' }} />
        <Kpi label="Puntos emitidos" value={emitidos.toLocaleString('es-GT')} delta="6.9% vs. mayo" deltaUp icon="⭐" accent={{ bg: '#fff4d1', fg: '#b8860b' }} />
        <Kpi label="Canjes pendientes" value={pendientes} delta="requieren acción" deltaUp={false} icon="📨" accent={{ bg: '#ffe9e0', fg: 'var(--orange)' }} />
        <Kpi label="Cumplimiento prom." value={avgComp} unit="%" delta="meta nacional 100%" deltaUp icon="🎯" accent={{ bg: 'var(--green-soft)', fg: 'var(--aje-green)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 20, marginBottom: 20 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h3 className="cond" style={{ margin: 0, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 800 }}>Puntos emitidos por la red</h3>
            <Pill color="var(--aje-green-d)" bg="var(--green-soft)">Últimos 12 meses</Pill>
          </div>
          <NetChart />
        </Card>
        <Card pad={0}>
          <div style={{ padding: '18px 22px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="cond" style={{ margin: 0, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 800 }}>Alertas de canje</h3>
            <Pill color="#fff" bg="var(--orange)">{pendientes} nuevos</Pill>
          </div>
          <div>
            {D.REDEMPTIONS.map((r) => {
              const st = { pendiente: ['#9a6a00', '#fdf3d6', 'Pendiente'], aprobado: ['#2a5bd7', '#eaf1ff', 'Aprobado'], entregado: ['var(--aje-green-d)', 'var(--green-soft)', 'Entregado'] }[r.status];
              return (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderTop: '1px solid var(--line)' }}>
                  <span style={{ width: 36, height: 36, borderRadius: 9, background: '#f1f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎁</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.prize}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--slate)' }}>{r.vendor} · {r.route} · {r.cost.toLocaleString('es-GT')} pts</div>
                  </div>
                  <Pill color={st[0]} bg={st[1]}>{st[2]}</Pill>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card pad={0}>
        <div style={{ padding: '18px 22px 14px' }}>
          <h3 className="cond" style={{ margin: 0, fontSize: 16, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--navy)', fontWeight: 800 }}>🏆 Líderes nacionales</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ textAlign: 'left', color: 'var(--slate)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em', background: '#fafbfd' }}>
            <th style={th}>#</th><th style={th}>Vendedor</th><th style={th}>Ruta</th><th style={th}>Zona</th><th style={{ ...th, textAlign: 'right' }}>Cumplimiento</th><th style={{ ...th, textAlign: 'right' }}>Puntos temporada</th>
          </tr></thead>
          <tbody>
            {D.RANKING.slice(0, 6).map((p, i) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ ...td }}><span className="disp" style={{ fontSize: 18, color: i < 3 ? 'var(--yellow-d)' : 'var(--slate-l)' }}>{i + 1}</span></td>
                <td style={{ ...td, fontWeight: 700 }}>{p.name}</td>
                <td style={{ ...td, fontWeight: 800, color: 'var(--navy)' }}>{p.route}</td>
                <td style={{ ...td, color: 'var(--slate)' }}>{p.zone}</td>
                <td style={{ ...td, textAlign: 'right' }}><Pill color={p.comp > 100 || p.comp <= 80 ? '#0c1c40' : '#fff'} bg={D.tierForCompliance(p.comp).color}>{p.comp}%</Pill></td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 800, color: 'var(--aje-green)', fontSize: 16 }} className="disp">{p.pts.toLocaleString('es-GT')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdminApp() {
  const [view, setView] = useState('dash');
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 252, background: 'var(--navy)', color: '#fff', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flex: '0 0 auto' }}>
        <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,var(--aje-green-l),var(--aje-green))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, border: '2px solid var(--yellow)' }}>🏆</div>
            <div style={{ lineHeight: 1.05 }}>
              <div className="disp" style={{ fontSize: 19, color: '#fff' }}>CAMPEÓN</div>
              <div style={{ fontSize: 11, color: 'var(--yellow)', fontWeight: 800, letterSpacing: '.14em' }}>DEL ABARROTE</div>
            </div>
          </div>
        </div>
        <nav style={{ padding: '14px 12px', flex: 1 }}>
          {NAV.map((n) => {
            const on = view === n.id;
            return (
              <button key={n.id} onClick={() => setView(n.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 4, borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: on ? 'rgba(255,255,255,.10)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,.62)', fontWeight: on ? 800 : 600, fontSize: 14.5, position: 'relative' }}>
                {on && <span style={{ position: 'absolute', left: 0, top: 9, bottom: 9, width: 3, borderRadius: 3, background: 'var(--yellow)' }}></span>}
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d={n.icon} stroke={on ? 'var(--yellow)' : 'currentColor'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {n.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: '16px 22px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.4)', fontWeight: 700, letterSpacing: '.12em', marginBottom: 10 }}>MARCAS PARTICIPANTES</div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <img src="assets/dgussto.png" alt="D'Gussto" style={{ height: 26, filter: 'brightness(0) invert(1)', opacity: .92 }} />
            <img src="assets/dest.png" alt="Dest" style={{ height: 30, opacity: .95 }} />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: 64, background: '#fff', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--slate)', fontSize: 14, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aje-green)' }}></span>
            Período activo: <b style={{ color: 'var(--ink)' }}>{D.PERIOD.label}</b> · día {D.PERIOD.daysElapsed}/{D.PERIOD.daysTotal}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', position: 'relative', color: 'var(--slate)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ position: 'absolute', top: -3, right: -3, width: 16, height: 16, borderRadius: '50%', background: 'var(--orange)', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Admin · Trade Mkt</div>
                <div style={{ fontSize: 12, color: 'var(--slate)' }}>AJE Snacks GT</div>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>AJ</div>
            </div>
          </div>
        </header>
        <main style={{ padding: 30, flex: 1 }}>
          {view === 'dash' && <Dashboard />}
          {view === 'premios' && <PremiosAdmin />}
          {view === 'ventas' && <VentasView />}
          {view === 'usuarios' && <UsuariosView />}
          {view === 'reglas' && <ReglasView />}
        </main>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
