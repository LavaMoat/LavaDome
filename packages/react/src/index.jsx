import React, { useEffect, useRef } from 'react'
import { LavaDome as LavaDomeCore } from "@lavamoat/lavadome-core"
import {WeakMap, get, set, has, Symbol} from "../../core/src/native.mjs"

const lavadomes = new WeakMap();

export const lavadome = text => {
    const lavadome = Symbol();
    set(lavadomes, lavadome, text);
    return lavadome;
}

export const LavaDome = ({ text, unsafeOpenModeShadow }) => {
    if (!has(lavadomes, text)) {
        throw new Error(
            'LavaDome: first argument must be a LavaDome token ' +
            '(replace "text={\'secret\'}" with "text={lavadome(\'secret\')}")');
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
        lavadome.current.text(get(lavadomes, text));
    }, [text]);

    return <></>
}