'use strict';

const {
    Object, Array,
    Function, Math,
    parseInt, WeakMap,
    Error, JSON,
} = window;
const {
    defineProperties,
    getOwnPropertyDescriptor,
    entries,
} = Object;
const { from } = Array;
const {random } = Math;
const { stringify } = JSON;

// native generation util
const n = (obj, prop, accessor) =>
    Function.prototype.call.bind(getOwnPropertyDescriptor(obj, prop)[accessor]);

export const attachShadow = n(Element.prototype, 'attachShadow', 'value');
export const createElement = n(Document.prototype, 'createElement', 'value');
export const appendChild = n(Node.prototype, 'appendChild', 'value');
export const textContentSet = n(Node.prototype, 'textContent', 'set');
export const setAttribute = n(Element.prototype, 'setAttribute', 'value');
export const toUpperCase = n(String.prototype, 'toUpperCase', 'value');
export const map = n(Array.prototype, 'map', 'value');
export const join = n(Array.prototype, 'join', 'value');
export const keys = n(Array.prototype, 'keys', 'value');
export const at = n(Array.prototype, 'at', 'value');
export const get = n(WeakMap.prototype, 'get', 'value');
export const set = n(WeakMap.prototype, 'set', 'value');
export const toFixed = n(Number.prototype, 'toFixed', 'value')

export {
    // window
    Object, Array,
    Function, Math,
    parseInt, WeakMap,
    Error, JSON,
    // Object
    defineProperties,
    getOwnPropertyDescriptor,
    entries,
    // Array
    from,
    // Math
    random,
    // JSON
    stringify,
}