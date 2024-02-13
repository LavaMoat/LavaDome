import {create, hasOwn, randomUUID, stringify} from "@lavamoat/lavadome-core/src/native.mjs";
import {OPTIONS} from "@lavamoat/lavadome-core/src/options.mjs";

const tokenToTextMap = create(null), textToTokenMap = create(null);

const rand = () => randomUUID ? randomUUID() :
    // unsafe weak random generation - only meant for testing mode!
    // (because "randomUUID" might not appear in testing envs such as node)
    (Math.random() + 1).toString(36).substring(7);

// map given token back to the secret text, but do so safely by making
// sure input is safe to access and use, as it comes from outside
export function tokenToText(token, unsafeOpenModeShadow) {
    if (!randomUUID) {
        if (unsafeOpenModeShadow) {
            console.warn('LavaDomeReact:',
                `It seems that some API required for LavaDome to perform safely is missing ("crypto.randomUUID").`,
                `Since option "${OPTIONS.unsafeOpenModeShadow}" is enabled,`,
                `this should be fine, as testing environments are likely to not have support for such features.`,
                `If this isn't a testing environment, there's something wrong with your LavaDome setup - this downgrades security!`
            );
        } else {
            throw new Error(
                `LavaDomeReact: this runtime environment does not seem to support some API required for LavaDome to perform safely ("crypto.randomUUID").`
            );
        }
    }

    const text = tokenToTextMap[token];

    const isTextValid = typeof text === 'string' && hasOwn(textToTokenMap, text);
    const isTokenValid = typeof token === 'string' && hasOwn(tokenToTextMap, token);

    if (!isTextValid || !isTokenValid) {
        throw new Error(
            `LavaDomeReact: first argument must be a valid LavaDome token ` +
            `(replace "text={'secret'}" with "text={toLavaDomeToken('secret')}")`);
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
        const token = rand();
        textToTokenMap[text] = token;
        tokenToTextMap[token] = text;
    }

    return textToTokenMap[text];
}