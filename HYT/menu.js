// ============================================================
// HYT ESSENCE — Menú compartido
// ============================================================

const _SUPABASE_URL = 'https://ufzijqylddyaswijqtkp.supabase.co';
const _SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmemlqcXlsZGR5YXN3aWpxdGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NTg0ODEsImV4cCI6MjA5NTIzNDQ4MX0.lIogAVoQ6lrV6bHTuI3qqiqBSV8khXI6PLBTIGNlfk4';

// Inyectar HTML del menú
document.getElementById('hyt-menu-root').innerHTML = `
<div class="menu-overlay" id="menu-overlay" onclick="cerrarMenu()"></div>
<div class="menu-drawer" id="menu-drawer">
  <div class="menu-top">
    <span class="menu-logo">HYT ESSENCE</span>
    <button class="menu-close" onclick="cerrarMenu()">✕</button>
  </div>
  <div class="menu-profile" id="menu-profile" style="display:none"></div>
  <div class="menu-links">
    <a href="index.html" class="menu-link">Inicio</a>
    <a href="coleccion.html" class="menu-link">Colección</a>
    <a href="index.html#nosotros" class="menu-link">Nosotros</a>
    <a href="index.html#contacto" class="menu-link">Contacto</a>
    <a href="historial.html" class="menu-link menu-link-auth" style="display:none">Mis pedidos</a>
    <a href="admin.html" class="menu-link menu-link-admin" style="display:none">Panel admin</a>
    <div class="menu-link menu-carrito-btn" id="menu-carrito-btn" onclick="abrirMenuCarrito()" style="display:none;cursor:pointer;">
      <span>Mi carrito</span>
      <span class="menu-carrito-badge" id="menu-carrito-badge" style="display:none"></span>
    </div>
  </div>
  <div class="menu-footer" id="menu-footer"></div>
</div>

<!-- PANEL CARRITO (desde menú) -->
<div class="menu-carrito-overlay" id="menu-carrito-overlay" onclick="cerrarMenuCarrito()"></div>
<div class="menu-carrito-panel" id="menu-carrito-panel">
  <div class="menu-carrito-header">
    <button class="menu-carrito-back" onclick="cerrarMenuCarrito()">← Volver</button>
    <span class="menu-carrito-titulo">Mi carrito</span>
    <button class="menu-carrito-cerrar" onclick="cerrarMenuCarrito()">✕</button>
  </div>
  <div class="menu-carrito-items" id="menu-carrito-items"></div>
  <div class="menu-carrito-footer" id="menu-carrito-footer" style="display:none">
    <div class="menu-carrito-total-row">
      <span class="menu-carrito-total-label">Total</span>
      <span class="menu-carrito-total-num" id="menu-carrito-total">$0 MXN</span>
    </div>
    <button class="menu-btn-whatsapp" id="menu-btn-whatsapp">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Pedir por WhatsApp
    </button>
    <button class="menu-btn-vaciar" onclick="menuVaciarCarrito()">Vaciar carrito</button>
  </div>
</div>`;

// ── Control del drawer principal ──────────────────────────
function abrirMenu() {
  document.getElementById('menu-overlay').classList.add('open');
  document.getElementById('menu-drawer').classList.add('open');
}
function cerrarMenu() {
  document.getElementById('menu-overlay').classList.remove('open');
  document.getElementById('menu-drawer').classList.remove('open');
}

// ── Carrito desde menú ────────────────────────────────────
function abrirMenuCarrito() {
  cerrarMenu();
  menuRenderCarrito();
  document.getElementById('menu-carrito-overlay').classList.add('open');
  document.getElementById('menu-carrito-panel').classList.add('open');
}
function cerrarMenuCarrito() {
  document.getElementById('menu-carrito-overlay').classList.remove('open');
  document.getElementById('menu-carrito-panel').classList.remove('open');
}

function menuRenderCarrito() {
  const carrito = JSON.parse(localStorage.getItem('hyt_carrito') || '[]');
  const container = document.getElementById('menu-carrito-items');
  const footer = document.getElementById('menu-carrito-footer');

  if (carrito.length === 0) {
    container.innerHTML = `
      <div class="menu-carrito-vacio">
        <p>Tu carrito está vacío</p>
        <span>Agrega productos desde la colección</span>
        <a href="coleccion.html" class="menu-carrito-ir" onclick="cerrarMenuCarrito()">Ver colección</a>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  container.innerHTML = carrito.map(item => `
    <div class="menu-carrito-item">
      ${item.imagen ? `<img src="${item.imagen}" alt="${item.nombre}" onclick="window.location.href='detalle.html?id=${item.id}'" style="cursor:pointer">` : '<div class="menu-carrito-img-ph"></div>'}
      <div class="menu-carrito-item-info">
        <div class="menu-carrito-item-nombre" onclick="window.location.href='detalle.html?id=${item.id}'" style="cursor:pointer">${item.nombre}</div>
        <div class="menu-carrito-item-talla">Talla: ${item.talla}</div>
        <div class="menu-carrito-item-precio">$${(item.precio * item.cantidad).toFixed(0)} MXN</div>
        <div class="menu-carrito-item-actions">
          <button class="menu-qty-btn" onclick="menuCambiarCantidad('${item.key}', -1)">−</button>
          <span class="menu-qty-num">${item.cantidad}</span>
          <button class="menu-qty-btn" onclick="menuCambiarCantidad('${item.key}', 1)">+</button>
          <button class="menu-btn-eliminar" onclick="menuEliminarItem('${item.key}')">Quitar</button>
        </div>
      </div>
    </div>`).join('');

  document.getElementById('menu-carrito-total').textContent = `$${total.toFixed(0)} MXN`;
  footer.style.display = 'block';
}

function menuCambiarCantidad(key, delta) {
  let carrito = JSON.parse(localStorage.getItem('hyt_carrito') || '[]');
  const item = carrito.find(i => i.key === key);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(i => i.key !== key);
  localStorage.setItem('hyt_carrito', JSON.stringify(carrito));
  menuActualizarBadge();
  menuRenderCarrito();
}

function menuEliminarItem(key) {
  let carrito = JSON.parse(localStorage.getItem('hyt_carrito') || '[]');
  carrito = carrito.filter(i => i.key !== key);
  localStorage.setItem('hyt_carrito', JSON.stringify(carrito));
  menuActualizarBadge();
  menuRenderCarrito();
}

function menuVaciarCarrito() {
  localStorage.setItem('hyt_carrito', '[]');
  menuActualizarBadge();
  menuRenderCarrito();
}

function menuActualizarBadge() {
  const carrito = JSON.parse(localStorage.getItem('hyt_carrito') || '[]');
  const total = carrito.reduce((s, i) => s + i.cantidad, 0);
  const badge = document.getElementById('menu-carrito-badge');
  if (badge) {
    badge.textContent = total > 0 ? total : '';
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
  }
}

// ── WhatsApp desde menú ───────────────────────────────────
async function menuPedirWhatsApp() {
  const carrito = JSON.parse(localStorage.getItem('hyt_carrito') || '[]');
  if (carrito.length === 0) return;

  const { createClient } = supabase;
  const db = createClient(_SUPABASE_URL, _SUPABASE_KEY);
  const { data: { session } } = await db.auth.getSession();

  if (!session) {
    cerrarMenuCarrito();
    window.location.href = 'login.html?redirect=coleccion.html';
    return;
  }

  const nombre = session.user.user_metadata?.nombre || session.user.email.split('@')[0];
  const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const lineas = carrito.map(i =>
    `• ${i.nombre} (Talla ${i.talla}) x${i.cantidad} — $${(i.precio * i.cantidad).toFixed(0)} MXN`
  ).join('\n');
  const mensaje = `Hola, soy *${nombre}* y me interesan los siguientes productos de HYT ESSENCE:\n\n${lineas}\n\n*Total: $${total.toFixed(0)} MXN*\n\n¿Me pueden ayudar con el pedido?`;
  window.open(`https://wa.me/5217821317909?text=${encodeURIComponent(mensaje)}`, '_blank');

  await db.from('pedidos').insert({
    usuario_id: session.user.id,
    items: carrito.map(i => ({ id: i.id, nombre: i.nombre, talla: i.talla, cantidad: i.cantidad, precio: i.precio, imagen: i.imagen })),
    total
  });

  localStorage.setItem('hyt_carrito', '[]');
  menuActualizarBadge();
  menuRenderCarrito();
}

// ── Cerrar sesión ─────────────────────────────────────────
async function cerrarSesionMenu() {
  const { createClient } = supabase;
  const db = createClient(_SUPABASE_URL, _SUPABASE_KEY);
  await db.auth.signOut();
  window.location.href = 'index.html';
}

// ── Init menú ─────────────────────────────────────────────
async function initMenu() {
  const { createClient } = supabase;
  const db = createClient(_SUPABASE_URL, _SUPABASE_KEY);
  const { data: { session } } = await db.auth.getSession();

  const profile = document.getElementById('menu-profile');
  const footer = document.getElementById('menu-footer');
  const authLinks = document.querySelectorAll('.menu-link-auth');
  const adminLinks = document.querySelectorAll('.menu-link-admin');
  const carritoBtn = document.getElementById('menu-carrito-btn');

  // Mostrar siempre el carrito en el menú
  if (carritoBtn) carritoBtn.style.display = 'flex';
  menuActualizarBadge();

  // Asignar evento WhatsApp
  const waBtn = document.getElementById('menu-btn-whatsapp');
  if (waBtn) waBtn.onclick = menuPedirWhatsApp;

  if (session) {
    const nombre = session.user.user_metadata?.nombre || session.user.email.split('@')[0];
    profile.style.display = 'block';
    profile.innerHTML = `
      <div class="menu-profile-name">${nombre}</div>
      <div class="menu-profile-email">${session.user.email}</div>`;
    authLinks.forEach(l => l.style.display = 'block');

    const { data: perfil } = await db
      .from('perfiles').select('rol').eq('id', session.user.id).single();
    if (perfil?.rol === 'admin') {
      adminLinks.forEach(l => l.style.display = 'block');
    }
    footer.innerHTML = `<button class="menu-auth-btn logout" onclick="cerrarSesionMenu()">Cerrar sesión</button>`;
  } else {
    profile.style.display = 'none';
    authLinks.forEach(l => l.style.display = 'none');
    adminLinks.forEach(l => l.style.display = 'none');
    footer.innerHTML = `<a href="login.html" class="menu-auth-btn login" style="display:block;text-align:center;text-decoration:none;">Iniciar sesión</a>`;
  }
}

initMenu();
