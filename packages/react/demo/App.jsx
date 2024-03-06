import React, { useState } from 'react';
import { LavaDome as LavaDomeReact, toLavaDomeToken } from '../src/index';

const unsafeOpenModeShadow = location.href.includes('unsafeOpenModeShadow');

const blobURL = URL.createObjectURL(new Blob());
const secret = blobURL.split('/')[3].split('-').join('');
URL.revokeObjectURL(blobURL);

export default function App() {
    const [count, setCount] = useState(0);

    console.info('render marked', count);

    return (
        <div onClick={() => setCount(count+1)} >
            <div>
                This is not a secret:
                <p id="PUBLIC">
                    <span> PUBLIC_CONTENT_ACCESSIBLE_TO_ALL </span>
                </p>
            </div>
            <div>
                This is a secret:
                <p id="PRIVATE">
                    <LavaDomeReact
                        unsafeOpenModeShadow={unsafeOpenModeShadow}
                        text={toLavaDomeToken(secret + ' ')}
                    />
                </p>
            </div>
            <hr/><ul><li><i>(Click to force component rerender "{count}")</i></li></ul>
        </div>
    )
}