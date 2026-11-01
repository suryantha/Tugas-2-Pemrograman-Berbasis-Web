
const { createApp } = Vue;

createApp({
    data() {
        return {
            upbjjList: data.upbjjList,
            kategoriList: data.kategoriList,
            stok: [...data.stok],

            filterUpbjj: "",
            filterKategori: "",
            filterStok: "",
            sortBy: "judul",

            tampilForm: false,
            sedangEdit: false,
            pesanError: "",

            form: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ""
            }
        };
    },

    computed: {
        kategoriTersedia() {
            if (!this.filterUpbjj) {
                return this.kategoriList;
            }

            return [
                ...new Set(
                    this.stok
                        .filter(item => item.upbjj === this.filterUpbjj)
                        .map(item => item.kategori)
                )
            ];
        },

        stokTampil() {
            let hasil = this.stok.filter(item => {
                const cocokUpbjj =
                    !this.filterUpbjj ||
                    item.upbjj === this.filterUpbjj;

                const cocokKategori =
                    !this.filterKategori ||
                    item.kategori === this.filterKategori;

                let cocokStok = true;

                if (this.filterStok === "aman") {
                    cocokStok = item.qty >= item.safety;
                } else if (this.filterStok === "menipis") {
                    cocokStok =
                        item.qty > 0 && item.qty < item.safety;
                } else if (this.filterStok === "kosong") {
                    cocokStok = item.qty === 0;
                }

                return cocokUpbjj &&
                    cocokKategori &&
                    cocokStok;
            });
                if (this.sortBy === "judul") {
                hasil.sort((a, b) =>
                    a.judul.localeCompare(b.judul));
                }
                else if (this.sortBy === "qty") {
                    hasil.sort((b, a) => b.qty - a.qty);
                }

                else if (this.sortBy === "harga") {
                    hasil.sort((a, b) => a.harga - b.harga);
                }
                return hasil;
            }
    },

        watch: {
            filterUpbjj() {
                this.filterKategori = "";
            },

            "form.upbjj"() {
                if (!this.sedangEdit) {
                    this.form.kategori = "";
                }
            }
        },

        methods: {
            formKosong() {
                return {
                    kode: "",
                    judul: "",
                    kategori: "",
                    upbjj: "",
                    lokasiRak: "",
                    harga: 0,
                    qty: 0,
                    safety: 0,
                    catatanHTML: ""
                };
            },

            formatRupiah(nilai) {
                return new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumFractionDigits: 0
                }).format(nilai);
            },

            resetFilter() {
                this.filterUpbjj = "";
                this.filterKategori = "";
                this.filterStok = "";
                this.sortBy = "judul";
            },

            tambahBaru() {
                this.form = this.formKosong();
                this.sedangEdit = false;
                this.pesanError = "";
                this.tampilForm = true;
            },

            editStok(item) {
                this.sedangEdit = true;
                this.form = { ...item };
                this.pesanError = "";
                this.tampilForm = true;
            },

            batalForm() {
                this.tampilForm = false;
                this.pesanError = "";
            },

            simpanStok() {
                if (
                    !this.form.kode ||
                    !this.form.judul ||
                    !this.form.kategori ||
                    !this.form.upbjj ||
                    !this.form.lokasiRak
                ) {
                    this.pesanError = "Semua data wajib diisi.";
                    return;
                }

                if (
                    !Number.isFinite(this.form.qty) ||
                    !Number.isFinite(this.form.safety) ||
                    !Number.isFinite(this.form.harga) ||
                    this.form.qty < 0 ||
                    this.form.safety < 0 ||
                    this.form.harga < 0
                ) {
                    this.pesanError = "Nilai stok, safety, dan harga tidak valid.";
                    return;
                }

                if (this.sedangEdit) {
                    const indeks = this.stok.findIndex(
                        item => item.kode === this.form.kode
                    );

                    if (indeks !== -1) {
                        this.stok[indeks] = { ...this.form };
                    }
                } else {
                    const kodeAda = this.stok.some(
                        item => item.kode.toLowerCase() ===
                            this.form.kode.toLowerCase()
                    );

                    if (kodeAda) {
                        this.pesanError = "Kode bahan ajar sudah digunakan.";
                        return;
                    }

                    this.stok.push({ ...this.form });
                }

                this.tampilForm = false;
                this.pesanError = "";

                alert("Data berhasil disimpan.");
            }
        }
    }).mount("#app");
