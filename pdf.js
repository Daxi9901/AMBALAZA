document.getElementById("pdf-btn").addEventListener("click", () => {
  if (!confirm("Želiš li da eksportuješ podatke u PDF?")) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Evidencija ambalaže", 14, 20);

  const rows = [];
  document.querySelectorAll("#ambalaza-table tbody tr").forEach(tr => {
    const sifra = tr.cells[0].innerText;
    const naziv = tr.cells[1].innerText;
    const zbir = tr.cells[3].innerText;
    rows.push([sifra, naziv, zbir]);
  });

  doc.autoTable({
    startY: 30,
    head: [["Šifra", "Naziv", "Zbir"]],
    body: rows,
    styles: { fontSize: 11, halign: "center" },
    headStyles: { fillColor: [0, 120, 215], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  const now = new Date();
  doc.setFontSize(10);
  doc.text(`Datum: ${now.toLocaleDateString("sr-RS")} ${now.toLocaleTimeString("sr-RS")}`, 14, doc.lastAutoTable.finalY + 15);

  // pitaj korisnika za ime fajla
  let fileName = prompt("Unesi ime PDF fajla (bez ekstenzije):", "EvidencijaAmbalaze");
  if (!fileName) fileName = "EvidencijaAmbalaze";

  doc.save(fileName + ".pdf");
});
