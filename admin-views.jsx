/* Panel Admin — componentes compartidos + vistas Premios/Ventas/Usuarios/Reglas */
const { useState, useEffect, useRef } = React;
const A = window.CDA;

/* ---------- primitivas ---------- */
function Card({ children, style, pad = 22 }) {
  return <div style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: pad, boxShadow: '0 1px 2px rgba(15,27,51,.04)', ...style }}>{children}</div>;
}
function SectionHead({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
      <div>
        <h1 className="disp" style={{ fontSize: 34, margin: 0, color: 'var(--navy)' }}>{title}</h1>
        {sub && <p style={{ margin: '4px 0 0', color: 'var(--slate)', fontSize: 14.5, fontWeight: 500 }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
function Btn({ children, onClick, kind = 'primary', size, style }) {
  const styles = {
    primary: { background: 'var(--aje-green)', color: '#fff' },
    ghost: { background: '#fff', color: 'var(--ink)', border: '1px solid var(--line-d)' },
    yellow: { background: 'var(--yellow)', color: 'var(--navy)' },
    danger: { background: '#fff', color: 'var(--red)', border: '1px solid #f3c9c6' },
  }[kind];
  return <button onClick={onClick} style={{ border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: size === 'sm' ? 13 : 14.5, padding: size === 'sm' ? '7px 13px' : '10px 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 7, ...styles, ...style }}>{children}</button>;
}
function Pill({ children, color, bg }) {
  return <span style={{ fontSize: 12, fontWeight: 800, color, background: bg, padding: '3px 10px', borderRadius: 20, letterSpacing: '.02em', whiteSpace: 'nowrap' }}>{children}</span>;
}
function Field({ label, children }) {
  return <label style={{ display: 'block', marginBottom: 14 }}>
    <span style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--slate)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
    {children}
  </label>;
}
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--line-d)', borderRadius: 10, fontSize: 14.5, fontFamily: 'inherit', color: 'var(--ink)', background: '#fff', outline: 'none' };
function Modal({ children, onClose, w = 460 }) {
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(12,28,64,.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
    <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 18, padding: 26, width: w, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 30px 80px -20px rgba(12,28,64,.5)' }}>{children}</div>
  </div>;
}

/* ---------- gráfico de barras (puntos emitidos por la red) ---------- */
function NetChart() {
  const data = A.NETWORK_POINTS, labels = A.NETWORK_MONTHS;
  const max = Math.max(...data);
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, paddingTop: 10 }}>
      {data.map((d, i) => {
        const last = i === data.length - 1;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11.5, fontWeight: 800, color: last ? 'var(--aje-green)' : 'var(--slate-l)' }}>{(d / 1000).toFixed(1)}k</span>
            <div style={{ width: '100%', maxWidth: 30, height: on ? `${(d / max) * 100}%` : 0, borderRadius: '6px 6px 0 0', transition: `height .9s cubic-bezier(.22,1,.36,1) ${i * 50}ms`,
              background: last ? 'linear-gradient(180deg,var(--aje-green-l),var(--aje-green))' : '#cdd6e4' }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--slate)' }}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ============ PREMIOS (gestión) ============ */
function PremiosAdmin() {
  const [prizes, setPrizes] = useState(A.PRIZES.map((p) => ({ ...p })));
  const [edit, setEdit] = useState(null); // objeto premio o {nuevo:true}
  const blank = { name: '', cost: 500, stock: 10, cat: 'Tecnología', emoji: '🎁', tag: '' };

  function save(form) {
    if (form.id) setPrizes((ps) => ps.map((p) => p.id === form.id ? form : p));
    else setPrizes((ps) => [...ps, { ...form, id: 'p' + Date.now() }]);
    setEdit(null);
  }
  function del(id) { setPrizes((ps) => ps.filter((p) => p.id !== id)); }

  return (
    <div>
      <SectionHead title="CATÁLOGO DE PREMIOS" sub={`${prizes.length} premios publicados · canjeables por los vendedores`}
        action={<Btn kind="primary" onClick={() => setEdit({ ...blank })}>＋ Nuevo premio</Btn>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(232px,1fr))', gap: 16 }}>
        {prizes.map((p) => (
          <Card key={p.id} pad={0} style={{ overflow: 'hidden' }}>
            <div style={{ height: 96, background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, position: 'relative' }}>
              {p.emoji}
              {p.tag && <span style={{ position: 'absolute', top: 10, right: 10 }}><Pill color="#fff" bg="var(--orange)">{p.tag}</Pill></span>}
            </div>
            <div style={{ padding: 15 }}>
              <Pill color="var(--aje-green-d)" bg="var(--green-soft)">{p.cat}</Pill>
              <div style={{ fontWeight: 700, fontSize: 16, margin: '8px 0 2px' }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="disp" style={{ fontSize: 24, color: 'var(--aje-green)' }}>{p.cost.toLocaleString('es-GT')}</span>
                <span style={{ fontSize: 12.5, color: 'var(--slate)', fontWeight: 600 }}>pts · stock {p.stock}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
                <Btn kind="ghost" size="sm" onClick={() => setEdit({ ...p })} style={{ flex: 1, justifyContent: 'center' }}>Editar</Btn>
                <Btn kind="danger" size="sm" onClick={() => del(p.id)}>🗑</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {edit && <PrizeForm prize={edit} onSave={save} onClose={() => setEdit(null)} />}
    </div>
  );
}
function PrizeForm({ prize, onSave, onClose }) {
  const [f, setF] = useState(prize);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const emojis = ['📺', '📱', '🎧', '🎁', '💳', '🍹', '🎒', '⛽', '⌚', '🎮', '☕', '🏆'];
  return (
    <Modal onClose={onClose}>
      <h2 className="disp" style={{ fontSize: 26, margin: '0 0 18px', color: 'var(--navy)' }}>{f.id ? 'Editar premio' : 'Nuevo premio'}</h2>
      <Field label="Imagen / ícono">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {emojis.map((e) => <button key={e} onClick={() => set('emoji', e)} style={{ fontSize: 22, width: 42, height: 42, borderRadius: 10, cursor: 'pointer', border: f.emoji === e ? '2px solid var(--aje-green)' : '1px solid var(--line-d)', background: f.emoji === e ? 'var(--green-soft)' : '#fff' }}>{e}</button>)}
        </div>
      </Field>
      <Field label="Nombre del premio"><input style={inputStyle} value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Smart TV 50″" /></Field>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}><Field label="Costo (pts)"><input type="number" style={inputStyle} value={f.cost} onChange={(e) => set('cost', +e.target.value)} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Stock"><input type="number" style={inputStyle} value={f.stock} onChange={(e) => set('stock', +e.target.value)} /></Field></div>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flex: 1 }}><Field label="Categoría">
          <select style={inputStyle} value={f.cat} onChange={(e) => set('cat', e.target.value)}>{['Tecnología', 'Vales', 'Hogar', 'Marca'].map((c) => <option key={c}>{c}</option>)}</select>
        </Field></div>
        <div style={{ flex: 1 }}><Field label="Etiqueta (opcional)"><input style={inputStyle} value={f.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Top, Popular…" /></Field></div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Btn kind="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancelar</Btn>
        <Btn kind="primary" onClick={() => onSave(f)} style={{ flex: 1, justifyContent: 'center' }}>Guardar premio</Btn>
      </div>
    </Modal>
  );
}

/* ============ CARGAR VENTAS ============ */
function VentasView() {
  const [mode, setMode] = useState('manual');
  const [rows, setRows] = useState(A.USERS.filter((u) => u.status === 'activo').map((u, i) => ({
    route: u.route, name: u.name, budget: [120000, 98000, 145000, 110000][i] || 100000,
    sold: [104400, 112700, 138000, 86000][i] || 90000,
  })));
  const [uploaded, setUploaded] = useState(false);
  function setSold(i, v) { setRows((rs) => rs.map((r, j) => j === i ? { ...r, sold: +v || 0 } : r)); }

  return (
    <div>
      <SectionHead title="CARGAR VENTAS" sub={`Período activo: ${A.PERIOD.label} · día ${A.PERIOD.daysElapsed} de ${A.PERIOD.daysTotal}`} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['manual', 'Captura manual'], ['csv', 'Importar CSV']].map(([id, lb]) => (
          <button key={id} onClick={() => setMode(id)} style={{ border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 14, padding: '9px 18px', borderRadius: 10, background: mode === id ? 'var(--navy)' : '#fff', color: mode === id ? '#fff' : 'var(--slate)', boxShadow: mode === id ? 'none' : 'inset 0 0 0 1px var(--line-d)' }}>{lb}</button>
        ))}
      </div>

      {mode === 'csv' && (
        <Card>
          {!uploaded ? (
            <div onClick={() => setUploaded(true)} style={{ border: '2px dashed var(--line-d)', borderRadius: 14, padding: '46px 20px', textAlign: 'center', cursor: 'pointer', background: '#fafbfd' }}>
              <div style={{ fontSize: 40 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>Arrastra tu archivo CSV o haz clic para seleccionar</div>
              <div style={{ color: 'var(--slate)', fontSize: 13.5, marginTop: 4 }}>Columnas: <code>ruta, presupuesto, venta_acumulada</code></div>
              <Btn kind="ghost" style={{ marginTop: 16 }}>Seleccionar archivo</Btn>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--green-soft)', padding: '12px 16px', borderRadius: 10, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ fontWeight: 700, color: 'var(--aje-green-d)' }}>ventas_jun2026.csv procesado — {rows.length} rutas reconocidas</span>
              </div>
              <VentasTable rows={rows} readOnly />
            </div>
          )}
        </Card>
      )}

      {mode === 'manual' && (
        <Card>
          <VentasTable rows={rows} onSold={setSold} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18, gap: 10 }}>
            <Btn kind="ghost">Descartar</Btn>
            <Btn kind="primary">Guardar y recalcular puntos</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}
function VentasTable({ rows, onSold, readOnly }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', color: 'var(--slate)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            <th style={th}>Ruta</th><th style={th}>Vendedor</th><th style={{ ...th, textAlign: 'right' }}>Presupuesto</th><th style={{ ...th, textAlign: 'right' }}>Venta acum.</th><th style={{ ...th, textAlign: 'right' }}>% Cumpl.</th><th style={{ ...th, textAlign: 'right' }}>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const comp = +(r.sold / r.budget * 100).toFixed(1);
            const pts = A.pointsForCompliance(comp);
            const tier = A.tierForCompliance(comp);
            return (
              <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ ...td, fontWeight: 800, color: 'var(--navy)' }}>{r.route}</td>
                <td style={td}>{r.name}</td>
                <td style={{ ...td, textAlign: 'right', color: 'var(--slate)' }}>{A.money(r.budget)}</td>
                <td style={{ ...td, textAlign: 'right' }}>
                  {readOnly ? <b>{A.money(r.sold)}</b> :
                    <input type="number" value={r.sold} onChange={(e) => onSold(i, e.target.value)} style={{ ...inputStyle, width: 130, textAlign: 'right', padding: '6px 9px', display: 'inline-block' }} />}
                </td>
                <td style={{ ...td, textAlign: 'right' }}><Pill color={comp > 100 || comp <= 80 ? '#0c1c40' : '#fff'} bg={tier.color}>{comp}%</Pill></td>
                <td style={{ ...td, textAlign: 'right', fontWeight: 800, color: 'var(--aje-green)', fontSize: 16 }} className="disp">+{pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============ USUARIOS (mapeo Chat ID ↔ Ruta) ============ */
function UsuariosView() {
  const [users, setUsers] = useState(A.USERS.map((u) => ({ ...u })));
  const [link, setLink] = useState(null);
  function doLink(id, chatId) { setUsers((us) => us.map((u) => u.id === id ? { ...u, chatId: +chatId, status: 'activo', lastSeen: 'Recién enlazado' } : u)); setLink(null); }
  return (
    <div>
      <SectionHead title="GESTIÓN DE VENDEDORES" sub="Cada vendedor se autentica por su Chat ID de Telegram — sin usuario ni contraseña"
        action={<Btn kind="primary">＋ Agregar vendedor</Btn>} />
      <Card pad={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ textAlign: 'left', color: 'var(--slate)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.05em', background: '#fafbfd' }}>
            <th style={th}>Vendedor</th><th style={th}>Ruta</th><th style={th}>Zona</th><th style={th}>Chat ID Telegram</th><th style={th}>Estado</th><th style={th}>Última actividad</th><th style={th}></th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ ...td, fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--green-soft)', color: 'var(--aje-green-d)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{u.name.split(' ').map((n) => n[0]).join('')}</span>
                    {u.name}
                  </div>
                </td>
                <td style={{ ...td, fontWeight: 800, color: 'var(--navy)' }}>{u.route}</td>
                <td style={{ ...td, color: 'var(--slate)' }}>{u.zone}</td>
                <td style={{ ...td, fontFamily: 'monospace', color: u.chatId ? 'var(--ink)' : 'var(--slate-l)' }}>{u.chatId || '— sin enlazar —'}</td>
                <td style={td}>{u.status === 'activo'
                  ? <Pill color="var(--aje-green-d)" bg="var(--green-soft)">● Activo</Pill>
                  : <Pill color="#9a6a00" bg="#fdf3d6">○ Sin enlazar</Pill>}</td>
                <td style={{ ...td, color: 'var(--slate)' }}>{u.lastSeen}</td>
                <td style={{ ...td, textAlign: 'right' }}>
                  {u.status === 'activo'
                    ? <Btn kind="ghost" size="sm">Editar</Btn>
                    : <Btn kind="yellow" size="sm" onClick={() => setLink(u)}>Enlazar Chat ID</Btn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      {link && <LinkModal user={link} onClose={() => setLink(null)} onLink={doLink} />}
    </div>
  );
}
function LinkModal({ user, onClose, onLink }) {
  const [cid, setCid] = useState('');
  return (
    <Modal onClose={onClose} w={440}>
      <h2 className="disp" style={{ fontSize: 26, margin: '0 0 6px', color: 'var(--navy)' }}>Enlazar Chat ID</h2>
      <p style={{ color: 'var(--slate)', fontSize: 14, margin: '0 0 18px' }}>Asignar la identidad de Telegram de <b style={{ color: 'var(--ink)' }}>{user.name}</b> a la ruta <b style={{ color: 'var(--navy)' }}>{user.route}</b>.</p>
      <div style={{ background: '#fafbfd', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--slate)', marginBottom: 16 }}>
        💡 El vendedor escribe <code>/start</code> al bot. El webhook captura su <b>Chat ID</b> y aparece aquí para asignarlo.
      </div>
      <Field label="Chat ID de Telegram"><input style={inputStyle} value={cid} onChange={(e) => setCid(e.target.value)} placeholder="Ej: 728401193" /></Field>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Btn kind="ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancelar</Btn>
        <Btn kind="primary" onClick={() => cid && onLink(user.id, cid)} style={{ flex: 1, justifyContent: 'center' }}>Enlazar</Btn>
      </div>
    </Modal>
  );
}

/* ============ REGLAS (multiplicadores) ============ */
function ReglasView() {
  const [rules, setRules] = useState(A.RULES.map((r) => ({ ...r, to: r.to === Infinity ? '∞' : r.to })));
  function setR(i, k, v) { setRules((rs) => rs.map((r, j) => j === i ? { ...r, [k]: v } : r)); }
  const samples = [60, 75, 90, 105, 118, 132];
  return (
    <div>
      <SectionHead title="REGLAS DE PUNTOS" sub="Define los tramos de cumplimiento y el multiplicador de puntos por cada punto porcentual" />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 20 }}>
        <Card>
          <h3 className="cond" style={{ margin: '0 0 14px', fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--slate)' }}>Tramos de cumplimiento</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rules.map((r, i) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 12, background: '#fafbfd' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: r.color, flex: '0 0 auto' }}></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input style={{ ...inputStyle, width: 64, padding: '7px 8px', textAlign: 'center' }} value={r.from} onChange={(e) => setR(i, 'from', +e.target.value)} />
                  <span style={{ color: 'var(--slate)' }}>a</span>
                  <input style={{ ...inputStyle, width: 64, padding: '7px 8px', textAlign: 'center' }} value={r.to} onChange={(e) => setR(i, 'to', e.target.value)} />
                  <span style={{ color: 'var(--slate)', fontWeight: 700 }}>%</span>
                </div>
                <div style={{ flex: 1 }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" style={{ ...inputStyle, width: 60, padding: '7px 8px', textAlign: 'center', fontWeight: 800, color: 'var(--aje-green)' }} value={r.rate} onChange={(e) => setR(i, 'rate', +e.target.value)} />
                  <span style={{ color: 'var(--slate)', fontWeight: 700, fontSize: 13.5 }}>pt / %</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}><Btn kind="primary">Guardar reglas</Btn></div>
        </Card>
        <Card style={{ background: 'var(--navy)', border: 'none' }}>
          <h3 className="cond" style={{ margin: '0 0 16px', fontSize: 15, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>Vista previa</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {samples.map((s) => {
              const pts = A.pointsForCompliance(s);
              const maxPts = A.pointsForCompliance(132);
              return (
                <div key={s}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span style={{ color: '#fff', fontWeight: 700 }}>{s}% cumplimiento</span>
                    <span style={{ color: 'var(--yellow)', fontWeight: 800 }}>{pts} pts</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 5, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(pts / maxPts) * 100}%`, borderRadius: 5, background: 'linear-gradient(90deg,var(--aje-green-l),var(--yellow))' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 16, lineHeight: 1.5 }}>Cálculo progresivo: cada punto porcentual otorga puntos según el tramo donde cae (estilo escalera). Debajo de 51% = 0 pts.</p>
        </Card>
      </div>
    </div>
  );
}

const th = { padding: '13px 16px', fontWeight: 700 };
const td = { padding: '13px 16px', verticalAlign: 'middle' };

Object.assign(window, { Card, SectionHead, Btn, Pill, Field, inputStyle, Modal, NetChart, PremiosAdmin, VentasView, UsuariosView, ReglasView, th, td });
