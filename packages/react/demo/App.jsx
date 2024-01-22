import React, { useState, useEffect } from 'react';
import { LavaDome as LavaDomeReact } from '../src/index';

const unsafeOpenModeShadow = location.href.includes('unsafeOpenModeShadow');

export default function App() {
    // Trigger rerenders for a more realistic test (and to enable some potential hacks)
    const [_rerender, setRerender] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('rerendering');
            setRerender(prevRerender => !prevRerender);
        }, 10000); 

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div style={{ borderStyle: 'solid', margin: '10px', padding: '10px' }}>
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
                        text={'SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME'}
                    />
                </p>
            </div>
        </div>
    );
}