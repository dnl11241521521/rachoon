// https://nuxt.com/docs/api/configuration/nuxt-config
//
export default defineNuxtConfig({
  css: ["~/assets/style.scss", "@fortawesome/fontawesome-svg-core/styles.css"],
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  ssr: false,
  experimental: {
    payloadExtraction: false,
  },
  vite: {
    optimizeDeps: {
      include: ["@repo/common"],
    },
  },
  nitro: {
    routeRules: {
      "/app/info": { proxy: "/api/info" },
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  build: {
    transpile: [
      "h3",
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@vuepic/vue-datepicker",
    ],
  },
});
