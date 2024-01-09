import {create, hasOwn} from './native.mjs';

export const OPTIONS = {
    // internal
    disableWarnings: Symbol('disableWarnings'),
    // external
    unsafeOpenModeShadow: 'unsafeOpenModeShadow',
};

const getter = (opts) => function get(prop, type, def) {
    const val = opts[prop];
    if (!hasOwn(opts, prop)) {
        return def;
    }
    if (typeof val !== type) {
        return def;
    }
    return val;
};

export function options(opts = create(null)) {
    const {
        unsafeOpenModeShadow,
        disableWarnings,
    } = OPTIONS;
    const get = getter(opts);
    const options = create(null);
    options.disableWarnings = get(disableWarnings, 'boolean', false);
    options.unsafeOpenModeShadow = get(unsafeOpenModeShadow, 'boolean', false);
    if (!options.disableWarnings && options.unsafeOpenModeShadow) {
        console.warn('LavaDome:',
            `Initiated with "${unsafeOpenModeShadow}" set to true.`,
            'This leaves LavaDome fully vulnerable, ONLY USE FOR TESTING!',
        );
    }
    options.shadowRootOpts = {mode: !!options.unsafeOpenModeShadow ? 'open' : 'closed'};
    return options;
}