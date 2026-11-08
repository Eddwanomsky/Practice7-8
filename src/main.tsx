import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen' // або ваш файл маршрутів

export const router = createRouter({ routeTree })

// Реєстрація роутера для повної типізації (TypeScript)
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App router={router} />
  </React.StrictMode>,
)