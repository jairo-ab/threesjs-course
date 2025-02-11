import restart from 'vite-plugin-restart'

export default {
  root: 'src/',
  publicDir: '../static/',
  base: './',
  server: {
    host: true
  },
  build: {
    outdir: '../dist',
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    restart({ restart: [ '../static/**', ] })
  ]
}
