document.addEventListener("DOMContentLoaded", function () {
  // Ambil data keranjang dari localStorage atau inisialisasi array kosong
  let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];

  // Update jumlah item di header (jika elemen tersedia)
  const jumlahSpan = document.getElementById("jumlahKeranjang");
  if (jumlahSpan) jumlahSpan.textContent = keranjang.length;

  // Tambahkan event ke tombol "Masukkan Keranjang" (jika ada di halaman)
  const tombolBeli = document.querySelectorAll(".btn-keranjang");
  tombolBeli.forEach((btn) => {
    btn.addEventListener("click", function () {
      const card = this.closest(".produk-card");
      const nama = card.querySelector("h3").textContent;
      const hargaText = card.querySelector(".harga").textContent
        .replace("Rp", "")
        .replace(".", "")
        .replace(",", "")
        .trim();
      const harga = parseInt(hargaText);
      const gambar = card.querySelector("img").getAttribute("src");

      const produk = { nama, harga, gambar };
      keranjang.push(produk);
      localStorage.setItem("keranjang", JSON.stringify(keranjang));

      if (jumlahSpan) jumlahSpan.textContent = keranjang.length;

      alert(`${nama} telah ditambahkan ke keranjang.`);
    });
  });

  // Tampilkan isi keranjang jika elemen tersedia (di halaman keranjang.html)
  const daftarKeranjang = document.getElementById("daftarKeranjang");
  if (daftarKeranjang) {
    function tampilkanKeranjang() {
      daftarKeranjang.innerHTML = "";

      // Tampilkan setiap item
      keranjang.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("item-keranjang");
        div.innerHTML = `
          <span><strong>${item.nama}</strong> - Rp${item.harga}</span>
          <button data-index="${index}" class="hapus-item">Hapus</button>
        `;
        daftarKeranjang.appendChild(div);
      });

      // Jika kosong
      if (keranjang.length === 0) {
        daftarKeranjang.innerHTML = "<p>Keranjang kosong.</p>";
      }

      // Fungsi hapus item
      document.querySelectorAll(".hapus-item").forEach(button => {
        button.addEventListener("click", function () {
          const index = this.getAttribute("data-index");
          keranjang.splice(index, 1);
          localStorage.setItem("keranjang", JSON.stringify(keranjang));
          tampilkanKeranjang();
          if (jumlahSpan) jumlahSpan.textContent = keranjang.length;
        });
      });

      // Hitung total harga
      const totalHarga = keranjang.reduce((total, item) => total + item.harga, 0);
      const totalHargaElem = document.getElementById("totalHarga");
      if (totalHargaElem) totalHargaElem.textContent = `Total: Rp${totalHarga}`;

      // Buat pesan WhatsApp otomatis
      const pesan = keranjang.map(item => `• ${item.nama} - Rp${item.harga}`).join("%0A");
      const linkWA = `https://wa.me/6282218935654?text=Halo%20Valokuvaaa!%0ASaya%20ingin%20memesan:%0A${pesan}%0ATotal:%20Rp${totalHarga}`;
      const waLinkElem = document.getElementById("whatsappLink");
      if (waLinkElem) waLinkElem.href = linkWA;
    }

    tampilkanKeranjang();
  }
});