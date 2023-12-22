import React, { StrictMode } from 'react'

import App from './App'
import ReactDOM from 'react-dom'

top.start = function start(root) {
    ReactDOM.render(<StrictMode>
        <App />
    </StrictMode>, root)
}