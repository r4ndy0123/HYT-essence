// ============================================================
// HYT ESSENCE — Menú compartido
// Incluir en todas las páginas:
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <link rel="stylesheet" href="menu.css">
//   <script src="menu.js" defer></script>
// Y agregar en el <body>:
//   <div id="hyt-menu-root"></div>
//   <div class="hamburger" onclick="abrirMenu()">...</div>
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
  </div>
  <div class="menu-footer" id="menu-footer"></div>
</div>`;

function abrirMenu() {
  document.getElementById('menu-overlay').classList.add('open');
  document.getElementById('menu-drawer').classList.add('open');
}

function cerrarMenu() {
  document.getElementById('menu-overlay').classList.remove('open');
  document.getElementById('menu-drawer').classList.remove('open');
}

async function cerrarSesionMenu() {
  const { createClient } = supabase;
  const db = createClient(_SUPABASE_URL, _SUPABASE_KEY);
  await db.auth.signOut();
  window.location.href = 'index.html';
}

async function initMenu() {
  const { createClient } = supabase;
  const db = createClient(_SUPABASE_URL, _SUPABASE_KEY);
  const { data: { session } } = await db.auth.getSession();

  const profile = document.getElementById('menu-profile');
  const footer = document.getElementById('menu-footer');
  const authLinks = document.querySelectorAll('.menu-link-auth');
  const adminLinks = document.querySelectorAll('.menu-link-admin');

  if (session) {
    const nombre = session.user.user_metadata?.nombre || session.user.email.split('@')[0];

    // Show profile
    profile.style.display = 'block';
    profile.innerHTML = `
      <div class="menu-profile-name">${nombre}</div>
      <div class="menu-profile-email">${session.user.email}</div>`;

    // Show auth links
    authLinks.forEach(l => l.style.display = 'block');

    // Check admin role
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
