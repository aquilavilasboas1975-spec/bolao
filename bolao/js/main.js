let dadosAcertos = null;
let dadosAlfab = null;
let modo = "acertos"; // "acertos" ou "alfabetica"

async function carregarJSONs() {
    // Carrega os dois arquivos JSON
    dadosAcertos = await fetch('./resultados/data/acertos.json').then(r => r.json()).catch(() => null);
    dadosAlfab = await fetch('./resultados/data/alfabetica.json').then(r => r.json()).catch(() => null);
    exibirResultados();
}

function exibirResultados() {
    const dados = modo === "acertos" ? dadosAcertos : dadosAlfab;
    if (!dados) {
        document.querySelector("#tabelaResultados tbody").innerHTML = "<tr><td colspan='6'>Nenhum resultado disponível.</td></tr>";
        document.getElementById("info-geral").innerText = "";
        return;
    }
    // Info geral
    document.getElementById("info-geral").innerHTML =
        `Período: <b>${formataData(dados.dataInicial)} a ${formataData(dados.dataFinal)}</b> &nbsp;|&nbsp; 
        Valor do Prêmio: <b>R$ ${Number(dados.valorPremio).toFixed(2).replace('.', ',')}</b>`;

    // Monta linhas
    let html = "";
    dados.resultados.forEach((item, idx) => {
        // Cria uma cópia da lista de acertos (para "consumir" igual PDF)
        let acertadosRestantes = [...item.acertados];
        let apostaHTML = "";
        item.aposta.forEach(num => {
            // Verifica se esse número está disponível na lista de acertos
            let idxAcerto = acertadosRestantes.indexOf(num);
            if (idxAcerto !== -1) {
                apostaHTML += `<span class="circulo-verde">${num.toString().padStart(2, '0')}</span> `;
                acertadosRestantes.splice(idxAcerto, 1); // Remove para não marcar de novo
            } else {
                apostaHTML += `<span>${num.toString().padStart(2, '0')}</span> `;
            }
        });
        html += `<tr>
            <td>${(idx+1).toString().padStart(2,'0')}</td>
            <td style="color:#fff">${item.nome}</td>
            <td>${item.vendedor}</td>
            <td>${item.apostaNumero}</td>
            <td style="text-align:center">${apostaHTML}</td>
            <td>${item.acertados.length}</td>
        </tr>`;
    });
    document.querySelector("#tabelaResultados tbody").innerHTML = html;
}

// Formata data de 2025-09-15 para 15/09/2025
function formataData(dataIso) {
    let [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Botões de alternância
document.getElementById("btnAcertos").onclick = function() {
    modo = "acertos";
    this.classList.add("ativo");
    document.getElementById("btnAlfab").classList.remove("ativo");
    exibirResultados();
};
document.getElementById("btnAlfab").onclick = function() {
    modo = "alfabetica";
    this.classList.add("ativo");
    document.getElementById("btnAcertos").classList.remove("ativo");
    exibirResultados();
};

carregarJSONs();