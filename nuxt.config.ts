// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite' 

export default defineNuxtConfig({ 
 compatibilityDate: '2025-07-15',
 devtools: { enabled: false }, 
 css: ['~/assets/css/main.css'],
 app: {
  head: {
   htmlAttrs: { lang: 'id' },
   title: 'Portofolio Nadira Putri — Calon Pengembang Web',
   meta: [
    { name: 'description', content: 'Portofolio Nadira Putri, siswa Rekayasa Perangkat Lunak yang tertarik pada pengembangan web, desain UI/UX, dan pengembangan perangkat lunak.' },
    { name: 'theme-color', content: '#f7fbff' },
   ],
  },
 },

 vite: { 
  plugins: [ 
     tailwindcss(),
     ], 
    },
   }) 