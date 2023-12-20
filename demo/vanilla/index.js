import {LavaDome as LavaDomeVanilla} from '../../packages/vanilla/index.mjs';

top.start = (function(){
    const secret = 'SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME';

    return function start(root) {
        root.innerHTML = '';
        const lavadome = new LavaDomeVanilla(root);
        lavadome.text(secret);
    }
}());