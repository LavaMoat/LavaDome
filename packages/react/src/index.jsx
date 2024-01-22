import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
export { envelope } from "@lavamoat/lavadome-core"

export const LavaDome = ({ envelope, unsafeOpenModeShadow }) => {
    const hostRef = useRef(null);
    return (
        <span ref={hostRef}>
            <LavaDomeShadow
                envelope={envelope} hostRef={hostRef}
                unsafeOpenModeShadow={unsafeOpenModeShadow}
            />
        </span>
    )
};

function LavaDomeShadow({ hostRef, envelope, unsafeOpenModeShadow }) {
    const lavadome = useRef(null);

    useEffect(() => {
        lavadome.current = new LavaDomeCore(hostRef.current, {
            unsafeOpenModeShadow,
        });
        return () => lavadome.current = null;
    }, [])

    useEffect(() => {
        const payload = STORE.get(envelope);
        lavadome.current.envelope(payload);
    }, [envelope]);

    return <></>
}