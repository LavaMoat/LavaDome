'use strict';

import {
    Array,
    createElement,
    entries, from,
    join, keys, map,
    parseInt, random,
    setAttribute,
    textContentSet,
    toFixed,
} from './native.mjs';
import {chars} from './char.mjs';

const {
    letters,
    alphanumeric,
    all,
} = chars;

const randChar = (f, n) => f[parseInt(toFixed(random() * n))];
const rand = len => randChar(letters, 26) +
    join(map(from(keys(Array(len))), () => randChar(alphanumeric, 36)), '');

// secure and generic creator for elements with specific characteristics
function creator(style, tag, text = '') {
    // turn style object to string asap to prevent later pollution attack attempts
    style = join(map(entries(style), ([k,v]) => `${k}: ${v} !important`), '; ');
    return function () {
        const node = createElement(document, tag());
        setAttribute(node, 'style', style);
        textContentSet(node, text);
        return node;
    };
}

const invoker = creator => () => creator();

// an element that is hard to find/select
export const unselectable = invoker(creator({
    // makes element uneditable to prevent document.execCommand HTML injection attacks
    '-webkit-user-modify': 'unset',
    // makes element unselectable to prevent getSelection attacks
    '-webkit-user-select': 'none', 'user-select': 'none',
}, () => rand(7)));

// an element that includes all possible chars to distract side channel leaks attempts
export const distraction = invoker(creator({
    // place element so that it isn't intractable nor viewable
    // for the user, but still a distraction for attackers
    'top': '-10px', 'right': '-10px', 'position': 'fixed',
    // font-size smaller than 1px fails to be a distraction on Firefox
    'font-size': '1px',
}, () => 'span', all));