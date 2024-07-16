import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import {create, hasOwn, stringify, WeakMap, get, set, isArray} from "@lavamoat/lavadome-core/src/native.mjs";

const
    tokenToCopyInvokerMap = new WeakMap(),
    tokenToTextMap = new WeakMap(),
    tokenToDepMap = new WeakMap(),
    textToTokenMap = create(null);

// transform provided sensitive text into lavadome capabilities such as:
// 1. unique token representing the text, so that it's the one tossed around React internals instead of the sensitive text
// 2. copy callback that's when invoked copies the sensitive text to clipboard
export const textToLavaDomeCapabilities = text => {
    if (typeof text !== 'string') {
        throw new Error(`LavaDomeReact: first argument must be a string, instead got ${stringify(text)}`);
    }

    if (!hasOwn(textToTokenMap, text)) {
        const token = create(null);
        textToTokenMap[text] = token;
        set(tokenToTextMap, token, text);
        set(tokenToCopyInvokerMap, token, () => {});
    }

    const token = textToTokenMap[text];
    const copy = () => get(tokenToCopyInvokerMap, token)();

    return [token, copy];
}

// we want to use the token as a useEffect dep, but we don't want to leak it to React
// map each token with a unique dep-id that is useless and irreversible if obtained
function tokenToDep(token) {
    let dep = get(tokenToDepMap, token);
    if (!dep) {
        dep = create(null);
        set(tokenToDepMap, token, dep);
    }
    return dep;
}

// map given token back to the secret text, but do so safely by making
// sure input is safe to access and use, as it comes from outside
function tokenToText(token) {
    const text = get(tokenToTextMap, token);

    if (!hasOwn(textToTokenMap, text)) {
        throw new Error(
            `LavaDomeReact: first argument must be a valid LavaDome token ` +
            `(replace "text={'secret'}" with "text={toLavaDomeToken('secret')}")`);
    }

    return text;
}

export const LavaDome = ({ token, unsafeOpenModeShadow }) => {
    const host = useRef(null);

    return (
        // form a span to act as the LavaDome host
        <span ref={host}>
            <LavaDomeShadow
                host={host}
                // accept both formats (token, or [token, copy])
                token={isArray(token) ? token[0] : token}
                unsafeOpenModeShadow={unsafeOpenModeShadow}
            />
        </span>
    );
};

function LavaDomeShadow({ host, token, unsafeOpenModeShadow }) {
    const
        // exchange token for sensitive text before check
        text = tokenToText(token),
        // use a unique and useless representation of the token as the useEffect dep
        dep = tokenToDep(token);

    // update lavadome secret text (given that the token is updated too)
    useEffect(() => {
        const lavadome = new LavaDomeCore(host.current, {unsafeOpenModeShadow});
        set(tokenToCopyInvokerMap, token, lavadome.copy);
        lavadome.text(text);
    }, [dep]);

    return <></>;
}