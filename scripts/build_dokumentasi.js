const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = require("C:/Users/prana/.claude/skills/docx/node_modules/docx");

const ROOT = path.resolve(__dirname, "..");
const SHOT = path.join(ROOT, "docs", "screenshots");
const OUT = path.join(ROOT, "docs", "dokumentasi.docx");

const FONT = "Calibri";
const NAVY = "1F4E79";
const MUTED = "5B6770";
const PAGE_W = 9360; // A4 minus ~2cm margins

const thin = { style: BorderStyle.SINGLE, size: 4, color: "C5D4E0" };
const borders = { top: thin, bottom: thin, left: thin, right: thin };

function t(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    size: opts.size ?? 21,
    bold: opts.bold,
    italics: opts.italics,
    color: opts.color ?? "222222",
  });
}

function p(children, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: 276 },
    alignment: opts.align,
    numbering: opts.numbering,
    children: Array.isArray(children) ? children : [t(children, opts)],
  });
}

function h(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 4 } },
    children: [t(text, { bold: true, size: 26, color: NAVY })],
  });
}

function caption(text) {
  return p([t(text, { italics: true, size: 17, color: MUTED })], {
    align: AlignmentType.CENTER,
    after: 160,
  });
}

function figure(file, width, height, cap) {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 40 },
      children: [
        new ImageRun({
          type: "jpg",
          data: fs.readFileSync(path.join(SHOT, file)),
          transformation: { width, height },
        }),
      ],
    }),
    caption(cap),
  ];
}

function cell(text, width, opts = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    margins: { top: 35, bottom: 35, left: 70, right: 70 },
    borders,
    children: [
      new Paragraph({
        children: [
          t(text, {
            bold: opts.bold,
            size: opts.size ?? 18,
            color: opts.color ?? (opts.header ? "FFFFFF" : "222222"),
          }),
        ],
      }),
    ],
  });
}

function makeTable(headers, rows, widths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) =>
      cell(h, widths[i], { header: true, fill: NAVY, bold: true })
    ),
  });
  const body = rows.map((row, ri) =>
    new TableRow({
      children: row.map((val, i) =>
        cell(String(val), widths[i], { fill: ri % 2 === 0 ? "F3F7FB" : "FFFFFF" })
      ),
    })
  );
  return new Table({
    width: { size: PAGE_W, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...body],
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "kendala",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 420, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "insight",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 420, hanging: 240 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: FONT, size: 21 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickStyle: true,
        paragraph: { outlineLevel: 0 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 850, bottom: 850, left: 1134, right: 1134 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 6 } },
              spacing: { after: 80 },
              children: [
                t("Data Warehouse dan Business Intelligence", { size: 16, color: NAVY, bold: true }),
                t("  |  ", { size: 16, color: MUTED }),
                t("Tugas Lanjutan dbt + Dashboard BI", { size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: "C5D4E0", space: 6 } },
              children: [
                t("Muhammad Aziiz Pranaja  ·  25/572885/PPA/07200  ·  hal. ", {
                  size: 16,
                  color: MUTED,
                }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60, before: 40 },
          children: [t("Dokumentasi", { bold: true, size: 36, color: NAVY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [
            t("Transformasi Data dengan dbt dan Dashboard BI", {
              bold: true,
              size: 28,
              color: NAVY,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [
            t("Lanjutan Tugas Airflow — ETL Pipeline Sederhana (Penjualan FMCG)", {
              italics: true,
              size: 20,
              color: MUTED,
            }),
          ],
        }),
        p([
          t("Mahasiswa: ", { bold: true, size: 20 }),
          t("Muhammad Aziiz Pranaja", { size: 20 }),
          t("    NIM: ", { bold: true, size: 20 }),
          t("25/572885/PPA/07200", { size: 20 }),
        ]),
        p([
          t("Mata kuliah: ", { bold: true, size: 20 }),
          t("Data Warehouse dan Business Intelligence", { size: 20 }),
          t("    Pengampu: ", { bold: true, size: 20 }),
          t("Rifki Afina Putri, S.T., M.S., Ph.D.", { size: 20 }),
        ], { after: 80 }),

        h("A. Deskripsi Proyek"),
        p("Proyek ini memakai Opsi A pada tugas lanjutan: data yang sudah mengalir melalui pipeline Apache Airflow (extract → validate → transform → load) dijadikan sumber lapisan transformasi dbt, kemudian disajikan di dashboard Power BI. Dataset tidak diganti. Snapshot hasil extract Airflow (data/staging/extracted.csv pada tugas sebelumnya) dimuat ke DuckDB sebagai raw.transactions."),
        p("Dataset berupa 1.800 baris transaksi ritel FMCG dengan kolom order_id, order_date, product, category, quantity, sales, dan region. Syarat minimal 200 records dan dimensi waktu terpenuhi. Rentang tanggal 18 Februari 2024 sampai 17 Februari 2026. DAG tugas sebelumnya: etl_sederhana_25_572885_PPA_07200."),
        p([
          t("Pertanyaan bisnis yang dipertahankan: ", { italics: true }),
          t("berapa total penjualan, kuantitas, dan jumlah order per hari?"),
          t(" Dashboard menambah slice kategori dan wilayah tanpa mengganti tujuan itu. Stack: dbt-duckdb 1.9, DuckDB, dan Power BI Desktop. Grain sumber dbt adalah transaksi (extracted.csv), bukan agregasi sales_daily.csv, agar staging memiliki pekerjaan pembersihan yang terukur."),
        ]),

        h("B. Arsitektur & Model dbt"),
        p("Alur data: CSV extract Airflow → warehouse.duckdb schema raw → model staging stg_transactions (view) → model mart mart_daily_sales (incremental) → dashboard Power BI. Source dideklarasikan di sources.yml. Mart memakai ref('stg_transactions'), bukan membaca raw langsung."),
        p("Staging dimaterialisasi sebagai view karena isinya pembersihan baris-per-baris (cast tanggal, numeric, normalisasi region USA→United States, buang baris tanpa tanggal/sales atau bernilai negatif). View selalu membaca raw terkini tanpa menyalin tabel. Mart dimaterialisasi incremental (bonus +3%) dengan unique key (order_date, category, region) dan strategi delete+insert. Run penuh membangun histori; run berikutnya hanya memproses tanggal ≥ tanggal terakhir di mart. Grain mart adalah tanggal + kategori + wilayah agar slicer dashboard tidak kehilangan dimensi."),
        ...figure(
          "06_lineage.jpeg",
          500,
          255,
          "Gambar 1. Lineage dbt docs: raw.transactions → stg_transactions → mart_daily_sales (plus tes assert_no_negative_sales)."
        ),
        ...figure(
          "10_incremental.jpeg",
          500,
          185,
          "Gambar 2. dbt run --select mart_daily_sales menampilkan sql incremental model (bukti bonus +3%)."
        ),

        h("C. Tests & Data Quality"),
        p("Generic tests di schema.yml: unique dan not_null pada stg_transactions.order_id; not_null pada order_date dan sales di staging serta pada order_date, category, region, dan total_sales di mart. Custom singular test tests/assert_no_negative_sales.sql gagal jika staging masih menyimpan sales < 0 — masalah yang teridentifikasi di raw (62 baris) dan harus sudah dibuang di staging. dbt test menghasilkan 9 PASS."),
        p("Dua masalah kualitas utama yang dianalisis secara kuantitatif: (1) nilai hilang pada order_date, quantity, dan sales; (2) nilai negatif pada quantity dan sales, plus ejaan region yang tidak seragam (USA vs United States). Dampaknya diukur dari jumlah baris raw versus staging."),
        makeTable(
          ["Masalah di raw", "Jumlah", "Perlakuan di staging"],
          [
            ["order_date null", "83", "Baris dibuang"],
            ["quantity null", "180", "Diisi 0"],
            ["sales null", "353", "Baris dibuang"],
            ["quantity negatif", "70", "Baris dibuang"],
            ["sales negatif", "62", "Dibuang + custom test"],
            ["Duplikat order_id / baris", "0", "Tetap ditest unique"],
          ],
          [3600, 1760, 4000]
        ),
        p("Satu baris dapat memuat lebih dari satu masalah, sehingga jumlah temuan tidak dijumlahkan mentah. Hasil bersih: raw 1.800 baris → staging 1.328 baris. Ada 472 baris (26,2%) yang tidak lolos aturan kualitas sebelum agregasi mart. Setelah staging, tes penjualan negatif lolos (0 baris)."),
        ...figure(
          "04_dbt_test.jpeg",
          500,
          270,
          "Gambar 3. dbt test sukses: 9 tes PASS, termasuk assert_no_negative_sales."
        ),

        h("D. Dashboard"),
        p("Dashboard dibangun di Power BI Desktop dari hasil mart_daily_sales (diekspor ke dashboard/mart_daily_sales.csv), bukan dari output agregasi Airflow. File dashboard: dashboard/tugas_dwib.pbix. Ada dua halaman (bonus +4%) dengan peran berbeda agar chart tidak diulang: Overview untuk ranking dan tren, Breakdown Wilayah untuk mix kategori. Interaktivitas: list slicer (single select dimatikan) pada kategori, wilayah, dan tahun, plus hierarki tanggal pada tren (drill-down bulan/hari)."),
        p("Halaman Overview menjawab pertanyaan bisnis harian. KPI Jumlah Order, Total Penjualan, dan Total Kuantitas berada di atas. Line chart menampilkan tren; dua bar horizontal meranking kategori dan wilayah. Total penjualan mart tanpa filter: 3.648.994,68 dengan 3.269 kuantitas dan 1.320 order. Pada screenshot final, slicer Year = 2025 sehingga KPI Overview menjadi 1,84 juta / 650 order / 2 ribu kuantitas — bukti filter bekerja."),
        ...figure(
          "08_dashboard_overview.jpeg",
          500,
          285,
          "Gambar 4. Halaman Overview (filter 2025): KPI, tren penjualan, ranking kategori, dan ranking wilayah."
        ),
        p("Jenis visual dipilih dari pertanyaan, bukan sebaliknya. Line chart untuk dimensi waktu. Bar horizontal untuk ranking (panjang batang = makna; satu warna agar bukan hiasan). Halaman 2 tidak mengulang ketiga chart itu. Sebagai gantinya: stacked 100% menunjukkan porsi kategori di tiap negara, clustered column menunjukkan nilai absolut kategori × wilayah, dan tabel memberi angka pasti yang sudah diurutkan dari penjualan terbesar (Nigeria 1.310.697,94 hingga Turkey 353.499,35). Slicer halaman 2 hanya kategori dan tahun; region tidak difilter di sini karena wilayah adalah subjek halaman."),
        ...figure(
          "09_dashboard_wilayah.jpeg",
          500,
          285,
          "Gambar 5. Halaman Breakdown Wilayah: KPI total 3,65 juta, tabel, komposisi kategori (%), dan nilai kategori per wilayah."
        ),
        p("Insight: Electronics adalah kategori terbesar; Nigeria dan United States menyumbang penjualan tertinggi; Turkey paling kecil. Mix kategori relatif mirip antar negara (Electronics porsi terbesar), tetapi Ghana dan Turkey punya porsi Home/Groceries yang lebih terasa pada stacked 100%. Warna di halaman 2 membedakan kategori (Electronics, Fashion, Groceries, Home), bukan dekorasi."),

        h("E. Kendala & Solusi"),
        p("Aktivasi virtual environment di Windows membuka Activate.ps1 sebagai berkas teks, dan sintaks $env:DBT_PROFILES_DIR gagal di Command Prompt. Solusi: memakai .venv\\Scripts\\activate.bat serta set DBT_PROFILES_DIR=%CD% dari folder dbt_project.", {
          numbering: { reference: "kendala", level: 0 },
        }),
        p("Fungsi SQL initcap tidak tersedia di DuckDB, sehingga dbt run staging gagal. Solusi: title-case dengan concat(upper(left(...)), lower(substr(...))).", {
          numbering: { reference: "kendala", level: 0 },
        }),
        p("Line chart Power BI sempat memakai sumbu Year sehingga penurunan 2026 terlihat seolah penjualan anjlok, padahal data hanya sampai 17 Februari 2026. Solusi: hierarki tanggal dengan tampilan bulan dan drill-down ke hari.", {
          numbering: { reference: "kendala", level: 0 },
        }),
        p("Dua halaman sempat memakai bar ranking wilayah yang identik. Solusi: ranking wilayah hanya di Overview; halaman 2 diganti stacked 100% (mix) dan clustered column (nilai absolut). Slicer list masih memotong Home di kotak filter, tetapi kategori itu tetap tampil di chart dan legend.", {
          numbering: { reference: "kendala", level: 0 },
        }),

        h("F. Kesimpulan"),
        p("Lapisan dbt merapikan transformasi di atas extract Airflow: staging membersihkan 472 baris bermasalah, mart menjawab pertanyaan penjualan harian per kategori dan wilayah, dan tes menjaga aturan kualitas. Dashboard mengubah grafik statis matplotlib pada tugas sebelumnya menjadi tampilan interaktif dua halaman."),
        p("Electronics mendominasi, Nigeria dan United States adalah pasar terbesar, dan kualitas raw tidak bisa diabaikan: lebih dari seperempat baris tidak layak agregasi. Pengembangan lanjutan: orkestrasi dbt run dari DAG Airflow, koneksi Power BI langsung ke DuckDB, serta memperkaya incremental agar late-arriving facts pada tanggal lama ikut terbarui.", { after: 80 }),
        p([
          t("Repository pengumpulan mengikuti struktur tugas: dbt_project/, dashboard/tugas_dwib.pbix, docs/, dan README.md. ", { size: 20 }),
          t("dbt run, dbt test, dan dbt docs generate dapat dijalankan ulang tanpa error.", { size: 20 }),
        ]),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, buffer);
  console.log("Wrote", OUT, "bytes=", buffer.length);
});
