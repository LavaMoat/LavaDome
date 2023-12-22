import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"

export function LavaDomeShadow({ text, hostRef }) {
    const lavadome = useRef(null);

    useEffect(() => {
        lavadome.current = new LavaDomeCore(hostRef.current);
        return () => lavadome.current = null;
    }, [])

    useEffect(() => {
        lavadome.current.text(text);
    }, [text]);
}
