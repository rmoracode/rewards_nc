/* Campeón del Abarrote — componentes compartidos + vistas Carrera/Premios/Perfil */
const { useState, useEffect, useRef } = React;
const C = window.CDA;

/* ---------- hook: animar número con easing al montar ---------- */
function useEase(target, dur = 1100, deps = []) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start, done = false;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setV(target * e);
      if (p < 1) raf = requestAnimationFrame(tick); else done = true;
    };
    raf = requestAnimationFrame(tick);
    // Fallback: si rAF se ahoga (iframe en segundo plano), garantizar estado final.
    const fb = setTimeout(() => { if (!done) setV(target); }, dur + 250);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
    // eslint-disable-next-line
  }, deps);
  return v;
}

/* ---------- Gauge tipo velocímetro ---------- */
function Gauge({ pct }) {
  const val = useEase(pct, 1300);
  const R = 82, CIRC = 2 * Math.PI * R, ARC = 0.75; // 270°
  const maxScale = 130;
  const frac = Math.min(1, val / maxScale);
  const tier = C.tierForCompliance(pct);
  const visible = ARC * CIRC;
  const dash = `${visible * frac} ${CIRC}`;
  const ticks = [50, 80, 100, 120];
  return (
    <div style={{ position: 'relative', width: 220, height: 196, margin: '0 auto' }}>
      <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(135deg)' }}>
        <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="16"
          strokeDasharray={`${visible} ${CIRC}`} strokeLinecap="round" />
        <circle cx="110" cy="110" r={R} fill="none" stroke={tier.color} strokeWidth="16"
          strokeDasharray={dash} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${tier.color}88)` }} />
      </svg>
      {ticks.map((tk) => {
        const a = (135 + (tk / maxScale) * 270) * Math.PI / 180;
        const rr = R + 18;
        const x = 110 + rr * Math.cos(a), y = 110 + rr * Math.sin(a);
        return <span key={tk} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', fontSize: 10, color: 'rgba(255,255,255,.45)', fontWeight: 700 }}>{tk}</span>;
      })}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 22 }}>
        <div className="disp" style={{ fontSize: 58, color: '#fff', lineHeight: .8 }}>{Math.round(val)}<span style={{ fontSize: 26, color: tier.color }}>%</span></div>
        <div className="cond" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', fontWeight: 700, marginTop: 4 }}>Cumplimiento</div>
        <div style={{ marginTop: 7, background: tier.color, color: pct > 100 || pct <= 80 ? '#0c1c40' : '#fff', fontWeight: 800, fontSize: 11, padding: '3px 11px', borderRadius: 20, letterSpacing: '.03em' }}>×{tier.rate} pts / %</div>
      </div>
    </div>
  );
}

/* ---------- mini-gráfico de venta diaria ---------- */
function SparkBars({ data }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 46 }}>
      {data.map((d, i) => (
        <div key={i} title={`Día ${i + 1}`} style={{ flex: 1, height: d === 0 ? 3 : `${(d / max) * 100}%`,
          minHeight: 3, borderRadius: 2,
          background: d === 0 ? 'rgba(255,255,255,.12)' : 'linear-gradient(180deg,var(--aje-green-l),var(--aje-green))' }} />
      ))}
    </div>
  );
}

/* ---------- barra de nivel ---------- */
function LevelBar({ points }) {
  const { cur, next } = C.levelFor(points);
  const lo = cur.min, hi = next ? next.min : cur.min + 800;
  const prog = Math.min(1, (points - lo) / (hi - lo));
  const w = useEase(prog * 100, 1200);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, color: '#fff', fontSize: 15 }}>
          <span style={{ fontSize: 18 }}>{cur.icon}</span> Nivel {cur.name}
        </span>
        {next && <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', fontWeight: 600 }}>{(hi - points).toLocaleString('es-GT')} pts → {next.name}</span>}
      </div>
      <div style={{ height: 9, borderRadius: 6, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${w}%`, borderRadius: 6, background: 'linear-gradient(90deg,var(--yellow),#ffaa00)', boxShadow: '0 0 10px rgba(255,204,0,.5)' }} />
      </div>
    </div>
  );
}

/* ============ VISTA: CARRERA AL ÉXITO (ranking) ============ */
function RankingView() {
  const [scope, setScope] = useState('Nacional');
  const data = C.RANKING;
  const podium = [data[1], data[0], data[2]]; // 2°,1°,3°
  const heights = [88, 116, 70];
  return (
    <div style={{ padding: '14px 16px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <h1 className="disp" style={{ fontSize: 30, color: '#fff', margin: 0, lineHeight: 1.0 }}>CARRERA AL ÉXITO</h1>
      </div>
      <p style={{ margin: '0 0 14px', color: 'rgba(255,255,255,.55)', fontSize: 13, fontWeight: 600 }}>Ranking · {C.PERIOD.label}</p>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18, background: 'rgba(255,255,255,.06)', padding: 4, borderRadius: 12 }}>
        {['Nacional', 'Mi zona'].map((s) => (
          <button key={s} onClick={() => setScope(s)} style={{ flex: 1, border: 'none', cursor: 'pointer', padding: '8px', borderRadius: 9, fontWeight: 800, fontSize: 13, fontFamily: 'inherit',
            background: scope === s ? 'var(--yellow)' : 'transparent', color: scope === s ? '#0c1c40' : 'rgba(255,255,255,.65)' }}>{s}</button>
        ))}
      </div>

      {/* Podio */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
        {podium.map((p, i) => {
          const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
          const medal = ['🥇', '🥈', '🥉'][rank - 1];
          return (
            <div key={p.id} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: rank === 1 ? 26 : 20, marginBottom: 2 }}>{medal}</div>
              <div style={{ width: 44, height: 44, borderRadius: '50%', margin: '0 auto 6px', background: 'linear-gradient(135deg,var(--aje-green-l),var(--aje-green))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, border: rank === 1 ? '2px solid var(--yellow)' : '2px solid rgba(255,255,255,.2)' }}>{p.name.split(' ').map(n => n[0]).join('')}</div>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 12, lineHeight: 1.05 }}>{p.name.split(' ')[0]}</div>
              <div style={{ color: 'var(--yellow)', fontWeight: 800, fontSize: 13 }}>{p.pts.toLocaleString('es-GT')}</div>
              <div style={{ height: heights[i], background: rank === 1 ? 'linear-gradient(180deg,var(--yellow),#e6b800)' : 'rgba(255,255,255,.10)', borderRadius: '10px 10px 0 0', marginTop: 6, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8 }}>
                <span className="disp" style={{ fontSize: 28, color: rank === 1 ? '#0c1c40' : 'rgba(255,255,255,.5)' }}>{rank}°</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {data.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 13,
            background: p.me ? 'linear-gradient(90deg,rgba(0,135,81,.35),rgba(0,135,81,.12))' : 'rgba(255,255,255,.05)',
            border: p.me ? '1.5px solid var(--aje-green-l)' : '1px solid rgba(255,255,255,.06)' }}>
            <span className="disp" style={{ fontSize: 19, width: 26, textAlign: 'center', color: i < 3 ? 'var(--yellow)' : 'rgba(255,255,255,.5)' }}>{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, whiteSpace: 'nowrap' }}>{p.name} {p.me && <span style={{ fontSize: 10, background: 'var(--yellow)', color: '#0c1c40', padding: '1px 6px', borderRadius: 6, marginLeft: 4 }}>TÚ</span>}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>Ruta {p.route} · {p.zone}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, color: 'var(--yellow)', fontSize: 15 }}>{p.pts.toLocaleString('es-GT')}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 700 }}>{p.comp}% {p.trend === 'up' ? '▲' : p.trend === 'down' ? '▼' : '–'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ VISTA: PREMIOS (catálogo de canje) ============ */
function PremiosView({ balance, onRedeem }) {
  const [cat, setCat] = useState('Todos');
  const [confirm, setConfirm] = useState(null);
  const [done, setDone] = useState(null);
  const cats = ['Todos', 'Tecnología', 'Vales', 'Hogar', 'Marca'];
  const list = C.PRIZES.filter((p) => cat === 'Todos' || p.cat === cat);

  return (
    <div style={{ padding: '14px 16px 26px' }}>
      <h1 className="disp" style={{ fontSize: 30, color: '#fff', margin: '0 0 12px', lineHeight: 1.0 }}>CATÁLOGO DE CANJE</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(90deg,var(--aje-green),var(--aje-green-d))', borderRadius: 14, padding: '12px 15px', margin: '12px 0 16px' }}>
        <span style={{ fontSize: 22 }}>💰</span>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 700, letterSpacing: '.08em' }}>SALDO CANJEABLE</div>
          <div className="disp" style={{ fontSize: 26, color: '#fff' }}>{balance.toLocaleString('es-GT')} <span style={{ fontSize: 14, color: 'var(--yellow)' }}>pts</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', marginBottom: 16, paddingBottom: 2 }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{ whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: 20, fontWeight: 700, fontSize: 12.5, fontFamily: 'inherit',
            background: cat === c ? 'var(--yellow)' : 'rgba(255,255,255,.08)', color: cat === c ? '#0c1c40' : 'rgba(255,255,255,.7)' }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
        {list.map((p) => {
          const can = balance >= p.cost;
          return (
            <div key={p.id} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 12, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              {p.tag && <span style={{ position: 'absolute', top: 9, right: 9, fontSize: 9, fontWeight: 800, background: 'var(--orange)', color: '#fff', padding: '2px 7px', borderRadius: 6, letterSpacing: '.05em' }}>{p.tag.toUpperCase()}</span>}
              <div style={{ fontSize: 40, textAlign: 'center', margin: '6px 0 10px' }}>{p.emoji}</div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 13.5, lineHeight: 1.15, minHeight: 34 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', fontWeight: 600, margin: '2px 0 9px' }}>Stock: {p.stock}</div>
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="disp" style={{ fontSize: 20, color: 'var(--yellow)' }}>{p.cost.toLocaleString('es-GT')}</span>
                <button disabled={!can} onClick={() => setConfirm(p)} style={{ border: 'none', cursor: can ? 'pointer' : 'not-allowed', fontFamily: 'inherit', fontWeight: 800, fontSize: 12, padding: '7px 12px', borderRadius: 9,
                  background: can ? 'var(--aje-green)' : 'rgba(255,255,255,.08)', color: can ? '#fff' : 'rgba(255,255,255,.35)' }}>{can ? 'Canjear' : 'Faltan'}</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal confirmar */}
      {confirm && (
        <div onClick={() => setConfirm(null)} style={ovl}>
          <div onClick={(e) => e.stopPropagation()} style={sheet}>
            <div style={{ fontSize: 48, textAlign: 'center' }}>{confirm.emoji}</div>
            <h3 style={{ textAlign: 'center', margin: '8px 0 2px', color: '#fff', fontSize: 19, fontWeight: 800 }}>{confirm.name}</h3>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.6)', margin: '0 0 16px', fontSize: 13.5 }}>Canjearás <b style={{ color: 'var(--yellow)' }}>{confirm.cost.toLocaleString('es-GT')} pts</b>. Saldo restante: <b style={{ color: '#fff' }}>{(balance - confirm.cost).toLocaleString('es-GT')} pts</b>.</p>
            <div style={{ background: 'rgba(255,204,0,.12)', border: '1px solid rgba(255,204,0,.3)', borderRadius: 10, padding: '9px 12px', fontSize: 12, color: 'var(--yellow)', fontWeight: 600, marginBottom: 16 }}>📨 Se enviará una alerta al administrador para gestionar tu entrega.</div>
            <div style={{ display: 'flex', gap: 9 }}>
              <button onClick={() => setConfirm(null)} style={{ ...btn, background: 'rgba(255,255,255,.1)', color: '#fff' }}>Cancelar</button>
              <button onClick={() => { onRedeem(confirm.cost); setDone(confirm); setConfirm(null); }} style={{ ...btn, background: 'var(--aje-green)', color: '#fff' }}>Confirmar canje</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal éxito */}
      {done && (
        <div onClick={() => setDone(null)} style={ovl}>
          <div onClick={(e) => e.stopPropagation()} style={{ ...sheet, textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--aje-green)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
            <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: 20, fontWeight: 800 }}>¡Canje exitoso!</h3>
            <p style={{ color: 'rgba(255,255,255,.65)', margin: '0 0 18px', fontSize: 14 }}>Tu solicitud de <b style={{ color: '#fff' }}>{done.name}</b> fue registrada. El admin coordinará la entrega por Telegram.</p>
            <button onClick={() => setDone(null)} style={{ ...btn, background: 'var(--yellow)', color: '#0c1c40' }}>Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ VISTA: PERFIL ============ */
function PerfilView() {
  const me = C.ME;
  const { cur } = C.levelFor(me.seasonPoints);
  return (
    <div style={{ padding: '14px 16px 26px' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ width: 78, height: 78, borderRadius: '50%', margin: '0 auto 10px', background: 'linear-gradient(135deg,var(--aje-green-l),var(--aje-green))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 28, border: '3px solid var(--yellow)' }}>{me.avatar}</div>
        <h1 style={{ color: '#fff', margin: 0, fontSize: 22, fontWeight: 800 }}>{me.name}</h1>
        <p style={{ color: 'rgba(255,255,255,.55)', margin: '2px 0 0', fontSize: 13, fontWeight: 600 }}>Ruta {me.route} · {me.zone}</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, background: 'rgba(255,204,0,.15)', color: 'var(--yellow)', padding: '4px 12px', borderRadius: 20, fontWeight: 800, fontSize: 13 }}>{cur.icon} Campeón {cur.name}</span>
      </div>

      <h2 className="cond" style={{ color: '#fff', fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 800 }}>Medallero</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        {me.medals.map((m) => (
          <div key={m.id} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 26 }}>{m.icon}</span>
            <div><div style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>{m.name}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 600, lineHeight: 1.1 }}>{m.desc}</div></div>
          </div>
        ))}
      </div>

      <h2 className="cond" style={{ color: '#fff', fontSize: 14, letterSpacing: '.1em', textTransform: 'uppercase', margin: '0 0 10px', fontWeight: 800 }}>Sesión de Telegram</h2>
      <div style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '14px 16px' }}>
        <Row k="Estado" v={<span style={{ color: 'var(--aje-green-l)', fontWeight: 800 }}>● Identidad verificada</span>} />
        <Row k="Chat ID" v={<span style={{ fontFamily: 'monospace', color: '#fff' }}>{me.chatId}</span>} />
        <Row k="Ruta enlazada" v={<span style={{ color: '#fff', fontWeight: 700 }}>{me.route}</span>} />
        <Row k="Método" v={<span style={{ color: 'rgba(255,255,255,.7)' }}>Webhook · sin contraseña</span>} last />
      </div>
      <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.4)', marginTop: 12, lineHeight: 1.4 }}>Tu identidad se reconoce automáticamente desde Telegram. No necesitas usuario ni contraseña.</p>
    </div>
  );
}
function Row({ k, v, last }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,.07)', fontSize: 13.5 }}>
    <span style={{ color: 'rgba(255,255,255,.55)', fontWeight: 600 }}>{k}</span>{v}</div>;
}

const ovl = { position: 'absolute', inset: 0, background: 'rgba(6,14,34,.78)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end', zIndex: 40, animation: 'fade .2s' };
const sheet = { width: '100%', background: 'linear-gradient(180deg,#16294f,#0e1f44)', borderRadius: '22px 22px 0 0', padding: '22px 20px 26px', border: '1px solid rgba(255,255,255,.1)', borderBottom: 'none' };
const btn = { flex: 1, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: 14.5, padding: '13px', borderRadius: 12 };

Object.assign(window, { useEase, Gauge, SparkBars, LevelBar, RankingView, PremiosView, PerfilView });
