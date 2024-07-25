import React, { useState } from 'react';
import { LavaDome as LavaDomeReact, toLavaDomeCapabilities } from '../src/index';

const unsafeOpenModeShadow = location.href.includes('unsafeOpenModeShadow');

const blobURL = URL.createObjectURL(new Blob());
const secret = blobURL.split('/')[3].split('-').join('');
URL.revokeObjectURL(blobURL);

function Copy({copier}) {
    top.copier = copier;
    return <a href={'javascript:copier()'}>
        copy to clipboard
    </a>;
}

export default function App() {
    const [count, setCount] = useState(0);

    console.info('render marked', count);

    const [token, copy] = toLavaDomeCapabilities(secret);

    return (
        <div onClick={() => setCount(count+1)} >
            <div>
                This is not a secret:
                <p id="PUBLIC">
                    <span> PUBLIC_CONTENT_ACCESSIBLE_TO_ALL </span>
                </p>
            </div>
            <div>
                This is a secret (<Copy copier={copy}/>):
                <p id="PRIVATE">
                    <LavaDomeReact
                        unsafeOpenModeShadow={unsafeOpenModeShadow}
                        token={token}
                    />
                </p>
            </div>
            <hr/><ul><li><i>(Click to force component rerender "{count}")</i></li></ul>
        </div>
    )
}