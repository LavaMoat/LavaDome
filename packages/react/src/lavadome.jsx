import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import {create, hasOwn, stringify, WeakMap, get, set} from "@lavamoat/lavadome-core/src/native.mjs";

const
    tokenToTextMap = new WeakMap(),
    tokenToDepMap = new WeakMap(),
    textToTokenMap = create(null);

// map sensitive text of the user with a unique token representing it, so that the
// token is the one being passed around React internals rather than the sensitive text
export const textToToken = text => {
    if (typeof text !== 'string') {
        throw new Error(`LavaDomeReact: first argument must be a string, instead got ${stringify(text)}`);
    }

    if (!hasOwn(textToTokenMap, text)) {
        const token = create(null);
        textToTokenMap[text] = token;
        set(tokenToTextMap, token, text);
    }

    return textToTokenMap[text];
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
    const
        // exchange token for sensitive text before check
        text = tokenToText(token),
        // use a unique and useless representation of the token as the useEffect dep
        dep = tokenToDep(token);

    // update lavadome secret text (given that the token is updated too)
    useEffect(() => { new LavaDomeCore(host.current, {unsafeOpenModeShadow}).text(text) }, [dep]);

    return <></>;
}