/* Campeón del Abarrote — App del Vendedor (Dashboard + navegación) */
const CC = window.CDA;

function StatCard({ label, value, unit, sub, accent }) {
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: '13px 14px' }}>
      <div style={{ fontSize: 10.5, letterSpacing: '.07em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', fontWeight: 700, lineHeight: 1.2, minHeight: 26 }}>{label}</div>
      <div className="disp" style={{ fontSize: 32, color: accent || '#fff', marginTop: 3 }}>{value}<span style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', marginLeft: 3 }}>{unit}</span></div>
      <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.55)', fontWeight: 600, marginTop: 1 }}>{sub}</div>
    </div>
  );
}

function Card({ children, title, right, style }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 18, padding: 16, ...style }}>
      {title && <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span className="cond" style={{ fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', fontWeight: 800 }}>{title}</span>{right}</div>}
      {children}
    </div>
  );
}

function Inicio() {
  const me = CC.ME;
  const monthPts = CC.pointsForCompliance(me.compliance);
  const projPct = CC.projectCompliance(me.compliance, CC.PERIOD.daysElapsed, CC.PERIOD.daysTotal);
  const projPts = CC.pointsForCompliance(projPct);
  const breakdown = CC.pointsBreakdown(me.compliance);
  const dayProg = Math.round(CC.PERIOD.daysElapsed / CC.PERIOD.daysTotal * 100);

  return (
    <div style={{ padding: '12px 16px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* saludo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--aje-green-l),var(--aje-green))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16, border: '2px solid var(--yellow)' }}>{me.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>¡Hola, {me.name.split(' ')[0]}! 👋</div>
          <div style={{ color: 'rgba(255,255,255,.55)', fontSize: 12.5, fontWeight: 600 }}>Ruta {me.route} · {CC.PERIOD.label}</div>
        </div>
        <div style={{ background: 'rgba(249,115,22,.18)', color: 'var(--orange)', borderRadius: 12, padding: '6px 10px', textAlign: 'center', fontWeight: 800, fontSize: 12, lineHeight: 1 }}>🔥<div style={{ marginTop: 2 }}>x{me.streak}</div></div>
      </div>

      {/* gauge hero */}
      <div style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,135,81,.22), rgba(255,255,255,.04) 70%)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 22, padding: '16px 16px 18px' }}>
        <Gauge pct={me.compliance} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, padding: '0 6px' }}>
          <div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.5)', fontWeight: 700, letterSpacing: '.06em' }}>VENDIDO</div>
            <div className="disp" style={{ fontSize: 22, color: '#fff' }}>{CC.money(me.sold)}</div>
          </div>
          <div style={{ height: 30, width: 1, background: 'rgba(255,255,255,.12)' }}></div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,.5)', fontWeight: 700, letterSpacing: '.06em' }}>PRESUPUESTO</div>
            <div className="disp" style={{ fontSize: 22, color: 'rgba(255,255,255,.8)' }}>{CC.money(me.budget)}</div>
          </div>
        </div>
      </div>

      {/* puntos del mes / proyectados */}
      <div style={{ display: 'flex', gap: 12 }}>
        <StatCard label="Puntos del mes" value={monthPts} unit="pts" sub="ganados hasta hoy" accent="var(--yellow)" />
        <StatCard label="Proyectado al cierre" value={projPts} unit="pts" sub={`si mantienes el ritmo (${Math.round(projPct)}%)`} accent="var(--aje-green-l)" />
      </div>

      {/* nivel */}
      <Card><LevelBar points={me.seasonPoints} /></Card>

      {/* desglose por tramo */}
      <Card title="Cómo se calculan tus puntos">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {breakdown.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: t.active ? 1 : .4 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: t.color, flex: '0 0 auto', boxShadow: t.active ? `0 0 6px ${t.color}` : 'none' }}></span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 700, width: 86 }}>{t.label}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>×{t.rate} pt/%</span>
              <span style={{ flex: 1, textAlign: 'right', fontWeight: 800, color: t.active ? 'var(--yellow)' : 'rgba(255,255,255,.4)', fontSize: 14 }}>{t.active ? `+${t.pts}` : '—'}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', marginTop: 4, paddingTop: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: '#fff', fontSize: 14 }}>Total del mes</span>
            <span className="disp" style={{ fontSize: 24, color: 'var(--yellow)' }}>{monthPts} pts</span>
          </div>
        </div>
      </Card>

      {/* ritmo diario */}
      <Card title="Ritmo de venta diaria" right={<span style={{ fontSize: 11.5, color: 'rgba(255,255,255,.55)', fontWeight: 700 }}>Día {CC.PERIOD.daysElapsed}/{CC.PERIOD.daysTotal} · {dayProg}%</span>}>
        <SparkBars data={CC.DAILY} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}><span>Inicio de mes</span><span>Hoy</span></div>
      </Card>

      {/* ranking teaser */}
      <div onClick={() => window.__go && window.__go('carrera')} style={{ cursor: 'pointer', background: 'linear-gradient(90deg,rgba(255,204,0,.16),rgba(255,204,0,.04))', border: '1px solid rgba(255,204,0,.25)', borderRadius: 18, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 13 }}>
        <span style={{ fontSize: 30 }}>🏆</span>
        <div style={{ flex: 1 }}>
          <div className="cond" style={{ fontSize: 11.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--yellow)', fontWeight: 800 }}>Carrera al Éxito</div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Vas en el puesto #4 nacional ▲</div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState('inicio');
  const [balance, setBalance] = useState(CC.ME.redeemablePoints);
  const appRef = useRef(null);
  useEffect(() => { window.__go = (t) => { setTab(t); }; }, []);
  useEffect(() => { if (appRef.current) appRef.current.scrollTop = 0; }, [tab]);

  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: 'M3 11l9-8 9 8M5 9v11h5v-6h4v6h5V9' },
    { id: 'carrera', label: 'Carrera', icon: 'M7 21V9m5 12V3m5 18v-7' },
    { id: 'premios', label: 'Premios', icon: 'M20 12v9H4v-9M2 7h20v5H2zM12 7v14M12 7a3 3 0 10-3-3 3 3 0 003 3 3 3 0 003-3 3 3 0 00-3 3' },
    { id: 'perfil', label: 'Perfil', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0' },
  ];

  return (
    <React.Fragment>
      <div ref={appRef} style={{ position: 'absolute', inset: 0, bottom: 68, overflowY: 'auto', overflowX: 'hidden' }} className="appscroll">
        {tab === 'inicio' && <Inicio />}
        {tab === 'carrera' && <RankingView />}
        {tab === 'premios' && <PremiosView balance={balance} onRedeem={(c) => setBalance((b) => b - c)} />}
        {tab === 'perfil' && <PerfilView />}
      </div>
      <nav style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 68, background: 'rgba(8,18,44,.96)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', paddingBottom: 6 }}>
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, fontFamily: 'inherit', paddingTop: 8 }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none"><path d={t.icon} stroke={on ? 'var(--yellow)' : 'rgba(255,255,255,.45)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 10.5, fontWeight: on ? 800 : 600, color: on ? 'var(--yellow)' : 'rgba(255,255,255,.5)' }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
