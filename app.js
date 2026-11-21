/* =========================================================
   Gestor de Colección de Videojuegos — Lógica (Vanilla JS)
   Persistencia: localStorage
   ========================================================= */

// ---------------------------------------------------------
// 1. CONFIGURACIÓN Y REFERENCIAS AL DOM
// ---------------------------------------------------------
const STORAGE_KEY = 'gameCollection';

const form = document.getElementById('game-form');
const idInput = document.getElementById('game-id');
const titleInput = document.getElementById('title');
const platformInput = document.getElementById('platform');
const genreInput = document.getElementById('genre');
const statusInput = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formPanel = document.querySelector('.panel--form');
const formTitle = document.getElementById('form-title');

const gameList = document.getElementById('game-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyText = document.getElementById('empty-text');
const statsBox = document.getElementById('stats');
const searchInput = document.getElementById('search');
const filterStatus = document.getElementById('filter-status');
const sortBy = document.getElementById('sort-by');
const themeToggle = document.getElementById('theme-toggle');

const SORT_KEY = 'gameCollectionSort';
const THEME_KEY = 'gameCollectionTheme';

const modal = document.getElementById('confirm-modal');
const modalGameName = document.getElementById('modal-game-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const toast = document.getElementById('toast');

// Id del juego que está pendiente de eliminar (mientras el modal está abierto)
let pendingDeleteId = null;

// ---------------------------------------------------------
// 2. FUNCIONES DE ACCESO A localStorage
// ---------------------------------------------------------

/** Lee todos los juegos guardados. Devuelve un arreglo (vacío si no hay nada). */
function getGames() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('No se pudieron leer los datos de localStorage:', error);
    return [];
  }
}

/** Guarda el arreglo completo de juegos en localStorage. */
function saveGames(games) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (error) {
    console.error('No se pudieron guardar los datos en localStorage:', error);
    showToast('⚠️ No se pudo guardar. Revisa el almacenamiento del navegador.');
  }
}

/** Genera un id único para cada juego. */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// =========================================================
// 3. CREATE (CREAR) — Agregar un juego nuevo
// =========================================================
function createGame(gameData) {
  const games = getGames();

  const newGame = {
    id: generateId(),
    ...gameData,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  games.push(newGame);   // Se agrega al arreglo
  saveGames(games);      // Se persiste en localStorage
  showToast(`✅ "${newGame.title}" se agregó a tu colección`);
}

// =========================================================
// 4. READ (LEER) — Mostrar los juegos en pantalla
// =========================================================
function renderGames() {
  const games = getGames(); // Se leen los datos directamente de localStorage
  const query = searchInput.value.trim().toLowerCase();
  const status = filterStatus.value;

  // Aplicar búsqueda y filtro
  const filtered = games.filter((game) => {
    const matchesText =
      game.title.toLowerCase().includes(query) ||
      game.genre.toLowerCase().includes(query);
    const matchesStatus = status === 'Todos' || game.status === status;
    return matchesText && matchesStatus;
  });

  // Ordenar según el selector "Ordenar por"
  const sorted = sortGames(filtered, sortBy.value);

  renderStats(games);
  gameList.innerHTML = '';

  // Mensaje amigable si no hay registros
  if (filtered.length === 0) {
    emptyState.hidden = false;
    if (games.length === 0) {
      emptyTitle.textContent = 'Tu colección está vacía';
      emptyText.textContent = 'Agrega tu primer juego con el formulario y aparecerá aquí.';
    } else {
      emptyTitle.textContent = 'Sin resultados';
      emptyText.textContent = 'Ningún juego coincide con la búsqueda o el filtro actual.';
    }
    return;
  }

  emptyState.hidden = true;

  // Crear una tarjeta por cada juego
  const fragment = document.createDocumentFragment();
  sorted.forEach((game) => fragment.appendChild(createCard(game)));
  gameList.appendChild(fragment);
}

/**
 * ORDENAMIENTO: devuelve una copia ordenada de la lista.
 * - 'recientes'  → fecha de creación, el más nuevo primero
 * - 'alfabetico' → título de la A a la Z (ignora mayúsculas y tildes)
 * - 'estado'     → Jugando, Pendiente, Completado (empates por título)
 */
function sortGames(games, criterion) {
  const statusOrder = { Jugando: 0, Pendiente: 1, Completado: 2 };
  const byTitle = (a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' });

  return [...games].sort((a, b) => {
    if (criterion === 'alfabetico') return byTitle(a, b);
    if (criterion === 'estado') {
      return (statusOrder[a.status] - statusOrder[b.status]) || byTitle(a, b);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

/** Construye el elemento HTML (tarjeta) de un juego. */
function createCard(game) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.id = game.id;
  if (idInput.value === game.id) card.classList.add('is-being-edited');

  const statusClass = 'badge--' + game.status.toLowerCase();
  const date = new Date(game.updatedAt || game.createdAt).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // escapeHTML evita que un título con etiquetas HTML rompa la página
  card.innerHTML = `
    <div class="card__top">
      <h3 class="card__title">${escapeHTML(game.title)}</h3>
      <span class="badge ${statusClass}">${escapeHTML(game.status)}</span>
    </div>
    <div class="card__meta">
      <span class="tag">🖥️ ${escapeHTML(game.platform)}</span>
      <span class="tag">🏷️ ${escapeHTML(game.genre)}</span>
    </div>
    <span class="card__date">${game.updatedAt ? 'Editado' : 'Agregado'} el ${date}</span>
    <div class="card__actions">
      <button type="button" class="btn btn--ghost btn--sm" data-action="edit">✏️ Editar</button>
      <button type="button" class="btn btn--outline-danger btn--sm" data-action="delete">🗑️ Eliminar</button>
    </div>
  `;
  return card;
}

/** Muestra contadores de la colección (total y por estado). */
function renderStats(games) {
  const count = (s) => games.filter((g) => g.status === s).length;
  const items = [
    ['Total', games.length],
    ['Pendiente', count('Pendiente')],
    ['Jugando', count('Jugando')],
    ['Completado', count('Completado')],
  ];
  statsBox.innerHTML = items
    .map(([label, value]) => `
      <div class="stat">
        <span class="stat__value">${value}</span>
        <span class="stat__label">${label}</span>
      </div>`)
    .join('');
}

// =========================================================
// 5. UPDATE (ACTUALIZAR) — Editar un juego existente
// =========================================================

/** Paso 1: carga los datos del juego en el formulario y activa el modo edición. */
function startEdit(id) {
  const game = getGames().find((g) => g.id === id);
  if (!game) return;

  idInput.value = game.id;
  titleInput.value = game.title;
  platformInput.value = game.platform;
  genreInput.value = game.genre;
  statusInput.value = game.status;

  clearErrors();
  submitBtn.textContent = 'Guardar Cambios'; // El botón principal cambia de texto
  formTitle.textContent = 'Editar juego';
  cancelBtn.hidden = false;
  formPanel.classList.add('is-editing');

  renderGames(); // Resalta la tarjeta que se está editando
  formPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  titleInput.focus({ preventScroll: true });
}

/** Paso 2: guarda los cambios del juego en localStorage. */
function updateGame(id, gameData) {
  const games = getGames();
  const index = games.findIndex((g) => g.id === id);
  if (index === -1) {
    showToast('⚠️ Ese juego ya no existe');
    return;
  }

  games[index] = {
    ...games[index],          // Conserva id y fecha de creación
    ...gameData,              // Sobrescribe los campos editados
    updatedAt: new Date().toISOString(),
  };

  saveGames(games);           // Se persiste el cambio en localStorage
  showToast(`💾 "${gameData.title}" se actualizó`);
}

/** Sale del modo edición y deja el formulario listo para crear. */
function resetForm() {
  form.reset();
  idInput.value = '';
  statusInput.value = 'Pendiente';
  submitBtn.textContent = 'Agregar Juego';
  formTitle.textContent = 'Agregar juego';
  cancelBtn.hidden = true;
  formPanel.classList.remove('is-editing');
  clearErrors();
}

// =========================================================
// 6. DELETE (ELIMINAR) — Borrar un juego con confirmación
// =========================================================

/** Paso 1: abre el modal para pedir confirmación. */
function askDelete(id) {
  const game = getGames().find((g) => g.id === id);
  if (!game) return;

  pendingDeleteId = id;
  modalGameName.textContent = `"${game.title}"`;
  modal.hidden = false;
  confirmDeleteBtn.focus();
}

/** Paso 2: si el usuario confirma, se elimina de localStorage. */
function deleteGame(id) {
  const games = getGames();
  const game = games.find((g) => g.id === id);
  const remaining = games.filter((g) => g.id !== id); // Se quita del arreglo

  saveGames(remaining);                               // Se persiste en localStorage

  // Si justo se estaba editando ese juego, se limpia el formulario
  if (idInput.value === id) resetForm();

  if (game) showToast(`🗑️ "${game.title}" se eliminó`);
}

function closeModal() {
  modal.hidden = true;
  pendingDeleteId = null;
}

// ---------------------------------------------------------
// 7. VALIDACIÓN DEL FORMULARIO
// ---------------------------------------------------------
function validateForm() {
  clearErrors();
  let valid = true;

  const rules = [
    [titleInput, 'title-error', 'Escribe el título del juego'],
    [platformInput, 'platform-error', 'Selecciona una plataforma'],
    [genreInput, 'genre-error', 'Escribe el género'],
  ];

  rules.forEach(([input, errorId, message]) => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      document.getElementById(errorId).textContent = message;
      valid = false;
    }
  });

  // Evitar duplicados (mismo título en la misma plataforma)
  if (valid) {
    const title = titleInput.value.trim().toLowerCase();
    const duplicate = getGames().some(
      (g) =>
        g.id !== idInput.value &&
        g.title.toLowerCase() === title &&
        g.platform === platformInput.value
    );
    if (duplicate) {
      titleInput.classList.add('is-invalid');
      document.getElementById('title-error').textContent =
        'Ese juego ya está registrado en esa plataforma';
      valid = false;
    }
  }

  if (!valid) form.querySelector('.is-invalid')?.focus();
  return valid;
}

function clearErrors() {
  form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  form.querySelectorAll('.form__error').forEach((el) => (el.textContent = ''));
}

// ---------------------------------------------------------
// 8. UTILIDADES
// ---------------------------------------------------------
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- MODO CLARO / OSCURO ----------
/** Aplica el tema, actualiza el botón y guarda la preferencia. */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle.querySelector('.theme-toggle__icon').textContent = isDark ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    /* Si localStorage no está disponible, el tema solo dura esta visita */
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

// ---------------------------------------------------------
// 9. EVENTOS
// ---------------------------------------------------------

// Envío del formulario: decide si es CREATE o UPDATE
form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateForm()) return;

  const gameData = {
    title: titleInput.value.trim(),
    platform: platformInput.value,
    genre: genreInput.value.trim(),
    status: statusInput.value,
  };

  if (idInput.value) {
    updateGame(idInput.value, gameData); // → UPDATE
  } else {
    createGame(gameData);                // → CREATE
  }

  resetForm();
  renderGames();                         // → READ (refresca la vista)
});

cancelBtn.addEventListener('click', () => {
  resetForm();
  renderGames();
});

// Delegación de eventos: un solo listener para los botones de todas las tarjetas
gameList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = button.closest('.card').dataset.id;
  if (button.dataset.action === 'edit') startEdit(id);   // → UPDATE
  if (button.dataset.action === 'delete') askDelete(id); // → DELETE
});

// Confirmación del modal
confirmDeleteBtn.addEventListener('click', () => {
  if (pendingDeleteId) {
    deleteGame(pendingDeleteId); // → DELETE confirmado
    renderGames();
  }
  closeModal();
});

modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
// Tecla Esc: cierra el modal o, si no está abierto, cancela la edición
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!modal.hidden) {
    closeModal();
  } else if (idInput.value) {
    resetForm();
    renderGames();
  }
});

// Búsqueda, filtro y ordenamiento en tiempo real
searchInput.addEventListener('input', renderGames);
filterStatus.addEventListener('change', renderGames);
sortBy.addEventListener('change', () => {
  try { localStorage.setItem(SORT_KEY, sortBy.value); } catch (error) { /* sin persistencia */ }
  renderGames();
});

// Botón de tema
themeToggle.addEventListener('click', toggleTheme);

// Si los datos cambian en otra pestaña, se sincroniza la vista
window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) renderGames();
});

// Quitar el error de un campo apenas el usuario lo corrige
[titleInput, platformInput, genreInput].forEach((input) => {
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    const error = document.getElementById(`${input.id}-error`);
    if (error) error.textContent = '';
  });
});

// ---------------------------------------------------------
// 10. INICIO — restaurar preferencias y READ inicial
// ---------------------------------------------------------
setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

try {
  const savedSort = localStorage.getItem(SORT_KEY);
  if (savedSort) sortBy.value = savedSort;
} catch (error) { /* sin persistencia */ }

renderGames();
