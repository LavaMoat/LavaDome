import React, { StrictMode } from 'react'

import App from './App'
import { createRoot } from 'react-dom/client'

const rootNode = document.querySelector('#root')
if (rootNode) {
  createRoot(rootNode).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}