import {OPTIONS} from './options.mjs';
import {from, map} from './native.mjs';
import {distraction} from './element.mjs';

// Attempt to reconstruct LavaDome instance secret given its original root - an UNSAFE
// method only expected to work when 'unsafeOpenModeShadow' debug-only option is enabled
function getTextByRoot(root) {
    console.warn('LavaDomeDebug(getTextByRoot):',
        `Call/include this function for testing/debugging purposes only!`,
        `(remember, '${OPTIONS.unsafeOpenModeShadow}' must be enabled for this function to work)`
    );

    // will remain empty when 'unsafeOpenModeShadow' is disabled
    let text = '';

    const shadow = root?.shadowRoot;
    if (!shadow) {
        return text;
    }

    const parts = from(shadow.querySelectorAll('span'));
    map(parts, node => {
        const part = node?.shadowRoot?.firstChild?.textContent;
        if (part) text += part;
    });

    return text;
}

// Strip distraction chars from given LavaDome inner text to get a string representing
// the inner text exactly - an UNSAFE method relevant for when testing a LavaDome node
// with web drivers that when are asked to get its inner text capture both the secret
// and the distraction text, which is usually irrelevant for tests
function stripDistractionFromText(text) {
    console.warn('LavaDomeDebug(stripDistractionFromText):',
        `Call/include this function for testing/debugging purposes only!`,
    );

    return text
        .split(distraction().innerText).join('')
        .split('\n').join('')
        .split('\r').join('')
        .split('\t').join('');
}

export const LavaDomeDebug = {
    getTextByRoot,
    stripDistractionFromText,
}