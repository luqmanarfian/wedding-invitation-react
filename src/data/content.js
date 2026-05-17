/**
 * Centralized content data for the wedding invitation.
 * Edit this file to change names, dates, photos, and other content
 * without modifying component code.
 */

// === Image imports (downloaded to public/images/) ===
const IMAGES = {
  heroBg: '/images/hero-bg.jpg',
  groom: '/images/groom.jpg',
  bride: '/images/bride.jpg',
  gallery3: '/images/gallery-3.jpg',
  gallery4: '/images/gallery-4.jpg',
  gallery5: '/images/gallery-5.jpg',
};

// === Audio ===
export const AUDIO_SRC = '/audio/wedding-song.mp3';

// === Wedding Date (ISO format for countdown) ===
export const WEDDING_DATE = '2026-06-12T11:30:00';

// === Couple Information ===
export const COUPLE = {
  groom: {
    name: 'Lancy Hoshina',
    photo: IMAGES.groom,
    parents: 'Bapak ... & Ibu ...',
    role: 'Putra dari',
    socials: [
      { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
    ],
  },
  bride: {
    name: 'Kiyora Hoshina',
    photo: IMAGES.bride,
    parents: 'Bapak ... & Ibu ...',
    role: 'Putri dari',
    socials: [
      { platform: 'instagram', url: '#', icon: 'fab fa-instagram' },
    ],
  },
};

// === Quote / Ayat ===
export const QUOTE = {
  text: '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."',
  source: '(QS. Ar-Rum: 21)',
};

// === Our Story ===
export const OUR_STORY = {
  paragraphs: [
    '"Di tepi danau Moniyan, Kiyora memainkan melodi lembut yang tanpa sengaja mempertemukannya dengan Lancy. Dari pertemuan sederhana itu, keduanya mulai saling menemukan ketenangan di tengah kerasnya Land of Dawn.',
    'Hingga di bawah cahaya bulan, Lancy berkata,',
  ],
  quote: '"Di setiap perjalanan, akhirnya aku menemukan tempat untuk pulang."',
  closing:
    'Dan sejak saat itu, kisah mereka bukan lagi tentang pertemuan, melainkan tentang dua hati yang memilih untuk tetap bersama."',
};

// === Events (Akad & Resepsi) ===
export const EVENTS = [
  {
    id: 'akad',
    title: 'Akad Nikah',
    icon: 'fas fa-ring',
    date: 'Jumat, 12 Juni 2026',
    time: 'Pukul 11:30 WIB',
    venue: 'Bogor Valley Hotel',
    address:
      'Jl. Sholeh Iskandar No.5, RT.04/RW.11, Kedungbadak, Tanah Sereal, Kota Bogor, Jawa Barat',
  },
  {
    id: 'resepsi',
    title: 'Resepsi',
    icon: 'fas fa-glass-cheers',
    date: 'Jumat, 12 Juni 2026',
    time: 'Pukul 11:40 WIB',
    venue: 'Bogor Valley Hotel',
    address:
      'Jl. Sholeh Iskandar No.5, RT.04/RW.11, Kedungbadak, Tanah Sereal, Kota Bogor, Jawa Barat',
  },
];

// === Google Maps ===
export const MAPS = {
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.530932231267!2d106.80026781477038!3d-6.555627595258285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c4179e8de63d%3A0xc34b67ab13511eb9!2sBogor%20Valley%20Hotel!5e0!3m2!1sen!2sid!4v1682301234567!5m2!1sen!2sid',
  directionsUrl: 'https://maps.app.goo.gl/qJ8qN1N1N1N1N1N1N',
};

// === Gallery Images ===
export const GALLERY_IMAGES = [
  { src: IMAGES.bride, alt: 'Momen bersama 1' },
  { src: IMAGES.groom, alt: 'Momen bersama 2' },
  { src: IMAGES.gallery3, alt: 'Momen bersama 3' },
  { src: IMAGES.gallery4, alt: 'Momen bersama 4' },
  { src: IMAGES.gallery5, alt: 'Momen bersama 5', wide: true },
];

// === Wedding Gift / Rekening ===
export const GIFT = {
  bankName: 'Bank BCA',
  accountNumber: '000000000',
  accountHolder: 'Lancy Hoshina',
};

// === Default Wishes (dummy data) ===
export const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'Alucard & Miya',
    text: 'Selamat menempuh hidup baru sahabat! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu di Land of Dawn maupun di dunia nyata! 🎉',
    status: 'Hadir',
  },
];

// === Hero Section ===
export const HERO = {
  backgroundImage: IMAGES.heroBg,
  subtitle: 'KAMI AKAN MENIKAH',
  title: 'Lancy & Kiyora',
  date: '12 . 06 . 2026',
};

// === Google Sheets RSVP Config ===
// Ganti URL ini dengan Web App URL dari Google Apps Script Anda
export const GOOGLE_SHEETS_CONFIG = {
  webAppUrl: '', // Isi setelah deploy Google Apps Script
  enabled: false, // Set true setelah konfigurasi selesai
};
