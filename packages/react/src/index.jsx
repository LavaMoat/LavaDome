import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import {WeakMap, get, set, has, Symbol} from "../../core/src/native.mjs"

// WeakMap{ unique-token -> sensitive-text }
// Only code with access to this map can exchange a token with a text
const tokens = new WeakMap();

// weakly map sensitive text of the user with a unique token representing it, so that
// the token is the one being passed around React internals rather than the sensitive text
export const toLavaDomeToken = text => {
    const lavadome = Symbol();
    set(tokens, lavadome, text);
    return lavadome;
}

export const LavaDome = ({ text, unsafeOpenModeShadow }) => {
    // variable @text is named that way only for visibility - in reality it's a lavadome token
    const token = text;

    if (!has(tokens, token)) {
        throw new Error(
            'LavaDome: first argument must be a valid LavaDome token ' +
            '(replace "text={\'secret\'}" with "text={toLavaDomeToken(\'secret\')}")');
    }

    const host = useRef(null);

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
    const lavadome = useRef(null);

    useEffect(() => {
        // generate a lavadome instance reference
        const opts = { unsafeOpenModeShadow };
        lavadome.current = new LavaDomeCore(host.current, opts);
        return () => lavadome.current = null;
    }, []);

    useEffect(() => {
        // exchange token for sensitive text and update lavadome reference with it
        const text = get(tokens, token);
        lavadome.current.text(text);
    }, [token]);

    return <></>;
}