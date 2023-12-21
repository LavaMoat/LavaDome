import React, { StrictMode } from 'react'

import App from './App'
import { createRoot } from 'react-dom/client'

top.start = function start(root) {
    createRoot(root).render(
        <StrictMode>
            <App secret={'SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME'} />
        </StrictMode>
    )
}