'use strict';

import {create, hasOwn, assign} from './native.mjs';

export const OPTIONS = {
    // internal
    isInnerInstance: Symbol('isInnerInstance'),
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

export function options(opts = {}) {
    const {
        unsafeOpenModeShadow,
        isInnerInstance,
    } = OPTIONS;
    const get = getter(assign(create(null), opts));
    const options = create(null);
    options.isInnerInstance = get(isInnerInstance, 'boolean', false);
    options.unsafeOpenModeShadow = get(unsafeOpenModeShadow, 'boolean', false);
    return options;
}