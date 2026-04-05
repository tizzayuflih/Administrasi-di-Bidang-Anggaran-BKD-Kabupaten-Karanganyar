// ================== BUAT DOKUMEN ==================
// ================== UTILITY ==================
function toTitleCase(str) {
    if (!str) return "";

    const smallWords = ["dan"];

    return str
        .toLowerCase()
        .split(" ")
        .map((word, index) => {
            if (index !== 0 && smallWords.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

function toTitleCaseID(str) {
    if (!str) return "";

    const smallWords = [
        "dan",
        "di",
        "ke",
        "dari",
        "pada",
        "yang",
        "atau",
        "dengan",
    ];

    return str
        .toLowerCase()
        .split(" ")
        .map((word, index) => {
            if (index !== 0 && smallWords.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

function formatPerubahan(str) {
    if (!str) return "";
    let out = toTitleCaseID(str);
    out = out.replace(/\(([^)]+)\)/g, (m, p) => `(${p.toUpperCase()})`);
    return out;
}

function mmToPx(mm) {
    return mm * 3.78; // 1 mm ≈ 3.78 px
}

let widthKertas = "210mm"; // default
let heightKertas = "297mm"; // default

document.addEventListener("DOMContentLoaded", function () {
    const ukuran = document.getElementById("ukuranKertas");

    if (!ukuran) return;

    ukuran.addEventListener("change", function () {
        const halaman = document.querySelector(".halaman");
        if (!halaman) return;

        // default semua property
        halaman.style.width = "";
        halaman.style.minHeight = "";

        switch (this.value) {
            case "A4":
                halaman.style.width = "210mm";
                halaman.style.minHeight = "297mm";
                break;
            case "F4":
                halaman.style.width = "210mm";
                halaman.style.minHeight = "330mm";
                break;
            case "Letter":
                halaman.style.width = "216mm";
                halaman.style.minHeight = "279mm";
                break;
            default:
                // fallback
                halaman.style.width = "210mm";
                halaman.style.minHeight = "297mm";
        }
    });

    ukuran.dispatchEvent(new Event("change"));
});


function buatDokumen() {
    let jenis = document.getElementById("jenisDokumen").value;

    if (jenis === "persetujuanDPA") {
        buatPersetujuan();
        return;
    }
    // ================= AMBIL DATA FORM =================
    let yth = document.getElementById("yth").value;
    let lewat = document.getElementById("lewat").value;
    let dari = document.getElementById("dari").value;

    let nomorSuratPermohonanPergeseran = document.getElementById("nomorSuratPermohonanPergeseran").value;
    let tanggalSuratPermohonanPergeseran = document.getElementById("tanggalSuratPermohonanPergeseran").value;
    let tanggalPembuatanLaporan = document.getElementById("tanggalPembuatanLaporan").value;

    // let nomor = document.getElementById("nomor").value;
    let sifat = document.getElementById("sifat").value;
    let tahunAnggaranPergeseran = document.getElementById("tahunAnggaranPergeseran").value;
    // let lampiran = document.getElementById("lampiran").value;
    // let hal = document.getElementById("hal").value;
    let hasilYgDicapai = document.getElementById("hasilYgDicapai").value;

    let kecamatan = document.getElementById("kecamatan").value
        .replace(/kecamatan/gi, "")
        .trim();
    let kegiatan = document.getElementById("kegiatan").value;
    let rincianPerubahan = document.getElementById("rincianPerubahan").value;
    let perihalPergeseran = document.getElementById("perihalPergeseran").value;

    // Pengaturan cetak
    let font = document.getElementById("font").value;
    // raw font size for preview (user-selected value)
    let fontSize = document.getElementById("fontSize").value;
    let lineSpacing = document.getElementById("lineSpacing").value;
    let marginAtas = document.getElementById("marginAtas").value;
    let marginBawah = document.getElementById("marginBawah").value;
    let marginKiri = document.getElementById("marginKiri").value;
    let marginKanan = document.getElementById("marginKanan").value;

    // Konversi margin mm → px untuk preview
    let paddingAtas = mmToPx(marginAtas);
    let paddingBawah = mmToPx(marginBawah);
    let paddingKiri = mmToPx(marginKiri);
    let paddingKanan = mmToPx(marginKanan);

    // Paraf koordinasi
    let pakaiParaf = document.getElementById("pakaiParaf")?.checked;
    let tabelParaf = "";
    if (pakaiParaf) {
        let jumlah = parseInt(document.getElementById("jumlahPejabat").value) || 0;
        tabelParaf += `<div style="margin-top:40px; width:45%;">
            <table style="width:100%; border-collapse:collapse; border:1px solid black;">
                <tr>
                    <td colspan="2" style="border:1px solid black; text-align:center;">
                        Telah di Koordinasikan
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid black; text-align:center;font-weight:bold;">Pejabat</td>
                    <td style="border:1px solid black; text-align:center;font-weight:bold;">Paraf</td>
                </tr>`;
        for (let i = 1; i <= jumlah; i++) {
            const nama = document.getElementById("pejabat" + i)?.value || "";

            tabelParaf += `
                <tr>
                    <td style="border:1px solid black; padding:5px;">
                        <span class="preview-highlight">${nama || "&nbsp;"}</span>
                    </td>
                    <td style="border:1px solid black;"></td>
                </tr>
            `;
        }

        tabelParaf += `
                </table>
            </div>
        `;
    }
    // Bangun Isi Dokumen
    let isi = `
    <div class="halaman" style="
        font-family:${font};
        font-size:${fontSize}pt;
        line-height:${lineSpacing};
        width:${widthKertas};
        min-height:${heightKertas};
        box-sizing:border-box;
        padding:${paddingAtas}px ${paddingKanan}px ${paddingBawah}px ${paddingKiri}px;
    ">
        <div style="width:85%; margin:0 auto 15px auto;">
            <table style="width:100%; border-collapse:collapse;">
                <tr><td style="width:120px;">Yth.</td><td style="width:10px;">:</td><td><span class="preview-highlight">${yth}</span></td></tr>
                <tr><td>Lewat</td><td>:</td><td><span class="preview-highlight">${lewat}</span></td></tr>
                <tr><td>Dari</td><td>:</td><td><span class="preview-highlight">${dari}</span></td></tr>
                <tr><td>Tanggal</td><td>:</td><td><span class="preview-highlight">${tanggalPembuatanLaporan}</span></td></tr>
                <tr><td>Nomor</td><td>:</td><td>-</td></tr>
                <tr><td>Sifat</td><td>:</td><td><span class="preview-highlight">${sifat}</span></td></tr>
                <tr><td>Lampiran</td><td>:</td><td>-</td></tr>
                <tr><td>Hal</td><td>:</td><td>Laporan/Kajian Pergeseran Anggaran</td></tr>
            </table>
        </div>

        <hr style="border:none;border-top:2px solid black;margin:10px 0;">

        <p style="text-align:center; margin-top:20px;">
            LAPORAN TENTANG<br>
            PERGESERAN DOKUMEN PELAKSANAAN ANGGARAN PADA<br>
            <span class="preview-highlight">${kecamatan.toUpperCase()}</span>
        </p>

        <div style="margin-left:0px;">
            <p><strong>A. Pendahuluan</strong></p>

            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">1.</td>
                    <td style="width:180px; vertical-align:top;">Umum/Latar belakang</td>
                    <td style="width:10px; vertical-align:top;">:</td>
                    <td style="text-align:justify;">
                        Dalam rangka pergeseran dokumen pelaksanaan anggaran 
                        pada <span class="preview-highlight">${toTitleCase(kecamatan)}</span>.
                    </td>
                </tr>
                <tr>
                    <td style="padding-left:20px; vertical-align:top;">2.</td>
                    <td style="vertical-align:top;">Landasan Hukum</td>
                    <td style="vertical-align:top;">:</td>
                    <td style="text-align:justify;">
                        Surat Kepala <span class="preview-highlight">${toTitleCase(kecamatan)}</span> 
                        Nomor <span class="preview-highlight">${nomorSuratPermohonanPergeseran}</span> 
                        tanggal <span class="preview-highlight">${tanggalSuratPermohonanPergeseran}</span>.
                    </td>
                </tr>
                <tr>
                    <td style="padding-left:20px; vertical-align:top;">3.</td>
                    <td style="vertical-align:top;">Maksud dan Tujuan</td>
                    <td style="vertical-align:top;">:</td>
                    <td style="text-align:justify;">
                        Pergeseran anggaran sub kegiatan <span class="preview-highlight">${kegiatan}</span> 
                        pada <span class="preview-highlight">${toTitleCase(kecamatan)}</span>.
                    </td>
                </tr>
            </table>
           
            <p><strong>B. Hasil yang Dicapai</strong></p>
            <p style="text-align:justify; margin-left: 20px;">
                <span class="preview-highlight">${hasilYgDicapai}</span> sub kegiatan 
                <span class="preview-highlight">${kegiatan}</span> pada <span class="preview-highlight">${toTitleCase(kecamatan)}</span>.
            </p>


            <p><strong>C. Simpulan</strong></p>

            <!-- 1 -->
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">1.</td>
                    <td style="text-align:justify;">
                        Berdasarkan Permendagri Nomor 77 Tahun 2020 tentang Pedoman Teknis
                        Pengelolaan Keuangan Daerah bahwa pergeseran anggaran terdiri atas:
                    </td>
                </tr>
            </table>

            <table style="width:100%; border-collapse:collapse; margin-top:4px;">
                <tr>
                    <td style="width:55px; vertical-align:top; text-align:right; padding-right:6px;">
                        a.
                    </td>
                    <td style="text-align:justify;">
                        Pergeseran anggaran yang menyebabkan perubahan APBD;
                    </td>
                </tr>
                <tr>
                    <td style="width:55px; vertical-align:top; text-align:right; padding-right:6px;">
                        b.
                    </td>
                    <td style="text-align:justify;">
                        Pergeseran anggaran yang tidak menyebabkan perubahan APBD.
                    </td>
                </tr>
            </table>

            <!-- 2 -->
            <table style="width:100%; border-collapse:collapse; margin-top:5px;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">2.</td>
                    <td style="text-align:justify;">
                        Pergeseran anggaran yang menyebabkan perubahan APBD meliputi pergeseran
                        antar organisasi, antar unit organisasi, antar program, antar kegiatan,
                        antar sub kegiatan, antar kelompok, dan antar jenis belanja.
                    </td>
                </tr>
            </table>

            <!-- 3 -->
            <table style="width:100%; border-collapse:collapse; margin-top:5px;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">3.</td>
                    <td style="text-align:justify;">
                        Pergeseran anggaran yang tidak menyebabkan perubahan APBD meliputi:
                    </td>
                </tr>
            </table>

            <table style="width:100%; border-collapse:collapse; margin-top:3px;">
                <tr>
                    <td style="width:55px; vertical-align:top; text-align:right; padding-right:6px;">
                        a.
                    </td>
                    <td style="text-align:justify;">
                        Pergeseran antar objek dalam jenis yang sama atas persetujuan Sekretaris Daerah.
                    </td>
                </tr>
                <tr>
                    <td style="width:55px; vertical-align:top; text-align:right; padding-right:6px;">
                        b.
                    </td>
                    <td style="text-align:justify;">
                        Pergeseran antar rincian objek dalam objek yang sama atas persetujuan PPKD.
                    </td>
                </tr>
                <tr>
                    <td style="width:55px; vertical-align:top; text-align:right; padding-right:6px;">
                        c.
                    </td>
                    <td style="text-align:justify;">
                        Pergeseran antar sub rincian objek dalam rincian objek yang sama atas persetujuan PPKD.
                    </td>
                </tr>
                <tr>
                    <td style="width:55px; vertical-align:top; text-align:right; padding-right:6px;">
                        d.
                    </td>
                    <td style="text-align:justify;">
                        Perubahan atau pergeseran uraian sub rincian objek atas persetujuan Pengguna Anggaran.
                    </td>
                </tr>
            </table>
            <!-- 4 -->
            <table style="width:100%; border-collapse:collapse; margin-top:5px;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">4.</td>
                    <td style="text-align:justify;">
                        Berdasarkan DPA SKPD Belanja <span class="preview-highlight">${toTitleCase(kecamatan)}</span>
                        Tahun Anggaran <span class="preview-highlight">${tahunAnggaranPergeseran}</span> untuk 
                        Sub Kegiatan <span class="preview-highlight">${kegiatan}</span>
                        mengalami perubahan <span class="preview-highlight">${rincianPerubahan}</span>.
                    </td>
                </tr>
            </table>

            <!-- 5 -->
            <table style="width:100%; border-collapse:collapse; margin-top:5px;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">5.</td>
                    <td style="text-align:justify;">
                        Terkait surat dari <span class="preview-highlight">${toTitleCase(kecamatan)}</span> 
                        Kabupaten Karanganyar perihal <span class="preview-highlight">${perihalPergeseran}</span>
                        tersebut merupakan pergeseran antar rincian objek dalam objek yang sama sehingga termasuk
                        pergeseran anggaran yang tidak menyebabkan perubahan APBD. 
                        Oleh karena itu, pergeseran ini dapat dilakukan atas persetujuan PPKD.
                    </td>
                </tr>
            </table>

            <!-- 6 -->
            <table style="width:100%; border-collapse:collapse; margin-top:5px;">
                <tr>
                    <td style="width:20px; padding-left:20px; vertical-align:top;">6.</td>
                    <td style="text-align:justify;">
                        Dalam penyusunan pergeseran DPA agar memperhatikan Standar Harga sesuai
                        ketentuan peraturan perundang-undangan yang berlaku.
                    </td>
                </tr>
            </table>

            <p><strong>D. Penutup</strong></p>
            <p style="text-align:justify; margin-left: 20px;">
                Demikian untuk menjadikan periksa dan selanjutnya mohon petunjuk.
            </p>
            
            <!-- TTD -->
            <div style="margin-top:15px; width:100%; text-align:right; padding-right:60px; box-sizing:border-box;" id="ttdContainerPergeseran">
                <!-- TTD akan di-render dinamis -->
            </div>
            ${tabelParaf}
            </div>
            `;
            document.getElementById("hasilDokumen").innerHTML = isi;
// Render pertama kali
renderTTD();

// Munculkan tombol
    document.getElementById("hasilSection").style.display = "block";
    document.getElementById("btnCetak").style.display = "block";
}

function renderTTD() {
    const ttdContainer = document.getElementById("ttdContainerPergeseran");

    const isKepala = document.getElementById("bagianKepalaPergeseran")?.checked;
    const isPlt = document.getElementById("bagianPltPergeseran")?.checked;
    const unit = document.getElementById("unitKerjaPergeseran")?.value || "";
    const nama = document.getElementById("namaPejabatPergeseran")?.value || "";
    const nip = document.getElementById("nipPejabatPergeseran")?.value || "";
    const keterangan = document.getElementById("keteranganPejabatPergeseran")?.value.trim();
    const isKaranganyar = document.getElementById("cekKaranganyar")?.checked;

    if (!isKepala) {
        ttdContainer.innerHTML = "";
        return;
    }

    let html = `
    <div style="text-align:right; display:inline-block;">

        <div style="text-align:left; display:inline-block;">

            <!-- BARIS KEPALA -->
            <p style="margin:0; position:relative;">
                ${isPlt ? `
                    <span style="position:absolute; left:-35px;">
                        Plt.
                    </span>
                ` : ""}
                Kepala <span class="preview-highlight">${unit}</span>
            </p>

            ${isKaranganyar ? `<p style="margin:0;">Kabupaten Karanganyar</p>` : ""}

            <!-- JARAK TTD -->
            <p style="margin:40px 0 0 0;"></p>

            <p style="margin:0;">${nama}</p>
            ${keterangan ? `<p style="margin:0;"><span class="preview-highlight">${keterangan}</span></p>` : ""}
            <p style="margin:0;">NIP. <span class="preview-highlight">${nip}</span></p>

        </div>

    </div>
    `;

    ttdContainer.innerHTML = html;
}
// Event listener untuk render saat checkbox atau input berubah
const kepala = document.getElementById("bagianKepalaPergeseran");
if (kepala) kepala.addEventListener("change", renderTTD);

const plt = document.getElementById("bagianPltPergeseran");
if (plt) plt.addEventListener("change", renderTTD);

const ket = document.getElementById("keteranganPejabatPergeseran");
if (ket) ket.addEventListener("input", renderTTD);

// ================== CETAK & PDF ==================
function cetakDokumen() {

    applyPrintSettingPergeseran();

    const jenis = document.getElementById("jenisDokumen").value;

    // ambil nama OPD
    let opd = document.getElementById("kecamatan").value
        .replace(/kecamatan/gi, "")
        .trim()
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    let namaFile = "Dokumen.pdf";

    if (jenis === "pergeseran") {
        namaFile = opd + " - Laporan-Kajian Pergeseran Anggaran.pdf";
    }

    if (jenis === "persetujuanDPA") {
        namaFile = opd + " - SK Persetujuan Perubahan DPA-SKPD.pdf";
    }

    document.title = namaFile;

    window.print();
}

// ================== GENERATE INPUT PEJABAT ==================
document.addEventListener("DOMContentLoaded", function() {
    let jumlahInput = document.getElementById("jumlahPejabat");

    if (jumlahInput) {
        jumlahInput.addEventListener("input", function() {
            let jumlah = parseInt(this.value) || 0;
            let container = document.getElementById("daftarPejabat");

            container.innerHTML = "";

            for (let i = 1; i <= jumlah; i++) {
                container.innerHTML += `
                    <label>Pejabat ${i}</label>
                    <input type="text" id="pejabat${i}" placeholder="Isi Jabatan">
                `;
            }
        });
        jumlahInput.dispatchEvent(new Event("input"));
    }
});

// ================== GANTI JENIS DOKUMEN ==================
function updateFontOptions(jenis) {
    // Adjust order of font dropdown depending on dokumen type
    const fontSelect = document.getElementById("font");
    if (!fontSelect) return;

    // all possible fonts
    const fonts = [
        "Arial",
        "Times New Roman",
        "Calibri",
        "Bookman Old Style",
    ];

    let ordered;
    if (jenis === "persetujuanDPA") {
        // persetujuan should show Bookman Old Style first
        ordered = [
            "Bookman Old Style",
            "Arial",
            "Times New Roman",
            "Calibri",
        ];
    } else {
        // default (pergeseran or none) puts Arial first
        ordered = [
            "Arial",
            "Times New Roman",
            "Calibri",
            "Bookman Old Style",
        ];
    }
    // rebuild the select options
    fontSelect.innerHTML = "";
    ordered.forEach((f) => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = f;
        fontSelect.appendChild(opt);
    });
}

function updateUkuranKertas(jenis) {

    const ukuran = document.getElementById("ukuranKertas");
    if (!ukuran) return;

    if (jenis === "persetujuanDPA") {
        ukuran.value = "F4";
    } else {
        ukuran.value = "A4";
    }

}

function updateSpasiBaris(jenis) {

    const spasi = document.getElementById("lineSpacing");
    if (!spasi) return;

    if (jenis === "persetujuanDPA") {
        spasi.value = "1.15";
    } else if (jenis === "pergeseran") {
        spasi.value = "1.5";
    } else {
        spasi.value = "1.5"; // default
    }

}

function gantiJenisDokumen() {
    let jenis = document.getElementById("jenisDokumen").value;
    let wrapper = document.getElementById("isiDokumenWrapper");
    let kolomKiri = document.getElementById("kolomKiri");
    let btn = document.getElementById("btnBuatDokumen");
    let btnCetak = document.getElementById("btnCetak");

    // RESET HASIL DOKUMEN
    document.getElementById("hasilSection").style.display = "none";
    document.getElementById("hasilDokumen").innerHTML = "";
    btnCetak.style.display = "none";

    // update font dropdown order every time dokumen type changes
    updateFontOptions(jenis);
    updateUkuranKertas(jenis);
    updateSpasiBaris(jenis);

    if (jenis === "") {
        wrapper.style.display = "none";
        btn.style.display = "none";
        return;
    }

    wrapper.style.display = "flex";
    btn.style.display = "inline-block";

    if (jenis === "pergeseran") {
        kolomKiri.innerHTML =
            document.getElementById("templatePergeseran").innerHTML;
        btnCetak.setAttribute("onclick", "cetakDokumen()");
        // default margins for pergeseran documents
        const leftMargin = document.getElementById("marginKiri");
        const topMargin = document.getElementById("marginAtas");
        if (leftMargin) {
            leftMargin.value = 25;
        }
        if (topMargin) {
            topMargin.value = 40;
        }
    } 
    else if (jenis === "persetujuanDPA") {
        kolomKiri.innerHTML =
            document.getElementById("templatePersetujuan").innerHTML;
        btnCetak.setAttribute("onclick", "cetakPersetujuan()");
        // use larger margins for persetujuan documents
        const rightMargin = document.getElementById("marginKanan");
        const leftMargin = document.getElementById("marginKiri");
        const bottomMargin = document.getElementById("marginBawah");
        if (rightMargin) {
            rightMargin.value = 18;
        }
        if (leftMargin) {
            leftMargin.value = 20;
        }
        if (bottomMargin) {
            bottomMargin.value = 15;
        }
    }
}

// ================== BUAT DOKUMEN PERSETUJUAN  ==================
function buatPersetujuan() {

    const font = document.getElementById("font").value;
    // preview shows the raw user-selected size; printing will apply scaling
    const fontSize = document.getElementById("fontSize").value;
    const lineSpacing = document.getElementById("lineSpacing").value;

    const marginAtas = document.getElementById("marginAtas").value;
    const marginBawah = document.getElementById("marginBawah").value;
    const marginKiri = document.getElementById("marginKiri").value;
    const marginKanan = document.getElementById("marginKanan").value;

    // konversi mm -> px untuk preview sama seperti buatDokumen
    const paddingAtas = mmToPx(marginAtas);
    const paddingBawah = mmToPx(marginBawah);
    const paddingKiri = mmToPx(marginKiri);
    const paddingKanan = mmToPx(marginKanan);
   
    // ================= BAGIAN PERSETUJUAN (LEWAT) =================
    const isPltLewat = document.getElementById("bagianPlt")?.checked;
    const isKepalaLewat = document.getElementById("bagianKepala")?.checked;

    let bagianLewat = "";

    if (isPltLewat && isKepalaLewat) {
        bagianLewat = "Plt. KEPALA";
    } else if (isPltLewat) {
        bagianLewat = "Plt.";
    } else if (isKepalaLewat) {
        bagianLewat = "KEPALA";
    }
    const bagianLEWAT = bagianLewat.toLowerCase().split(" ").map(word => {return word.charAt(0).toUpperCase() + word.slice(1);}).join(" ");
    const opdLewat = document.getElementById("opdPersetujuanLewat")?.value.trim().toUpperCase() || "";;
    const OPDLewat = toTitleCaseID(opdLewat);

    const jabatanRaw = document.getElementById("jabatanPersetujuan").value.trim().toUpperCase();    
    const jabatanTitle = toTitleCaseID(jabatanRaw);

    const perubahanRaw = document.getElementById("perubahanPermohonan").value.trim();
    const perubahan = perubahanRaw.toUpperCase();
    function formatPerubahanPasal(text) {
        if (!text) return "";

        // 1. Title Case Indonesia
        let hasil = text
            .toLowerCase()
            .split(" ")
            .map((kata, i) => {
                return kata.charAt(0).toUpperCase() + kata.slice(1);
            })
            .join(" ");

        // 2. Isi dalam kurung jadi KAPITAL
        hasil = hasil.replace(/\(([^)]+)\)/g, (_, isi) => {
            return `(${isi.toUpperCase()})`;
        });

        return hasil;
    }

    const perubahanPasal = formatPerubahanPasal(perubahanRaw);

    const tahun = document.getElementById("tahunPersetujuan").value.trim();

    const skpd = document.getElementById("opdPermohonan").value.trim();
    const skpdRaw = toTitleCaseID(skpd);

    const nomorPermohonan = document.getElementById("nomorPermohonan").value.trim();
    const tanggalPermohonan = document.getElementById("tanggalPermohonan").value.trim();   
    const perihal = document.getElementById("perihalPermohonan").value.trim();
    const subKegiatan = document.getElementById("subkegiatanPermohonan").value.trim();   
    const pergeseran = document.getElementById("pergeseranPermohonan").value.trim().toLowerCase();   
    
    const tanggalTTD = document.getElementById("tanggalPenetapanPersetujuan").value.trim();
    const unitTTD = document.getElementById("unitKerjaPersetujuan").value.trim();
    const isKepala = document.getElementById("bagianKepalaPenandatangan").checked;
    const isPlt = document.getElementById("bagianPltPenandatangan").checked;
    const namaTTD = document.getElementById("namaPejabatPersetujuan").value.trim();
    const nipTTD = document.getElementById("nipPejabatPersetujuan").value.trim();
    let jabatanTTD = "";

    if (isPlt && isKepala) {
        jabatanTTD = "Plt. Kepala";
    } else if (isKepala) {
        jabatanTTD = "Kepala";
    } else if (isPlt) {
        jabatanTTD = "Plt.";
    } else {
        jabatanTTD = "Kepala"; // default
    }
    // ================= PARAF KOORDINASI PERSETUJUAN =================
    const pakaiParaf = document.getElementById("pakaiParaf")?.checked;
    let tabelParaf = "";

    if (pakaiParaf) {
        const jumlah = parseInt(document.getElementById("jumlahPejabat")?.value) || 0;

        tabelParaf += `
            <div style="margin-top:40px; width:45%;">
                <table style="width:100%; border-collapse:collapse; border:1px solid black;">
                    <tr>
                        <td colspan="2" style="border:1px solid black; text-align:center;">
                            Telah di Koordinasikan
                        </td>
                    </tr>
                    <tr>
                        <td style="border:1px solid black; text-align:center; font-weight:bold;">Pejabat</td>
                        <td style="border:1px solid black; text-align:center; font-weight:bold;">Paraf</td>
                    </tr>
        `;

        for (let i = 1; i <= jumlah; i++) {
            const nama = document.getElementById("pejabat" + i)?.value || "";
            tabelParaf += `
                <tr>
                    <td style="border:1px solid black; padding:5px;"><span class="preview-highlight">${nama}</span></td>
                    <td style="border:1px solid black;"></td>
                </tr>
            `;
        }

        tabelParaf += `
                </table>
            </div>
        `;
    }

    // build description of who "lewat" based on bagian and OPD name
    let dynamicLewat = bagianLewat;

    if (opdLewat) {
        dynamicLewat += " " + opdLewat.toUpperCase();
    }

    // compute title‑case variant for use in Pasal I and II text
    const dynamicLewatPasal = toTitleCaseID(dynamicLewat);

    // prepare an extra paragraph showing the approval OPD/Kecamatan explicitly
    let tambahanOPD = "";
    if (opdLewat) {
        tambahanOPD = `
            <p style="margin-top:10px;">
                Persetujuan dari OPD/Kecamatan: ${opdLewat}
            </p>
        `;
    }
    const isi = `
    <div class="halaman"
    style="
        font-family:${font};
        font-size:${fontSize}pt;
        line-height:${lineSpacing};
        width:${widthKertas};
        min-height:${heightKertas};
        box-sizing:border-box;
        padding:${paddingAtas}px ${paddingKanan}px ${paddingBawah}px ${paddingKiri}px;
        text-align:justify;
    ">
    
    <p style="text-align:center; line-height:1.4;">
        PERSETUJUAN <span class="preview-highlight">${bagianLewat}</span> <span class="preview-highlight">${opdLewat}</span> KABUPATEN KARANGANYAR<br>
        SELAKU <span class="preview-highlight">${jabatanRaw}</span><br>
        NOMOR :
    </p>

    <p style="text-align:center; line-height:1.4; margin-top:25px;">
        TENTANG<br>
        PERUBAHAN ATAS <span class="preview-highlight">${perubahan}</span><br>
        <span class="preview-highlight">${skpd}</span> KABUPATEN KARANGANYAR<br>
        TAHUN ANGGARAN <span class="preview-highlight">${tahun}</span>
    </p>

    <p style="margin-top:30px; text-align:center; line-height:1.4;">
        <span class="preview-highlight">${jabatanRaw}</span>
    </p>

    <table style="width:100%; border-collapse:collapse; margin-top:13px;">
        <tr>
            <td style="width:120px; vertical-align:top;">Membaca</td>
            <td style="width:15px; vertical-align:top;">:</td>
            <td style="text-align:justify;">
                Surat dari <span class="preview-highlight">${skpdRaw}</span> Nomor : <span class="preview-highlight">${nomorPermohonan}</span>
                tanggal <span class="preview-highlight">${tanggalPermohonan}</span>
                perihal <span class="preview-highlight">${perihal}</span> Anggaran Tahun Anggaran <span class="preview-highlight">${tahun}</span>;
            </td>
        </tr>
    </table>

    <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <tr>
            <td style="width:120px; vertical-align:top;">Mengingat</td>
            <td style="width:15px; vertical-align:top;">:</td>
            <td>

                <table style="width:100%; border-collapse:collapse;">
                   
                    <tr>
                        <td style="width:25px; vertical-align:top;">1.</td>
                        <td style="text-align:justify;">
                            Pasal 18 ayat (6) Undang-Undang Dasar Negara Republik Indonesia Tahun 1945;
                        </td>
                    </tr>

                    <tr>
                        <td style="vertical-align:top;">2.</td>
                        <td style="text-align:justify;">
                            Undang-Undang Nomor  13  Tahun  1950  tentang   Pembentukan Daerah-Daerah Kabupaten dalam Lingkungan Provinsi Jawa Tengah (Berita Negara Republik Indonesia Tahun 1950 Nomor 42);
                        </td>
                    </tr>

                    <tr>
                        <td style="vertical-align:top;">3.</td>
                        <td style="text-align:justify;">
                            Undang-Undang Nomor  17  Tahun  2003  tentang Keuangan Negara (Lembaran Negara Republik Indonesia Tahun 2003 Nomor 47, Tambahan Lembaran Negara Republik Indonesia Nomor 4286) sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang (Lembaran Negara Republik Indonesia Tahun 2023 Nomor 41, Tambahan Lembaran Negara Republik Indonesia Nomor 6856);
                    </tr>

                    <tr>
                        <td style="vertical-align:top;">4.</td>
                        <td style="text-align:justify;">
                            Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 244, Tambahan Lembaran Negara Republik Indonesia Nomor 5587) sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 6 Tahun 2023 tentang Penetapan Peraturan Pemerintah Pengganti Undang Undang Nomor 2 Tahun 2022 tentang Cipta Kerja menjadi Undang-Undang (Lembaran Negara Republik Indonesia Tahun 2023 Nomor 41, Tambahan Lembaran Negara Republik Indonesia Nomor 6856);
                        </td>
                    </tr>

                    <tr>
                        <td style="vertical-align:top;">5.</td>
                        <td style="text-align:justify;">
                            Undang-Undang Nomor 11 Tahun 2023 tentang Provinsi Jawa Tengah (Lembaran Negara Republik Indonesia Tahun 2023  Nomor 58, Tambahan Lembaran Negara Republik Indonesia Nomor 6867);
                    </tr>

                    <tr>
                        <td style="vertical-align:top;">6.</td>
                        <td style="text-align:justify;">
                            Peraturan Pemerintah Nomor 12 Tahun 2019 tentang Pengelolaan Keuangan Daerah (Lembaran Negara Republik Indonesia Tahun 2019 Nomor 42, Tambahan Lembaran Negara Republik Indonesia Nomor 6322);
                        </td>
                    </tr>

                    <tr>
                        <td style="vertical-align:top;">7.</td>
                        <td style="text-align:justify;">
                            Peraturan Daerah Kabupaten Karanganyar Nomor 11 Tahun 2022 Tentang Pengelolaan Keuangan Daerah (Lembaran Daerah Kabupaten Karanganyar Tahun 2022 Nomor 11, Tambahan Lembaran Daerah Kabupaten Karanganyar Nomor 139).
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

    <table style="width:100%; border-collapse:collapse; margin-top:25px;">
        <tr>
            <td colspan="2"></td>
            <td style="text-align:center; padding-bottom:25px;">MEMUTUSKAN :</td>
        </tr>
        <tr>
            <!-- Kolom 1 -->
            <td style="width:120px; vertical-align:top;">Menetapkan</td>

            <!-- Kolom 2 -->
            <td style="width:15px; vertical-align:top;">:</td>

            <!-- Kolom 3 -->
            <td style="text-align:justify;">

                PERSETUJUAN <span class="preview-highlight">${bagianLewat}</span> <span class="preview-highlight">${opdLewat}</span> KABUPATEN KARANGANYAR 
                SELAKU <span class="preview-highlight">${jabatanRaw}</span> TENTANG PERUBAHAN ATAS  <span class="preview-highlight">${perubahan}</span> 
                BELANJA <span class="preview-highlight">${skpd}</span> KABUPATEN KARANGANYAR TAHUN ANGGARAN <span class="preview-highlight">${tahun}</span>.
                
                <div style="text-align:center; margin-top:12px;">
                    Pasal I
                </div>

                <div style="margin-top:12px;">
                    <span class="preview-highlight">${perubahanPasal}</span> Belanja <span class="preview-highlight">${skpdRaw}</span> Kabupaten 
                    Karanganyar Tahun Anggaran <span class="preview-highlight">${tahun}</span> untuk sub kegiatan <span class="preview-highlight">${subKegiatan}</span> 
                    mengalami pergeseran <span class="preview-highlight">${pergeseran}</span> yang diubah 
                    dan dibaca sehingga berbunyi sebagaimana tersebut dalam lampiran 
                    Persetujuan <span class="preview-highlight">${bagianLEWAT}</span> <span class="preview-highlight">${OPDLewat}</span> selaku <span class="preview-highlight">${jabatanTitle}</span>.
                </div>

                <div style="text-align:center; margin-top:12px;">
                    Pasal II
                </div>

                <div style="margin-top:12px;">
                    Persetujuan <span class="preview-highlight">${bagianLEWAT}</span> <span class="preview-highlight">${OPDLewat}</span> Kabupaten Karanganyar selaku <span class="preview-highlight">${jabatanTitle}</span> ini mulai berlaku pada tanggal ditetapkan.
                </div>

                <!-- TTD -->
                <div style="margin-top:25px; width:100%; text-align:right; padding-right:60px; box-sizing:border-box;" id="ttdContainerPersetujuan">
                    <!-- TTD akan di-render dinamis -->
                </div>
            </td>
        </tr>
    </table>
    ${tabelParaf}
    </div>

    `;

    document.getElementById("hasilDokumen").innerHTML = isi;
    document.getElementById("hasilSection").style.display = "block";
    document.getElementById("btnCetak").style.display = "block";
    renderTTDPersetujuan();
}

// Penandatanganan Persetujuan
function renderTTDPersetujuan() {
    const ttdContainer = document.getElementById("ttdContainerPersetujuan");

    const isKepala = document.getElementById("bagianKepalaPenandatangan").checked;
    const isPlt = document.getElementById("bagianPltPenandatangan").checked;
    const unit = document.getElementById("unitKerjaPersetujuan").value.trim();
    const nama = document.getElementById("namaPejabatPersetujuan").value.trim();
    const nip = document.getElementById("nipPejabatPersetujuan").value.trim();
    const tanggal = document.getElementById("tanggalPenetapanPersetujuan").value.trim() || " ";
    const isketerangan = document.getElementById("keteranganPejabatPersetujuan")?.value.trim();
    const bagianUnitKerja = document.getElementById("bagianunitKerjaPersetujuan")?.value.trim();
    const kabKaranganyar = document.getElementById("cekKaranganyarPersetujuan")?.checked;

    if (!isKepala && !isPlt) {
        ttdContainer.innerHTML = "";
        return;
    }

    const kolomMarginKanan = "140px"; // geser kolom utama ke kanan

    let html = `
    <div style="position:relative; display:inline-block; margin-bottom:40px;">

        <!-- KOLOM UTAMA -->
        <div style="margin-left:${kolomMarginKanan}; text-align:left;">
            
            <p style="margin:0;">Ditetapkan di Karanganyar</p>
            <p style="margin:0;">
                Pada tanggal 
                <span class="preview-highlight">${tanggal}</span>
            </p>

            <p style="margin:18px 0 0 0; position:relative;">
                
                ${isPlt ? `
                    <span style="position:absolute; left:-35px;">
                        Plt.
                    </span>
                ` : ""}

                ${isKepala ? "Kepala " : ""}
                <span class="preview-highlight">${unit}</span>

            </p>
            
            ${bagianUnitKerja ? `
            ${(() => {
                const words = bagianUnitKerja.split(" ");
                const firstLineWords = words.slice(0, 2).join(" "); // 2 kata pertama setelah 'Selaku'
                const secondLine = words.slice(2).join(" ");         // sisanya
                return `
                <p style="margin:0;">
                    <span class="preview-highlight">Selaku ${firstLineWords}</span>
                </p>
                ${secondLine ? `<p style="margin:0;"><span class="preview-highlight">${secondLine}</span></p>` : ""}
                `;
            })()}
            ` : ""}

            ${kabKaranganyar ? `<p style="margin:0;">Kabupaten Karanganyar</p>` : ""}

            <p style="margin:30px 0 0 0;">&nbsp;</p>

            <p style="margin:0;">
                <span class="preview-highlight">${nama}</span>
            </p>

            ${isketerangan ? `<p style="margin:0;">${isketerangan}</p>` : ""}

            <p style="margin:0;">
                NIP. <span class="preview-highlight">${nip}</span>
            </p>

        </div>

    </div>
    `;

    ttdContainer.innerHTML = html;
}

// toggleOPD kept for compatibility but no longer hides the container
function toggleOPD() {
    // do nothing; approval OPD always visible
    // could clear value if bagian empty
    let bagian = document.getElementById("bagianPersetujuan").value;
    if (!bagian) {
        let opdInput = document.getElementById("opdPersetujuanLewat");
        if (opdInput) opdInput.value = "";
    }
}
/* =====================================================
   CETAK PERSETUJUAN
   ===================================================== */
function cetakPersetujuan() {

    applyPrintSettingPersetujuan();

    let opd = document.getElementById("opdPermohonan").value
        .trim()
        .toLowerCase()
        .split(" ")
        .filter(word => word !== "")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    let namaFile = "SK Persetujuan Perubahan DPA-SKPD.pdf";

    if (opd) {
        namaFile = opd + " - SK Persetujuan Perubahan DPA-SKPD.pdf";
    }

    document.title = namaFile;

    window.print();
}

// ===============================
// PRINT STYLE ENGINE 
// ===============================
function applyPrintSettingPergeseran() {

    let ukuranKertas = document.getElementById("ukuranKertas").value;
    let marginAtas = document.getElementById("marginAtas").value;
    let marginBawah = document.getElementById("marginBawah").value;
    let marginKiri = document.getElementById("marginKiri").value;
    let marginKanan = document.getElementById("marginKanan").value;

    let font = document.getElementById("font").value;
    let fontSize = document.getElementById("fontSize").value;
    let lineSpacing = document.getElementById("lineSpacing").value;

    let sizePage = "A4";

    if (ukuranKertas === "F4") sizePage = "210mm 330mm";
    if (ukuranKertas === "Letter") sizePage = "Letter";

    let oldStyle = document.getElementById("dynamicPrintStyle");
    if (oldStyle) oldStyle.remove();

    let style = document.createElement("style");
    style.id = "dynamicPrintStyle";

    style.innerHTML = `
        @media print {

            @page {
                size: ${sizePage};
                margin: ${marginAtas}mm ${marginKanan}mm ${marginBawah}mm ${marginKiri}mm;
            }

            body{
                margin:0 !important;
                padding:0 !important;
            }

            .halaman{
                margin:0 !important;
                
                box-shadow:none !important;
                box-sizing:border-box;

                font-family:${font} !important;
                font-size:${fontSize}pt !important;
                line-height:${lineSpacing} !important;
            }

        }
    `;

    document.head.appendChild(style);
}

function applyPrintSettingPersetujuan() {

    let ukuranKertas = document.getElementById("ukuranKertas").value;
    let marginAtas = document.getElementById("marginAtas").value;
    let marginBawah = document.getElementById("marginBawah").value;
    let marginKiri = document.getElementById("marginKiri").value;
    let marginKanan = document.getElementById("marginKanan").value;

    let font = document.getElementById("font").value;
    // choose effective size (persetujuan may be bumped)
    let fontSize = document.getElementById("fontSize").value;
    let lineSpacing = document.getElementById("lineSpacing").value;

    let sizePage = "A4";

    if (ukuranKertas === "F4") sizePage = "210mm 330mm";
    if (ukuranKertas === "Letter") sizePage = "Letter";

    // Hapus style lama
    let oldStyle = document.getElementById("dynamicPrintStyle");
    if (oldStyle) oldStyle.remove();

    let style = document.createElement("style");
    style.id = "dynamicPrintStyle";

    style.innerHTML = `
        @media print {

            @page {
                size: ${sizePage};
                margin: ${marginAtas}mm ${marginKanan}mm ${marginBawah}mm ${marginKiri}mm;
            }

            body {
                margin:0;
                padding:0;
            }

            .halaman {
                width: 100% !important;
                max-width: none !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
                box-sizing: border-box;
                /* enforce font settings in print as well */
                font-family: ${font} !important;
                font-size: ${fontSize}pt !important;
                line-height: ${lineSpacing} !important;
            }

        }
    `;

    document.head.appendChild(style);
}

window.addEventListener("afterprint", function () {

    let style = document.getElementById("dynamicPrintStyle");
    if (style) style.remove();

    let jenis = document.getElementById("jenisDokumen")?.value;

    if (document.getElementById("hasilDokumen").innerHTML.trim() !== "") {

        if (jenis === "persetujuanDPA") {
            buatPersetujuan();
        } else if (jenis === "pergeseran") {
            buatDokumen();
        }

    }

});
