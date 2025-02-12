'use strict';

const {
    Object, Array,
    Function, Math,
    parseInt, WeakMap,
    Error, Blob, TypeError,
    ClipboardItem,
    navigator,
    navigation,
} = globalThis;
const {
    defineProperties, assign,
    getOwnPropertyDescriptor,
    entries, create, hasOwn,
} = Object;
const { from } = Array;
const {random } = Math;
const { clipboard } = navigator;

// native generation util
const n = (obj, prop, accessor) =>
    obj && Function.prototype.call.bind(getOwnPropertyDescriptor(obj, prop)[accessor]);

export const ownerDocument = n(globalThis?.Node?.prototype, 'ownerDocument', 'get');
export const addEventListener = n(globalThis?.EventTarget?.prototype, 'addEventListener', 'value');
export const replaceChildren = n(globalThis?.DocumentFragment?.prototype, 'replaceChildren', 'value');
export const attachShadow = n(globalThis?.Element?.prototype, 'attachShadow', 'value');
export const createElement = n(globalThis?.Document?.prototype, 'createElement', 'value');
export const appendChild = n(globalThis?.Node?.prototype, 'appendChild', 'value');
export const textContentSet = n(globalThis?.Node?.prototype, 'textContent', 'set');
export const setAttribute = n(globalThis?.Element?.prototype, 'setAttribute', 'value');
export const toUpperCase = n(globalThis?.String?.prototype, 'toUpperCase', 'value');
export const includes = n(globalThis?.String?.prototype, 'includes', 'value');
export const map = n(globalThis?.Array?.prototype, 'map', 'value');
export const join = n(globalThis?.Array?.prototype, 'join', 'value');
export const keys = n(globalThis?.Array?.prototype, 'keys', 'value');
export const at = n(globalThis?.Array?.prototype, 'at', 'value');
export const get = n(globalThis?.WeakMap?.prototype, 'get', 'value');
export const set = n(globalThis?.WeakMap?.prototype, 'set', 'value');
export const toFixed = n(globalThis?.Number?.prototype, 'toFixed', 'value');
export const write = n(globalThis?.Clipboard?.prototype, 'write', 'value');
export const destination = n(globalThis?.NavigateEvent?.prototype, 'destination', 'get');
export const url = n(globalThis?.NavigationDestination?.prototype, 'url', 'get');
export const preventDefault = n(globalThis?.Event?.prototype, 'preventDefault', 'value');
export const stopPropagation = n(globalThis?.Event?.prototype, 'stopPropagation', 'value');

export {
    // window
    Object, Array,
    Function, Math,
    parseInt, WeakMap,
    Error, Blob, TypeError,
    ClipboardItem,
    navigator, clipboard,
    navigation,
    // Object
    defineProperties, assign,
    getOwnPropertyDescriptor,
    entries, create, hasOwn,
    // Array
    from,
    // Math
    random,
}