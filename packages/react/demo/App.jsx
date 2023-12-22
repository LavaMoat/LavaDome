import React from 'react'

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
                    <span> TO_BE_REPLACED </span>
                </p>
            </div>
        </div>
    )
}