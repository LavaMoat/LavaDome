import {LavaDome as LavaDomeReact} from '../../packages/react/index.mjs';

top.start = (function(){
    const secret = 456;

    return function start(root) {
        root.innerHTML = '';
        const lavadome = new LavaDomeReact(root);
        lavadome.text(secret);
    }
}());