'use strict';

const {
    Object, Array,
    Function, Math,
    parseInt, WeakMap,
    Error, JSON, crypto,
} = globalThis;
const {
    defineProperties, assign,
    getOwnPropertyDescriptor,
    entries, create, hasOwn,
} = Object;
const { from } = Array;
const {random } = Math;
const { stringify } = JSON;
const randomUUID = crypto?.randomUUID?.bind(crypto);

// native generation util
const n = (obj, prop, accessor) =>
    obj && Function.prototype.call.bind(getOwnPropertyDescriptor(obj, prop)[accessor]);

export const replaceChildren = n(globalThis?.DocumentFragment?.prototype, 'replaceChildren', 'value');
export const attachShadow = n(globalThis?.Element?.prototype, 'attachShadow', 'value');
export const createElement = n(globalThis?.Document?.prototype, 'createElement', 'value');
export const appendChild = n(globalThis?.Node?.prototype, 'appendChild', 'value');
export const textContentSet = n(globalThis?.Node?.prototype, 'textContent', 'set');
export const setAttribute = n(globalThis?.Element?.prototype, 'setAttribute', 'value');
export const toUpperCase = n(globalThis?.String?.prototype, 'toUpperCase', 'value');
export const map = n(globalThis?.Array?.prototype, 'map', 'value');
export const join = n(globalThis?.Array?.prototype, 'join', 'value');
export const keys = n(globalThis?.Array?.prototype, 'keys', 'value');
export const at = n(globalThis?.Array?.prototype, 'at', 'value');
export const get = n(globalThis?.WeakMap?.prototype, 'get', 'value');
export const set = n(globalThis?.WeakMap?.prototype, 'set', 'value');
export const toFixed = n(globalThis?.Number?.prototype, 'toFixed', 'value')

export {
    // window
    Object, Array,
    Function, Math,
    parseInt, WeakMap,
    Error, JSON, crypto,
    // Object
    defineProperties, assign,
    getOwnPropertyDescriptor,
    entries, create, hasOwn,
    // Array
    from,
    // Math
    random,
    // JSON
    stringify,
    // crypto
    randomUUID,
}