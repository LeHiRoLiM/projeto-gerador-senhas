const queueCountEl = document.getElementById('queueCount');
const queueListEl = document.getElementById('queueList');
const nextBtn = document.getElementById('nextBtn');
const currentCalledEl = document.getElementById('currentCalled');

let filaNormal = [];
let filaPrioridade = [];
let ultimoTipoChamado = null;

// ===============================
function atualizarFila() {
  const total = filaNormal.length + filaPrioridade.length;
  queueCountEl.innerText = total;

  let html = '';

  // Mostrar primeiro prioridades, depois normais (organizado)
  filaPrioridade.forEach(item => {
    html += `
      <li class="queue-card priority">
        <div class="card-type">P</div>
        <div class="card-body">
          <div class="card-number">${item.senha}</div>
          <div class="card-name">${item.nome}</div>
          <div class="card-time">${item.timestamp || ''}</div>
        </div>
      </li>`;
  });

  filaNormal.forEach(item => {
    html += `
      <li class="queue-card normal">
        <div class="card-type">N</div>
        <div class="card-body">
          <div class="card-number">${item.senha}</div>
          <div class="card-name">${item.nome}</div>
          <div class="card-time">${item.timestamp || ''}</div>
        </div>
      </li>`;
  });

  queueListEl.innerHTML = html;

  localStorage.setItem('filaNormal', JSON.stringify(filaNormal));
  localStorage.setItem('filaPrioridade', JSON.stringify(filaPrioridade));
  localStorage.setItem('ultimoTipoChamado', ultimoTipoChamado);
}

// ===============================
function carregarFilas() {
  try {
    filaNormal = JSON.parse(localStorage.getItem('filaNormal') || '[]');
    filaPrioridade = JSON.parse(localStorage.getItem('filaPrioridade') || '[]');
    ultimoTipoChamado = localStorage.getItem('ultimoTipoChamado');
  } catch {
    filaNormal = [];
    filaPrioridade = [];
    ultimoTipoChamado = null;
  }
}

// ===============================
nextBtn.addEventListener('click', () => {
  let senhaParaChamar = null;

  if (!filaNormal.length && !filaPrioridade.length) {
    alert('Nenhuma senha na fila.');
    return;
  }

  if (ultimoTipoChamado === 'N' || ultimoTipoChamado === null) {
    if (filaPrioridade.length) {
      senhaParaChamar = filaPrioridade.shift();
      ultimoTipoChamado = 'P';
    } else {
      senhaParaChamar = filaNormal.shift();
      ultimoTipoChamado = 'N';
    }
  } else {
    if (filaNormal.length) {
      senhaParaChamar = filaNormal.shift();
      ultimoTipoChamado = 'N';
    } else {
      senhaParaChamar = filaPrioridade.shift();
      ultimoTipoChamado = 'P';
    }
  }

  if (senhaParaChamar) {
    currentCalledEl.innerText =
      `${senhaParaChamar.senha} — ${senhaParaChamar.nome}`;
    atualizarFila();
  }
});

// ===============================
carregarFilas();
atualizarFila();

window.addEventListener('storage', (e) => {
  if (
    e.key === 'filaNormal' ||
    e.key === 'filaPrioridade' ||
    e.key === 'ultimoTipoChamado'
  ) {
    carregarFilas();
    atualizarFila();
  }
});

// polling leve
setInterval(() => {
  carregarFilas();
  atualizarFila();
}, 500);