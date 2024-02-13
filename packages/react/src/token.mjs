import {create, hasOwn, randomUUID, stringify} from "@lavamoat/lavadome-core/src/native.mjs";

const tokenToTextMap = create(null), textToTokenMap = create(null);

// map given token back to the secret text, but do so safely by making
// sure input is safe to access and use, as it comes from outside
export function tokenToText(token) {
    const text = tokenToTextMap[token];

    const isTextValid = typeof text === 'string' && hasOwn(textToTokenMap, text);
    const isTokenValid = typeof token === 'string' && hasOwn(tokenToTextMap, token);

    if (!isTextValid || !isTokenValid) {
        throw new Error(
            'LavaDomeReact: first argument must be a valid LavaDome token ' +
            '(replace "text={\'secret\'}" with "text={toLavaDomeToken(\'secret\')}")');
    }

    return text;
}

// map sensitive text of the user with a unique token representing it, so that the
// token is the one being passed around React internals rather than the sensitive text
export const textToToken = text => {
    if (typeof text !== 'string') {
        throw new Error(`LavaDomeReact: first argument must be a string, instead got ${stringify(text)}`);
    }

    if (!hasOwn(textToTokenMap, text)) {
        const token = randomUUID();
        textToTokenMap[text] = token;
        tokenToTextMap[token] = text;
    }

    return textToTokenMap[text];
}