import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import {WeakMap, get, set, has, create} from "../../core/src/native.mjs"

const wraps = new WeakMap();

const unwrap = wrapped => get(wraps, wrapped);

export const wrap = text => {
    const wrapped = create(null);
    set(wraps, wrapped, text);
    return wrapped;
}

export const LavaDome = ({ text, unsafeOpenModeShadow }) => {
    if (!has(wraps, text)) {
        throw new Error(
            `LavaDome: first argument must be a LavaDome wrapped object (did you forget to call "wrap(secret)" before passing the secret?)`);
    }
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
        lavadome.current.text(unwrap(text));
    }, [text]);

    return <></>
}