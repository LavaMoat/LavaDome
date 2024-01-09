import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"

export const LavaDome = ({ text, unsafeOpenModeShadow }) => {
    const hostRef = useRef(null);
    return (
        <span ref={hostRef}>
            <LavaDomeShadow
                text={text} hostRef={hostRef}
                unsafeOpenModeShadow={unsafeOpenModeShadow}
            />
        </span>
    )
};

function LavaDomeShadow({ hostRef, text, unsafeOpenModeShadow }) {
    const lavadome = useRef(null);

    useEffect(() => {
        lavadome.current = new LavaDomeCore(hostRef.current, {
            unsafeOpenModeShadow,
        });
        return () => lavadome.current = null;
    }, [])

    useEffect(() => {
        lavadome.current.text(text);
    }, [text]);

    return <></>
}