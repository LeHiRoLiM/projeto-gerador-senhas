let currentTicket = 1;
let selectedType = "N";
let lastTicket = "";
let lastName = "";

const normalBtn = document.getElementById("normalBtn");
const priorityBtn = document.getElementById("priorityBtn");
const printBtn = document.getElementById("printBtn");

normalBtn.addEventListener("click", () => {
    setType("N");
    generateTicket();
});

priorityBtn.addEventListener("click", () => {
    setType("P");
    generateTicket();
});

printBtn.addEventListener("click", printTicket);

function setType(type) {
    selectedType = type;
    normalBtn.classList.toggle("active", type === "N");
    priorityBtn.classList.toggle("active", type === "P");
}

function generateTicket() {
    const name = document.getElementById("nameInput").value.trim();

    if (!name) {
        alert("Por favor, digite seu nome.");
        return;
    }

    const formattedTicket =
        selectedType + String(currentTicket).padStart(3, "0");

    lastTicket = formattedTicket;
    lastName = name;

    document.getElementById("ticketNumber").innerText = formattedTicket;
    document.getElementById("ticket").style.display = "block";

    adicionarNaFila(selectedType, formattedTicket, name);

    currentTicket++;
}

// ===============================
// Adiciona no localStorage
// ===============================
function adicionarNaFila(tipo, senha, nome) {
    let filaNormal = JSON.parse(localStorage.getItem("filaNormal") || "[]");
    let filaPrioridade = JSON.parse(localStorage.getItem("filaPrioridade") || "[]");

    const novaSenha = {
        id: Date.now(),
        tipo: tipo,
        senha: senha,
        nome: nome,
        timestamp: new Date().toLocaleTimeString(),
        status: "aguardando",
        impresso: false
    };

    if (tipo === "N") {
        filaNormal.push(novaSenha);
    } else {
        filaPrioridade.push(novaSenha);
    }

    localStorage.setItem("filaNormal", JSON.stringify(filaNormal));
    localStorage.setItem("filaPrioridade", JSON.stringify(filaPrioridade));
}

function printTicket() {
    const ticketContent = `
        <html>
        <head>
            <title>Imprimir Senha</title>
            <style>
                body { text-align: center; font-family: Arial, sans-serif; }
                .ticket-print { font-size: 48px; font-weight: bold; color: #861d06; margin: 50px 0; }
                .clinic-name { font-size: 24px; color: #861d06; margin-bottom: 30px; }
            </style>
        </head>
        <body onload="window.print(); window.close();">
            <div class="clinic-name">PERBOYRE CASTELO</div>
            <div>Sua Senha:</div>
            <div class="ticket-print">${lastTicket}</div>
            <div>${lastName} - Aguarde sua senha no Painel</div>
            <div>Agradecemos sua visita, até Logo !</div>
        </body>
        </html>
    `;

    const printWindow = window.open("", "PRINT", "width=400,height=400");
    printWindow.document.write(ticketContent);
    printWindow.document.close();

    marcarComoImpresso(selectedType, lastTicket);

    document.getElementById("nameInput").value = "";
    document.getElementById("ticket").style.display = "none";
}

function marcarComoImpresso(tipo, senha) {
    let filaNormal = JSON.parse(localStorage.getItem("filaNormal") || "[]");
    let filaPrioridade = JSON.parse(localStorage.getItem("filaPrioridade") || "[]");

    if (tipo === "N") {
        filaNormal = filaNormal.map(item => {
            if (item.senha === senha) {
                item.impresso = true;
                item.status = "impresso";
            }
            return item;
        });
        localStorage.setItem("filaNormal", JSON.stringify(filaNormal));
    } else {
        filaPrioridade = filaPrioridade.map(item => {
            if (item.senha === senha) {
                item.impresso = true;
                item.status = "impresso";
            }
            return item;
        });
        localStorage.setItem("filaPrioridade", JSON.stringify(filaPrioridade));
    }
}