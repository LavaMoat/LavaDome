import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"

export const LavaDome = ({ text }) => {
    const hostRef = useRef(null)
    return (
        <span ref={hostRef}>
            <LavaDomeShadow text={text} hostRef={hostRef} />
        </span>
    )
};

function LavaDomeShadow({ text, hostRef }) {
    const lavadome = useRef(null);

    useEffect(() => {
        lavadome.current = new LavaDomeCore(hostRef.current);
        return () => lavadome.current = null;
    }, [])

    useEffect(() => {
        lavadome.current.text(text);
    }, [text]);
}