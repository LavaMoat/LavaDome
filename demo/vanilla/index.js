import {LavaDome as LavaDomeVanilla} from '../../packages/vanilla/index.mjs';

top.start = (function(){
    const secret = 456;

    return function start(root) {
        root.innerHTML = '';
        const lavadome = new LavaDomeVanilla(root);
        lavadome.text(secret);
    }
}());