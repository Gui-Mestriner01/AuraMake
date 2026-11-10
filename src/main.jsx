import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Links antigos usavam "#" (ex.: /#/loja?cat=labios). Converte para o endereço novo
// antes de o site abrir, para nenhum link já compartilhado quebrar.
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
