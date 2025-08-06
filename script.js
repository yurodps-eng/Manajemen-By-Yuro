let saldo = 0;
let dataTransaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

const form = document.getElementById("form");
const tabel = document.getElementById("tabel-transaksi");
const tanggalInput = document.getElementById("tanggal");
const deskripsiInput = document.getElementById("deskripsi");
const masukInput = document.getElementById("masuk");
const keluarInput = document.getElementById("keluar");
const exportExcelBtn = document.getElementById("exportExcel");

let chart; // global chart instance

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const tanggal = tanggalInput.value;
  const deskripsi = deskripsiInput.value;
  const masuk = parseFloat(masukInput.value) || 0;
  const keluar = parseFloat(keluarInput.value) || 0;

  dataTransaksi.push({ tanggal, deskripsi, masuk, keluar });
  localStorage.setItem("transaksi", JSON.stringify(dataTransaksi));
  render();
  form.reset();
  tanggalInput.value = tanggal;
});

function render() {
  tabel.innerHTML = "";
  saldo = 0;
  dataTransaksi.forEach((item, index) => {
    saldo += item.masuk - item.keluar;
    item.saldo = saldo;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatTanggal(item.tanggal)}</td>
      <td>${item.deskripsi}</td>
      <td>${item.masuk}</td>
      <td>${item.keluar}</td>
      <td>${item.saldo}</td>
      <td>
        <button onclick="hapus(${index})" style="background:#e17055;">Hapus</button>
      </td>
    `;
    tabel.appendChild(row);
  });

  updateChart();
}

function formatTanggal(tgl) {
  const date = new Date(tgl);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit", month: "2-digit", year: "numeric"
  });
}

function hapus(index) {
  dataTransaksi.splice(index, 1);
  localStorage.setItem("transaksi", JSON.stringify(dataTransaksi));
  render();
}

function updateChart() {
  const labels = dataTransaksi.map(item => formatTanggal(item.tanggal));
  const pemasukan = dataTransaksi.map(item => item.masuk);
  const pengeluaran = dataTransaksi.map(item => item.keluar);

  const ctx = document.getElementById("financeChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pemasukan",
          data: pemasukan,
          backgroundColor: "#4CAF50",
        },
        {
          label: "Pengeluaran",
          data: pengeluaran,
          backgroundColor: "#F44336",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Grafik Keuangan Harian" },
        legend: { position: "top" }
      },
    },
  });
}

function downloadExcel() {
  const data = dataTransaksi.map(item => ({
    Tanggal: formatTanggal(item.tanggal),
    Deskripsi: item.deskripsi,
    "Uang Masuk": item.masuk,
    "Uang Keluar": item.keluar,
    "Saldo Akhir": item.saldo
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
  XLSX.writeFile(wb, "Laporan_Keuangan.xlsx");
}

exportExcelBtn.addEventListener("click", downloadExcel);

window.addEventListener("DOMContentLoaded", () => {
  render();
});
