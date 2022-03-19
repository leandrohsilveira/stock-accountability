import App from './App.svelte'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('build/serviceWorker.js')
}

const app = new App({
  target: document.body,
})

export default app
