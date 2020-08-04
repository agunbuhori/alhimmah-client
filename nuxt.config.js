require('dotenv').config();

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  loading: {
    color: '#FFB74D'
  },

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { name: 'theme-color', content: '#1976d2' },
      { name: 'google', content: 'notranslate' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
    script: [
      { src: 'https://apis.google.com/js/platform.js', async: true, defer: true }
    ],
  },
  pwa: {
    manifest: {
      name: 'madinah.id',
      lang: 'id',
      "theme_color": "#1976d2",
      "background_color": "#1976d2",
      "display": "standalone",
      "orientation": "portrait",
      "scope": "/",
      "start_url": "/",
      "icons": [
        {
          "src": "/logo/icons/icon-72x72.png",
          "sizes": "72x72",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-128x128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-144x144.png",
          "sizes": "144x144",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-152x152.png",
          "sizes": "152x152",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "/logo/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
    }
  },
  /*
  ** Global CSS
  */
  css: [
    '~assets/sass/style.sass',
    '~assets/css/themify-icons.css',
    '~assets/css/transition.css',
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/string.js',
    {src: '~/plugins/owl.js', ssr: true}
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/laravel-echo'
  ],
  moment: {
    defaultLocale: 'id',
    locales: ['id']
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/auth',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_URL,
    progress: false
  },
  auth: {
    plugins: [ '~/plugins/auth.js' ],
    strategies: {
      local: {
        endpoints: {
          login: { url: 'login', method: 'post', propertyName: 'token' },
          logout: { url: 'logout', method: 'post' },
          user: false,
        },
        tokenRequired: true,
        tokenType: 'Bearer',
        globalToken: true,
        autoFetchUser: false
      }
    }
  },
  /*
  ** Content module configuration
  ** See https://content.nuxtjs.org/configuration
  */
  content: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    publicPath: "/nuxt/"
  },
  
  server: {
    host: "0.0.0.0",
    port: 3000
  }
}
