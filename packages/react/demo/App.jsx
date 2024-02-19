import React, { useState } from 'react';
import { LavaDome as LavaDomeReact, toLavaDomeToken } from '../src/index';

const unsafeOpenModeShadow = location.href.includes('unsafeOpenModeShadow');

export default function App() {
    const [count, setCount] = useState(0);

    console.info('render marked', count);

    return (
        <div onClick={() => setCount(count+1)}
            style={{ borderStyle: 'solid', margin: '10px', padding: '10px' }} >
            <div>
                This is not a secret:
                <p id="PUBLIC">
                    <span> PUBLIC_CONTENT_NOT_ONLY_ACCESSIBLE_TO_LAVADOME </span>
                </p>
            </div>
            <div>
                This is a secret:
                <p id="PRIVATE">
                    <LavaDomeReact
                        unsafeOpenModeShadow={unsafeOpenModeShadow}
                        text={toLavaDomeToken(`SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME: "${count}"`)}
                    />
                </p>
            </div>
            <hr/><ul><li><i>(Click to force component rerender "{count}")</i></li></ul>
        </div>
    )
}