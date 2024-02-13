import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import { tokenToText } from "./token.mjs";

export const LavaDome = ({ text, unsafeOpenModeShadow }) => {
    // variable @text is named that way only for visibility - in reality it's a lavadome token
    const token = text, host = useRef(null);

    return (
        // form a span to act as the LavaDome host
        <span ref={host}>
            <LavaDomeShadow
                host={host} token={token}
                unsafeOpenModeShadow={unsafeOpenModeShadow}
            />
        </span>
    );
};

function LavaDomeShadow({ host, token, unsafeOpenModeShadow }) {
    // exchange token for sensitive text before check
    const text = tokenToText(token);
    const lavadome = useRef(null);

    // generate a lavadome instance reference with a teardown
    useEffect(() => {
        const opts = { unsafeOpenModeShadow };
        lavadome.current = new LavaDomeCore(host.current, opts);
        return () => lavadome.current = null;
    }, []);

    // update lavadome secret text (given that the token is updated too)
    useEffect(() => lavadome.current.text(text), [token]);

    return <></>;
}