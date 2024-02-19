import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import {tokenToDep, tokenToText} from "./token.mjs";

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
    let lavadome;

    // exchange token for sensitive text before check
    const text = tokenToText(token, unsafeOpenModeShadow);

    // generate a lavadome instance reference with a teardown
    useEffect(() => {
        const opts = { unsafeOpenModeShadow };
        lavadome = new LavaDomeCore(host.current, opts);
        return () => lavadome = null;
    }, []);

    // use a unique and useless representation of the token as the useEffect dep
    const dep = tokenToDep(token);

    // update lavadome secret text (given that the token is updated too)
    useEffect(() => lavadome.text(text), [dep]);

    return <></>;
}