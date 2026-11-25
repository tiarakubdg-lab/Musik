
const ADMIN_WA = "6283182386351";

let antrian = JSON.parse(
  localStorage.getItem("jaspost_antrian") || "[]"
);

// Loading petir
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hide");
  }, 2200);

  renderQueue();
});

// Pindah formulir
function showForm(type) {
  document.getElementById("formCari").hidden = type !== "cari";
  document.getElementById("formJual").hidden = type !== "jual";

  const target = type === "cari" ? "formCari" : "formJual";

  document.getElementById(target).scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Preview foto
const fotoInput = document.getElementById("jFoto");

fotoInput.addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("previewImg");

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File harus berupa gambar!");
    this.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Ukuran foto maksimal 5 MB!");
    this.value = "";
    return;
  }

  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
});

// Simpan antrian lokal
function tambahAntrian(jenis, akun) {
  const nomor = antrian.length + 1;

  const data = {
    nomor: "JP-" + String(Date.now()).slice(-6),
    jenis: jenis,
    akun: akun,
    tanggal: new Date().toLocaleString("id-ID")
  };

  antrian.push(data);

  localStorage.setItem(
    "jaspost_antrian",
    JSON.stringify(antrian)
  );

  renderQueue();

  return data.nomor;
}

// Tampilkan antrian
function renderQueue() {
  const list = document.getElementById("queueList");

  document.getElementById("queueCount").textContent =
    antrian.length;

  if (antrian.length === 0) {
    list.innerHTML = '<p class="empty">Belum ada antrian.</p>';
    return;
  }

  list.innerHTML = [...antrian].reverse().map(item => `
    <div class="queue-item">
      <strong>${item.nomor}</strong><br>
      ${item.jenis} - ${escapeHTML(item.akun)}<br>
      <small>${item.tanggal}</small>
    </div>
  `).join("");
}

// Amankan teks dari input HTML
function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

// Buka WhatsApp
function kirimWA(pesan) {
  const url = "https://wa.me/" + ADMIN_WA +
    "?text=" + encodeURIComponent(pesan);

  window.open(url, "_blank");
}

// FORM CARI AKUN
document.getElementById("cariForm")
.addEventListener("submit", function (e) {
  e.preventDefault();

  const akun = document.getElementById("cAkun").value;
  const dana = document.getElementById("cDana").value;
  const spek = document.getElementById("cSpek").value;
  const nomor = document.getElementById("cNomor").value;

  const nomorAntrian = tambahAntrian("CARI AKUN", akun);

  const pesan = `*FORMAT NEED/CARIKAN AKUN HAJI AKBAR 🚀*

*ANTRIAN: ${nomorAntrian}*

*AKUN :* ${akun}
*DANA :* ${dana}
*SPEK :* ${spek}
*NOMER :* ${nomor}
*MC : [HAJI AKBAR]*

_WARNING !!!_
*WAJIB GUNAKAN JASA ADMIN MC HAJI AKBAR !!!!*`;

  kirimWA(pesan);
});

// FORM JUAL AKUN
document.getElementById("jualForm")
.addEventListener("submit", function (e) {
  e.preventDefault();

  const foto = fotoInput.files[0];

  if (!foto) {
    alert("Silakan pilih foto akun terlebih dahulu!");
    return;
  }

  const jenis = document.getElementById("jJenis").value;
  const akun = document.getElementById("jAkun").value;
  const harga = document.getElementById("jHarga").value;
  const spek = document.getElementById("jSpek").value;
  const log = document.getElementById("jLog").value;
  const bind = document.getElementById("jBind").value;
  const nomor = document.getElementById("jNomor").value;

  const nomorAntrian = tambahAntrian("JUAL AKUN", akun);

  const pesan = `*FORMAT JASAPOST AKUN BY HAJI AKBAR*

*ANTRIAN: ${nomorAntrian}*

[BUKAN AKUN ADMIN]

JUAL/NEED : ${jenis}
AKUN : ${akun}
HARGA : ${harga}
SPEK : ${spek}
LOG : ${log}
BIND : ${bind}
NO : ${nomor}
MC : HAJI AKBAR

📌NOTE
WAJIB MENGGUNAKAN MC *HAJI AKBAR*
AGAR TERHINDAR DARI PENIPUAN.

📷 FOTO AKUN:
Foto sudah dipilih dan akan dilampirkan secara manual.`;

  alert(
    "Nomor antrian: " + nomorAntrian +
    "\nWhatsApp akan dibuka. Lampirkan foto akun sebelum mengirim pesan."
  );

  kirimWA(pesan);
});

// Hapus antrian lokal
function clearQueue() {
  if (!confirm("Yakin ingin menghapus seluruh antrian lokal?")) {
    return;
  }

  antrian = [];

  localStorage.removeItem("jaspost_antrian");

  renderQueue();
}
