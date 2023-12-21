import React, {useEffect, useRef} from 'react'
import { LavaDome as LavaDomeCore } from "@lavadome/core"

export function LavaDome({ text }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const lavadome = new LavaDomeCore(containerRef.current);
        lavadome.text(text);
    }, [text]);

    return <span ref={containerRef}></span>;
}
