let saldo = 0;
let dataTransaksi = [];

const form = document.getElementById("form");
const tbody = document.querySelector("#tabel tbody");
const downloadBtn = document.getElementById("download");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const tanggal = document.getElementById("tanggal").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const uangMasuk = parseFloat(document.getElementById("uangMasuk").value) || 0;
  const uangKeluar = parseFloat(document.getElementById("uangKeluar").value) || 0;

  saldo += uangMasuk - uangKeluar;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${tanggal}</td>
    <td>${deskripsi}</td>
    <td>${uangMasuk.toLocaleString()}</td>
    <td>${uangKeluar.toLocaleString()}</td>
    <td>${saldo.toLocaleString()}</td>
  `;

  tbody.appendChild(row);

  dataTransaksi.push({
    tanggal,
    deskripsi,
    uangMasuk,
    uangKeluar,
    saldo,
  });

  // Simpan ke localStorage
  localStorage.setItem("transaksi", JSON.stringify(dataTransaksi));

  form.reset();
});

downloadBtn.addEventListener("click", function () {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Tanggal,Deskripsi,Uang Masuk,Uang Keluar,Saldo Akhir\n";
  dataTransaksi.forEach(item => {
    csvContent += `${item.tanggal},${item.deskripsi},${item.uangMasuk},${item.uangKeluar},${item.saldo}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "manajemen_uang.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Ambil data dari localStorage saat halaman dibuka
window.addEventListener("DOMContentLoaded", () => {
  const dataSimpan = JSON.parse(localStorage.getItem("transaksi")) || [];
  dataTransaksi = dataSimpan;
  saldo = 0;

  dataTransaksi.forEach(item => {
    saldo = item.saldo;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.deskripsi}</td>
      <td>${item.uangMasuk.toLocaleString()}</td>
      <td>${item.uangKeluar.toLocaleString()}</td>
      <td>${item.saldo.toLocaleString()}</td>
    `;
    tbody.appendChild(row);
  });
});
