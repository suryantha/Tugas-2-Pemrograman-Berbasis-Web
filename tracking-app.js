const { createApp } = Vue;
function tanggalLokal() {
    const sekarang = new Date();

    const tahun = sekarang.getFullYear();
    const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
    const hari = String(sekarang.getDate()).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;
}

createApp({
    data() {
        return {
            pengirimanList: data.pengirimanList,
            paketList: data.paket,
            stok: data.stok,

            daftarDO: { ...data.tracking },

            form: {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: tanggalLokal()
            },

            pesanError: "",
            doTerpilih: null
        };
    },

    computed: {
        nomorDO() {
            const tahun = new Date().getFullYear();
            let nomorTerakhir = 0;

            Object.keys(this.daftarDO).forEach(nomor => {
                const bagian = nomor.match(/^DO(\d{4})-(\d+)$/);

                if (bagian && Number(bagian[1]) === tahun) {
                    const urutan = Number(bagian[2]);

                    if (urutan > nomorTerakhir) {
                        nomorTerakhir = urutan;
                    }
                }
            });

            return "DO" + tahun + "-" +
                String(nomorTerakhir + 1).padStart(3, "0");
        },

        paketDipilih() {
            return this.paketList.find(
                item => item.kode === this.form.paket
            );
        },

        totalHarga() {
            return this.paketDipilih
                ? this.paketDipilih.harga
                : 0;
        }
    },

    watch: {
        "form.paket"() {
            this.pesanError = "";
        },

        "form.nim"() {
            this.pesanError = "";
        }
    },

    methods: {
        formatRupiah(nilai) {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }).format(nilai);
        },

        cariJudul(kode) {
            const bahan = this.stok.find(
                item => item.kode === kode
            );

            return bahan ? bahan.judul : "Data tidak ditemukan";
        },

        namaEkspedisi(kode) {
            const ekspedisi = this.pengirimanList.find(
                item => item.kode === kode
            );

            return ekspedisi ? ekspedisi.nama : kode;
        },

        simpanDO() {
            if (
                !this.form.nim ||
                !this.form.nama ||
                !this.form.ekspedisi ||
                !this.form.paket ||
                !this.form.tanggalKirim
            ) {
                this.pesanError = "Semua data wajib diisi.";
                return;
            }

            const nomorBaru = this.nomorDO;

            this.daftarDO[nomorBaru] = {
                nim: this.form.nim,
                nama: this.form.nama,
                status: "Diproses",
                ekspedisi: this.form.ekspedisi,
                tanggalKirim: this.form.tanggalKirim,
                paket: this.form.paket,
                total: this.totalHarga,
                perjalanan: []
            };

            alert(
                "Delivery Order berhasil disimpan dengan nomor " +
                nomorBaru
            );

            this.resetForm();
        },

        resetForm() {
            this.form = {
                nim: "",
                nama: "",
                ekspedisi: "",
                paket: "",
                tanggalKirim: tanggalLokal()
            };

            this.pesanError = "";
        },

        lihatTracking(nomor) {
            const data = this.daftarDO[nomor];

            this.doTerpilih = {
                nomor: nomor,
                ...data
            };
        }
    }
}).mount("#app");
