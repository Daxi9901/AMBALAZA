const tableBody = document.querySelector("#ambalaza-table tbody");
const ambalazaInput = document.getElementById("ambalaza-input");

const map = {
  "Rolocompact": "0005875",
  "VIP 4311": "0011963",
  "VIP 4317": "0011554",
  "VIP 6411": "0011623",
  "VIP 6416": "0011682",
  "VIP 6419": "0011566",
  "VIP 6423": "0011683",
  "VIP 6425": "0011904",
  "VIP 6428": "0011901",
  "RPC 4317": "0006689",
  "RPC 6411": "0006652",
  "RPC 6419": "0006732",
  "RPC 6423": "0012763",
  "Bito Kutija": "0004411",
  "Smaart Box": "0004869",
  "Cep Paleta": "0004842",
  "Euro Paleta": "0004424",
  "Obična Paleta": "0004841",
  "Termo Rol Kontejner": "0004875"
};

ambalazaInput.addEventListener("change", () => {
  const naziv = ambalazaInput.value.trim();
  if (!naziv) return;

  const sifra = map[naziv] || "";

  let existingRow = Array.from(tableBody.querySelectorAll("tr"))
    .find(tr => tr.cells[1].innerText === naziv);

  if (!existingRow) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sifra}</td>
      <td>${naziv}</td>
      <td contenteditable="true"></td>
      <td>0</td>
      <td><button class="remove-btn">X</button></td>
    `;
    tableBody.appendChild(row);

    row.querySelector(".remove-btn").addEventListener("click", () => {
      if (confirm("Da li sigurno želiš da ukloniš ovaj red?")) {
        row.remove();
      }
    });

    row.cells[2].addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const unos = parseInt(row.cells[2].innerText) || 0;
        const zbir = parseInt(row.cells[3].innerText) || 0;
        row.cells[3].innerText = zbir + unos;
        row.cells[2].innerText = "";
      }
    });
  }

  ambalazaInput.value = "";
});



// Reset
document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Da li sigurno želiš da obrišeš celu tabelu?")) {
    tableBody.innerHTML = "";
  }
});

// Tema
document.getElementById("theme-btn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Save u JSON fajl sa imenom
document.getElementById("save-btn").addEventListener("click", () => {
  if (!confirm("Želiš li da sačuvaš podatke u JSON fajl?")) return;

  const data = [];
  document.querySelectorAll("#ambalaza-table tbody tr").forEach(tr => {
    data.push({
      sifra: tr.cells[0].innerText,
      naziv: tr.cells[1].innerText,
      zbir: tr.cells[3].innerText
    });
  });

  // pitaj korisnika za ime fajla
  let fileName = prompt("Unesi ime fajla (bez ekstenzije):", "EvidencijaAmbalaze");
  if (!fileName) fileName = "EvidencijaAmbalaze";

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = fileName + ".json";  // koristi ime koje je korisnik uneo
  a.click();

  URL.revokeObjectURL(url);
});


// Load iz JSON fajla
document.getElementById("load-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      tableBody.innerHTML = "";

      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.sifra}</td>
          <td>${item.naziv}</td>
          <td contenteditable="true"></td>
          <td>${item.zbir}</td>
          <td><button class="remove-btn">X</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelector(".remove-btn").addEventListener("click", () => {
          if (confirm("Da li sigurno želiš da ukloniš ovaj red?")) {
            row.remove();
          }
        });

        row.cells[2].addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const unos = parseInt(row.cells[2].innerText) || 0;
            const zbir = parseInt(row.cells[3].innerText) || 0;
            row.cells[3].innerText = zbir + unos;
            row.cells[2].innerText = "";
          }
        });
      });

      alert("Podaci uspešno učitani iz fajla.");
    } catch (err) {
      alert("Greška pri učitavanju fajla.");
    }
  };
  reader.readAsText(file);
});
