import React from 'react'
import { LavaDome as LavaDomeReact } from '../src/LavaDome'

export default function App() {
    return (
        <div style={{ borderStyle: 'solid', margin: '10px', padding: '10px' }} >
            <div>
                This is not a secret:
                <p id="PUBLIC">
                    <span> PUBLIC_CONTENT_NOT_ONLY_ACCESSIBLE_TO_LAVADOME </span>
                </p>
            </div>
            <div>
                This is a secret:
                <p id="PRIVATE">
                    <LavaDomeReact text={'SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME'} />
                </p>
            </div>
        </div>
    )
}