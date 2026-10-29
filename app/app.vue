<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Project = {
  number: string
  title: string
  category: string
  description: string
  technologies: string[]
  goal: string
  features: string[]
  visual: string
  visualLabel: string
}

// Isi alamat Gmail Anda sebelum formulir kontak digunakan.
const contactEmail = ''
// Isi nama pengguna masing-masing akun; nomor WhatsApp hanya memakai angka dan kode negara.
const socialProfiles = {
  instagram: '',
  whatsapp: '',
  tiktok: '',
  github: '',
}
const socialNetworks = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'github', label: 'GitHub' },
]

const navigation = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang Saya', href: '#about' },
  { label: 'Keahlian', href: '#skills' },
  { label: 'Proyek', href: '#projects' },
  { label: 'Pendidikan', href: '#education' },
  { label: 'Kontak', href: '#contact' },
]

const projects: Project[] = [
  {
    number: '01',
    title: 'CRUD Sistem Kasir Toko Bunga',
    category: 'Pengembangan Web',
    description:
      'Aplikasi kasir berbasis web yang membantu pengelolaan barang dan transaksi penjualan pada toko Bunga.',
    technologies: ['Nuxt.js', 'Vue.js', 'Tailwind CSS', 'Laravel'],
    goal: 'Menyusun alur pengelolaan barang dan transaksi yang jelas, dari pembaruan stok hingga pencatatan penjualan.',
    features: [
      'Menambah, melihat, mengubah, dan menghapus data barang.',
      'Mengelola stok, keranjang belanja, dan transaksi penjualan.',
      'Menghitung total pembayaran dan uang kembalian.',
      'Menampilkan struk serta riwayat transaksi.',
    ],
    visual: 'cashier',
    visualLabel: 'Pratinjau ilustratif — sistem kasir',
  },
  {
    number: '02',
    title: 'Macha Muse',
    category: 'Desain UI/UX',
    description:
      'Proyek perancangan antarmuka dan pengalaman pengguna yang berfokus pada tampilan visual, konsistensi desain, dan kemudahan penggunaan.',
    technologies: ['Figma', 'UI/UX', 'Prototyping'],
    goal: 'Membentuk pengalaman digital yang terasa konsisten dan nyaman digunakan melalui proses eksplorasi desain.',
    features: [
      'Eksplorasi tata letak dan hierarki informasi.',
      'Perancangan elemen antarmuka yang konsisten.',
      'Pengembangan wireframe, mockup, dan prototipe jika tersedia.',
    ],
    visual: 'matcha',
    visualLabel: 'Pratinjau ilustratif — Macha Muse',
  },
  {
    number: '03',
    title: 'Website universitas unj',
    category: 'Pengembangan Web',
    description:
      'Website untuk menampilkan informasi universitas unj secara terstruktur, informatif, dan mudah diakses.',
    technologies: ['HTML', 'CSS'],
    goal: 'Menyajikan informasi universitas dengan struktur yang mudah dipindai dan navigasi yang sederhana.',
    features: [
      'Penyusunan daftar dan ringkasan informasi universitas.',
      'Tata letak halaman yang terstruktur.',
    ],
    visual: 'directory',
  },
]

  const skillGroups = [
  {
    number: '01',
    title: 'HTML',
    description:
      'Saya belajar menggunakan HTML untuk menyusun struktur dan isi halaman website.',
    skills: ['HTML', 'Struktur Website'],
    icon: '</>',
  },
  {
    number: '02',
    title: 'CSS',
    description:
      'Saya menggunakan CSS untuk mengatur warna, ukuran, tata letak, dan tampilan website agar lebih menarik.',
    skills: ['CSS', 'Layout', 'Styling'],
    icon: '✳',
  },
  {
    number: '03',
    title: 'Editing Foto & Video',
    description:
      'Saya bisa mengedit foto dan video, mulai dari mengatur tampilan, memotong klip, hingga menambahkan elemen agar hasilnya lebih menarik.',
    skills: ['Edit Foto', 'Edit Video', 'Kreativitas'],
    icon: '▶',
  },
  {
    number: '04',
    title: 'Figma',
    description:
      'Saya menggunakan Figma untuk membuat desain tampilan website, menyusun wireframe, dan membuat mockup.',
    skills: ['Figma', 'Wireframe', 'Mockup', 'UI/UX'],
    icon: '◈',
  },
]

const menuOpen = ref(false)
const activeSection = ref('home')
const selectedProject = ref<Project | null>(null)
const showBackToTop = ref(false)
const profilePhotoUrl = ref('/images/nadirahfoto.jpeg')
const contactForm = ref({ name: '', email: '', subject: '', message: '' })
const contactErrors = ref({ name: '', email: '', subject: '', message: '' })
const contactStatus = ref('')
const gmailDraftUrl = ref('')
let sectionObserver: IntersectionObserver | undefined
let revealObserver: IntersectionObserver | undefined

function closeMenu() {
  menuOpen.value = false
}

function openProject(project: Project) {
  selectedProject.value = project
  document.body.classList.add('modal-open')
}

function closeProject() {
  selectedProject.value = null
  document.body.classList.remove('modal-open')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && selectedProject.value) closeProject()
}

function handleScroll() {
  showBackToTop.value = window.scrollY > 520
}

function socialUrl(network: string) {
  const value = socialProfiles[network as keyof typeof socialProfiles].trim()
  if (!value) return ''
  if (network === 'whatsapp') {
    const number = value.replace(/\D/g, '')
    return number ? `https://wa.me/${number}` : ''
  }
  if (network === 'instagram') return `https://www.instagram.com/${value.replace(/^@/, '')}`
  if (network === 'tiktok') return `https://www.tiktok.com/@user2466759247615?_r=1&_t=ZS-9AvLwBg01S9/@${value.replace(/^@/, '')}`
  return `https://github.com/${value.replace(/^@/, '')}`
}

function clearContactError(field: keyof typeof contactErrors.value) {
  contactErrors.value[field] = ''
  contactStatus.value = ''
  gmailDraftUrl.value = ''
}

function submitContactForm() {
  contactStatus.value = ''
  gmailDraftUrl.value = ''
  contactErrors.value = {
    name: contactForm.value.name.trim() ? '' : 'Nama lengkap wajib diisi.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email.trim())
      ? ''
      : 'Masukkan alamat email yang valid.',
    subject: contactForm.value.subject.trim() ? '' : 'Subjek wajib diisi.',
    message: contactForm.value.message.trim() ? '' : 'Pesan wajib diisi.',
  }

  if (Object.values(contactErrors.value).some(Boolean)) {
    contactStatus.value = 'Periksa kembali kolom yang ditandai.'
    return
  }
  if (!contactEmail.trim()) {
    contactStatus.value = 'Alamat Gmail tujuan belum diatur. Tambahkan alamat Anda pada konfigurasi contactEmail di app.vue.'
    return
  }

  const body = `Nama: ${contactForm.value.name.trim()}\nEmail: ${contactForm.value.email.trim()}\n\n${contactForm.value.message.trim()}`
  const parameters = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: contactEmail.trim(),
    su: contactForm.value.subject.trim(),
    body,
  })
  gmailDraftUrl.value = `https://mail.google.com/mail/?${parameters.toString()}`
  const gmailWindow = window.open(gmailDraftUrl.value, '_blank')
  if (gmailWindow) {
    gmailWindow.opener = null
    contactStatus.value = 'Draf pesan dibuka di Gmail. Periksa kembali isinya, lalu tekan tombol Kirim di Gmail untuk mengirim pesan.'
  } else {
    contactStatus.value = 'Tab Gmail diblokir oleh peramban. Gunakan tautan Buka draf Gmail di bawah ini. Pesan belum terkirim.'
  }
}

onMounted(() => {
  const sections = navigation
    .map(({ href }) => document.querySelector<HTMLElement>(href))
    .filter((section): section is HTMLElement => section !== null)

  sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]
      if (visible) activeSection.value = visible.target.id
    },
    { rootMargin: '-24% 0px -60% 0px', threshold: [0, 0.15, 0.4] },
  )
  sections.forEach((section) => sectionObserver?.observe(section))

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12 },
  )
  document.querySelectorAll('.reveal').forEach((element) => revealObserver?.observe(element))

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  handleScroll()
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  revealObserver?.disconnect()
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('modal-open')
})
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="wordmark" href="#home" aria-label="Nadirah Putri, kembali ke Beranda" @click="closeMenu">
        <span class="wordmark-mark">N<span>.</span></span>
        <span class="wordmark-name">NADIRA PUTRI</span>
      </a>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Buka atau tutup navigasi"
        @click="menuOpen = !menuOpen"
      >
        <span></span><span></span>
      </button>

      <nav class="main-nav" :class="{ 'is-open': menuOpen }" aria-label="Navigasi utama">
        <a
          v-for="item in navigation"
          :key="item.href"
          :href="item.href"
          :class="{ 'is-active': activeSection === item.href.slice(1) }"
          @click="closeMenu"
        >{{ item.label }}</a>
        <a class="nav-contact" href="#contact" @click="closeMenu">Hubungi Saya <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main>
      <section id="home" class="hero section-wrap">
        <div class="hero-copy">
          <div class="availability"><span></span> PORTOFOLIO PRIBADI</div>
          <p class="eyebrow">REKAYASA PERANGKAT LUNAK · JAKARTA</p>
          <h1>Hai, saya Nadira<span class="hero-period">.</span><br /><span class="hero-title-accent">Terus belajar,</span><br />terus berkarya.</h1>
          <p class="hero-subtitle">Siswa Rekayasa Perangkat Lunak | Calon Pengembang Web</p>
          <p class="hero-description">
            Saya adalah siswa jurusan Rekayasa Perangkat Lunak yang tertarik pada pengembangan website,
            desain antarmuka, dan pembuatan aplikasi. Saya senang mempelajari teknologi baru,
            mengembangkan ide menjadi karya digital, serta membangun aplikasi yang bermanfaat dan mudah digunakan.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="#projects">Lihat Proyek Saya <span aria-hidden="true">↘</span></a>
            <a class="button button-secondary" href="#contact">Hubungi Saya <span aria-hidden="true">↗</span></a>
          </div>
          <div class="hero-meta">
            <span class="meta-icon" aria-hidden="true">✳</span>
            <span>Belajar, membangun, dan terus berkembang.</span>
          </div>
        </div>

        <div class="hero-visual profile-visual">
          <div class="hero-halo halo-one"></div>
          <div class="hero-halo halo-two"></div>
          <div class="profile-frame">
            <img v-if="profilePhotoUrl" :src="profilePhotoUrl" alt="Foto profil Nadira Putri" @error="profilePhotoUrl = ''" />
            <div v-else class="profile-placeholder"><span class="profile-placeholder-icon" aria-hidden="true">＋</span><strong>Masukkan Foto Anda di Sini</strong><span>Ganti dengan foto pribadi</span><code>public/images/foto-profil.jpg</code></div>
          </div>
          <div class="hero-badge"><span>NP</span><small>RPL<br />JAKARTA</small></div>
          <span class="hero-float float-code" aria-hidden="true">&lt;/&gt;</span>
          <span class="hero-float float-spark" aria-hidden="true">✳</span>
          <div class="hero-caption"><span>FOTO PROFIL</span><span>JAKARTA, INDONESIA</span></div>
        </div>
        <a class="scroll-cue" href="#about"><span></span> GULIR UNTUK MENJELAJAH</a>
      </section>

      <section class="home-social section-wrap" aria-labelledby="home-social-title">
        <h2 id="home-social-title">Temukan Saya di Media Sosial</h2>
        <div class="social-links">
        <a v-for="network in socialNetworks" v-show="socialUrl(network.key)" :key="network.key" :href="socialUrl(network.key)" :aria-label="`Kunjungi ${network.label} Nadira Putri`" target="_blank" rel="noopener noreferrer">
          <svg v-if="network.key === 'instagram'" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle class="social-icon-fill" cx="18" cy="6" r="1" /></svg>
          <svg v-else-if="network.key === 'whatsapp'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9a8.4 8.4 0 1 1 16.1-3.9Z" /><path d="M8.3 7.8c.3-.6.6-.6.9-.6h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4-.1.6l-.6.8c-.2.2-.2.4 0 .6.6 1 1.4 1.8 2.5 2.4.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .3-.2 1.2-.8 1.7-.5.4-1.2.7-2 .5-1.1-.2-2.6-.9-4.1-2.2-1.2-1.1-2.1-2.5-2.4-3.6-.3-.9.1-1.8.6-2.7Z" /></svg>
          <svg v-else-if="network.key === 'tiktok'" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a4.1 4.1 0 1 1-3.5-4.1" /><path d="M14 3c.4 2.7 2 4.5 5 4.8" /></svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 19.5c-4.3 1.3-4.3-2.1-6-2.7m12 5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.6-1.3 5.6-6.1a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C5.9 3.3 4.9 3.6 4.9 3.6a4.3 4.3 0 0 0-.1 3.3 4.7 4.7 0 0 0-1.3 3.3c0 4.8 2.9 5.8 5.6 6.1a2.9 2.9 0 0 0-.8 2.2v3.3" /></svg>
          <span>{{ network.label }}</span>
        </a>
        </div>
        <p v-if="!socialNetworks.some((network) => socialUrl(network.key))">Tambahkan nama akun pada konfigurasi <code>socialProfiles</code> di <code>app.vue</code> untuk menampilkan tautan profil.</p>
      </section>

      <section id="about" class="about section-wrap">
        <div class="section-kicker"><span>01</span><span class="kicker-line"></span><span>TENTANG SAYA</span></div>
        <div class="about-grid">
        <div>
          <p class="eyebrow">CERITA SINGKAT TENTANG SAYA</p>
          <h2>Mengenal Saya<br /><span>Lebih Dekat.</span></h2>
          </div>
          <div class="about-copy">
            <p>
              Saya merupakan siswa jurusan Rekayasa Perangkat Lunak yang memiliki ketertarikan pada
              pengembangan website, desain antarmuka, dan pembuatan aplikasi. Melalui tugas sekolah
              dan berbagai proyek, saya terus mengasah kemampuan pemrograman, kreativitas, serta
              pemecahan masalah.
            </p>
          </div>
        </div>
        <div class="about-facts">
          <article class="fact-card reveal">
            <span class="fact-icon" aria-hidden="true">⌘</span>
            <span class="fact-label">NAMA</span>
            <h3>Nadirah Aprilia Putri</h3>
            <p>Siswa Rekayasa Perangkat Lunak</p>
          </article>
          <article class="fact-card reveal">
            <span class="fact-icon" aria-hidden="true">⌂</span>
            <span class="fact-label">SEKOLAH</span>
            <h3>SMKN 71 Jakarta</h3>
            <p>Rekayasa Perangkat Lunak (RPL)</p>
          </article>
          <article class="fact-card reveal">
            <span class="fact-icon" aria-hidden="true">✳</span>
            <span class="fact-label">MINAT</span>
            <h3>Web dan aplikasi</h3>
            <p>Pengembangan web, desain UI/UX, dan aplikasi.</p>
          </article>
          <article class="fact-card fact-card-goal reveal">
            <span class="fact-icon" aria-hidden="true">↗</span>
            <span class="fact-label">TUJUAN</span>
            <h3>Terus berkembang</h3>
            <p>Menjadi pengembang perangkat lunak yang profesional.</p>
          </article>
        </div>
      </section>

      <section id="skills" class="skills-section">
        <div class="section-wrap">
          <div class="section-kicker"><span>02</span><span class="kicker-line"></span><span>KEAHLIAN</span></div>
          <div class="section-heading">
            <div>
              <p class="eyebrow">HAL YANG SAYA PELAJARI</p>
              <h2>Keahlian yang<br /><span>Saya Pelajari.</span></h2>
            </div>
            <p>Berbagai teknologi dan perangkat yang saya pelajari untuk membangun website, mengembangkan aplikasi, dan merancang pengalaman pengguna.</p>
          </div>
          <div class="skills-grid">
            <article v-for="group in skillGroups" :key="group.number" class="skill-card reveal">
              <div class="skill-card-top"><span class="skill-icon" aria-hidden="true">{{ group.icon }}</span><span>{{ group.number }}</span></div>
              <h3>{{ group.title }}</h3>
              <p>{{ group.description }}</p>
              <div class="skill-tags"><span v-for="skill in group.skills" :key="skill">{{ skill }}</span></div>
            </article>
          </div>
        </div>
      </section>

      <section id="projects" class="work-section section-wrap">
        <div class="section-kicker"><span>03</span><span class="kicker-line"></span><span>PROYEK</span></div>
        <div class="section-heading">
          <div>
            <p class="eyebrow">BELAJAR MELALUI KARYA</p>
            <h2>Proyek yang Pernah<br /><span>Saya Kerjakan.</span></h2>
          </div>
          <p>Beberapa proyek dari perjalanan belajar saya dalam pengembangan web dan desain UI/UX.</p>
        </div>

        <div class="project-grid">
          <article
            v-for="project in projects"
            :key="project.number"
            class="project-card reveal"
            :class="{ 'project-featured': project.number === '01' }"
          >
            <button class="project-art" :class="`art-${project.visual}`" type="button" :aria-label="`Lihat detail ${project.title}`" @click="openProject(project)">
              <span class="project-number">PROYEK {{ project.number }} <span>·</span> {{ project.category }}</span>
              <div v-if="project.visual === 'cashier'" class="mini-dashboard" aria-hidden="true">
                <div class="mini-sidebar"><b>k.</b><span class="side-active"></span><i></i><i></i><i></i></div>
                <div class="mini-content">
                  <div class="mini-topbar"><span>Toko Bunga</span><b>● ●</b></div>
                  <div class="mini-welcome">Ringkasan <span>Hari ini</span></div>
                  <div class="mini-stats"><i><b>—</b><small>Produk</small></i><i><b>—</b><small>Transaksi</small></i><i><b>Rp —</b><small>Penjualan</small></i></div>
                  <div class="mini-table"><span>Barang terbaru</span><i><b></b><b></b><b></b></i><i><b></b><b></b><b></b></i><i><b></b><b></b><b></b></i></div>
                </div>
              </div>
              <div v-else-if="project.visual === 'matcha'" class="matcha-art" aria-hidden="true">
                <div class="matcha-orb"></div><span class="matcha-small">LUANGKAN WAKTU UNTUK DIRI SENDIRI</span><strong>macha<br /><i>muse</i></strong><span class="matcha-bottom">RITUAL KECIL UNTUK HARI INI.</span>
              </div>
              <div v-else-if="project.visual === 'directory'" class="directory-art" aria-hidden="true">
                <div class="directory-nav"><b>Co.</b><span>Jelajahi&nbsp;&nbsp; Tentang&nbsp;&nbsp; Direktori</span><i>Lihat →</i></div>
                <div class="directory-copy"><small>TEMUKAN PERUSAHAAN PILIHAN</small><strong>Kenali lebih<br />banyak usaha.</strong><span>Jelajahi direktori perusahaan pilihan.</span></div>
                <div class="directory-cards"><i><b>◈</b><span></span><span></span></i><i><b>⌘</b><span></span><span></span></i><i><b>✳</b><span></span><span></span></i></div>
              </div>
              <div v-else class="parking-art" aria-hidden="true">
                <span class="diagram-chip chip-one">PENGGUNA</span><span class="diagram-chip chip-two">SISTEM PARKIR</span><span class="diagram-chip chip-three">DATA KENDARAAN</span>
                <span class="diagram-line line-one"></span><span class="diagram-line line-two"></span><span class="diagram-line line-three"></span>
                <span class="diagram-note">DFD · LEVEL 0</span>
              </div>
              <span class="art-caption">{{ project.visualLabel }}</span>
              <span class="project-arrow" aria-hidden="true">↗</span>
            </button>
            <div class="project-info">
              <div class="project-title-row"><div><span class="project-category">{{ project.category }}</span><h3>{{ project.title }}</h3></div><span class="project-index">{{ project.number }}</span></div>
              <p>{{ project.description }}</p>
              <div class="project-bottom">
                <div class="project-tags"><span v-for="technology in project.technologies" :key="technology">{{ technology }}</span></div>
                <button class="details-link" type="button" @click="openProject(project)">Lihat Detail <span aria-hidden="true">↗</span></button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section id="education" class="education-section">
        <div class="section-wrap education-wrap">
          <div class="section-kicker"><span>04</span><span class="kicker-line"></span><span>PENDIDIKAN</span></div>
          <div class="education-content">
            <div>
              <p class="eyebrow">PERJALANAN BELAJAR</p>
              <h2>Pendidikan<br /><span>Saya.</span></h2>
            </div>
            <article class="education-card reveal">
              <span class="education-marker" aria-hidden="true"></span>
              <span class="education-label">PENDIDIKAN</span>
              <h3>SMKN 71 Jakarta</h3>
              <p class="education-major">Rekayasa Perangkat Lunak (RPL)</p>
              <p>Saya terus mengembangkan kemampuan pemrograman, pemecahan masalah, dan pengembangan perangkat lunak melalui pembelajaran di sekolah serta pengerjaan berbagai proyek praktik.</p>
              <span class="education-note">Terus belajar · Praktik melalui proyek</span>
              <p class="education-placeholder">Ruang untuk menambahkan sertifikat atau pencapaian saat tersedia.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" class="contact-section section-wrap">
        <div class="section-kicker"><span>05</span><span class="kicker-line"></span><span>KONTAK</span></div>
        <div class="contact-layout">
          <div class="contact-content">
            <div>
              <p class="eyebrow">SAYA SENANG BERKENALAN DAN BERKOLABORASI</p>
              <h2>Mari <span>Terhubung!</span></h2>
            </div>
            <div class="contact-cta">
              <p>Saya terbuka untuk bertukar ide, berbagi pengalaman, dan berdiskusi mengenai teknologi serta proyek yang menarik. Silakan kirim pesan melalui formulir di samping.</p>
              <div class="contact-details">
                <span class="contact-option-icon" aria-hidden="true">@</span>
                <span><small>ALAMAT TUJUAN</small><strong>{{ contactEmail || 'Atur Gmail tujuan pada konfigurasi' }}</strong></span>
              </div>
            </div>
          </div>
          <form class="contact-form" novalidate @submit.prevent="submitContactForm">
            <div class="contact-form-grid">
              <div class="form-field">
                <label for="contact-name">Nama lengkap</label>
                <input id="contact-name" v-model="contactForm.name" name="name" type="text" autocomplete="name" placeholder="Nama Anda" required :aria-invalid="!!contactErrors.name" :aria-describedby="contactErrors.name ? 'contact-name-error' : undefined" @input="clearContactError('name')" />
                <span v-if="contactErrors.name" id="contact-name-error" class="field-error">{{ contactErrors.name }}</span>
              </div>
              <div class="form-field">
                <label for="contact-email">Alamat Gmail</label>
                <input id="contact-email" v-model="contactForm.email" name="email" type="email" autocomplete="email" placeholder="nama@gmail.com" required :aria-invalid="!!contactErrors.email" :aria-describedby="contactErrors.email ? 'contact-email-error' : undefined" @input="clearContactError('email')" />
                <span v-if="contactErrors.email" id="contact-email-error" class="field-error">{{ contactErrors.email }}</span>
              </div>
              <div class="form-field form-field-full">
                <label for="contact-subject">Subjek</label>
                <input id="contact-subject" v-model="contactForm.subject" name="subject" type="text" placeholder="Subjek pesan" required :aria-invalid="!!contactErrors.subject" :aria-describedby="contactErrors.subject ? 'contact-subject-error' : undefined" @input="clearContactError('subject')" />
                <span v-if="contactErrors.subject" id="contact-subject-error" class="field-error">{{ contactErrors.subject }}</span>
              </div>
              <div class="form-field form-field-full">
                <label for="contact-message">Pesan</label>
                <textarea id="contact-message" v-model="contactForm.message" name="message" rows="5" placeholder="Tuliskan pesan Anda di sini..." required :aria-invalid="!!contactErrors.message" :aria-describedby="contactErrors.message ? 'contact-message-error' : undefined" @input="clearContactError('message')"></textarea>
                <span v-if="contactErrors.message" id="contact-message-error" class="field-error">{{ contactErrors.message }}</span>
              </div>
            </div>
            <div class="form-submit-row">
              <button class="button button-primary" type="submit">Kirim Pesan <span aria-hidden="true">↗</span></button>
              <p v-if="contactStatus" class="form-status" role="status">{{ contactStatus }} <a v-if="gmailDraftUrl" :href="gmailDraftUrl" target="_blank" rel="noopener noreferrer">Buka draf Gmail</a></p>
            </div>
            <p class="form-disclaimer">Pesan disiapkan sebagai draf di Gmail. Anda masih perlu meninjau dan menekan tombol Kirim di Gmail.</p>
          </form>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner section-wrap">
        <a class="wordmark footer-wordmark" href="#home"><span class="wordmark-mark">N<span>.</span></span><span class="wordmark-name">NADIRA PUTRI</span></a>
        <p>Dirancang dan dikembangkan oleh Nadira Putri. <span>© 2026 Portofolio Saya. Hak cipta dilindungi.</span></p>
        <div class="footer-right">
          <nav class="footer-nav" aria-label="Navigasi footer"><a href="#about">Tentang</a><a href="#projects">Proyek</a><a href="#contact">Kontak</a></nav>
          <div class="social-links footer-social-links">
            <a v-for="network in socialNetworks" v-show="socialUrl(network.key)" :key="network.key" :href="socialUrl(network.key)" :aria-label="`Kunjungi ${network.label} Nadira Putri`" target="_blank" rel="noopener noreferrer">
              <svg v-if="network.key === 'instagram'" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle class="social-icon-fill" cx="18" cy="6" r="1" /></svg>
              <svg v-else-if="network.key === 'whatsapp'" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.4-4.9a8.4 8.4 0 1 1 16.1-3.9Z" /><path d="M8.3 7.8c.3-.6.6-.6.9-.6h.5c.2 0 .4.1.5.4l.8 1.9c.1.2.1.4-.1.6l-.6.8c-.2.2-.2.4 0 .6.6 1 1.4 1.8 2.5 2.4.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.3.4.5 0 .3-.2 1.2-.8 1.7-.5.4-1.2.7-2 .5-1.1-.2-2.6-.9-4.1-2.2-1.2-1.1-2.1-2.5-2.4-3.6-.3-.9.1-1.8.6-2.7Z" /></svg>
              <svg v-else-if="network.key === 'tiktok'" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a4.1 4.1 0 1 1-3.5-4.1" /><path d="M14 3c.4 2.7 2 4.5 5 4.8" /></svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 19.5c-4.3 1.3-4.3-2.1-6-2.7m12 5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.7-.3 5.6-1.3 5.6-6.1a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6.2 0C5.9 3.3 4.9 3.6 4.9 3.6a4.3 4.3 0 0 0-.1 3.3 4.7 4.7 0 0 0-1.3 3.3c0 4.8 2.9 5.8 5.6 6.1a2.9 2.9 0 0 0-.8 2.2v3.3" /></svg>
              <span>{{ network.label }}</span>
            </a>
          </div>
        </div>
        <a class="back-home" href="#home">Kembali ke atas <span aria-hidden="true">↑</span></a>
      </div>
    </footer>

    <Transition name="modal">
      <div v-if="selectedProject" class="modal-backdrop" role="presentation" @click.self="closeProject">
        <section class="project-modal" role="dialog" aria-modal="true" :aria-labelledby="`modal-title-${selectedProject.number}`">
          <button class="modal-close" type="button" aria-label="Tutup detail proyek" @click="closeProject">×</button>
          <span class="modal-kicker">PROYEK {{ selectedProject.number }} <span>·</span> {{ selectedProject.category }}</span>
          <h2 :id="`modal-title-${selectedProject.number}`">{{ selectedProject.title }}</h2>
          <p class="modal-description">{{ selectedProject.description }}</p>
          <div class="modal-detail-grid">
            <div><h3>Tujuan proyek</h3><p>{{ selectedProject.goal }}</p></div>
            <div><h3>Fitur dan cakupan</h3><ul><li v-for="feature in selectedProject.features" :key="feature">{{ feature }}</li></ul></div>
          </div>
          <div class="modal-tech"><span>PERANGKAT DAN TEKNOLOGI</span><div class="project-tags"><span v-for="technology in selectedProject.technologies" :key="technology">{{ technology }}</span></div></div>
          <p class="modal-note">Pratinjau ilustratif dibuat khusus untuk portofolio ini. Ganti dengan tangkapan layar proyek asli saat tersedia.</p>
        </section>
      </div>
    </Transition>

    <Transition name="back-top">
      <a v-if="showBackToTop" class="back-to-top" href="#home" aria-label="Kembali ke atas">↑</a>
    </Transition>
  </div>
</template>
