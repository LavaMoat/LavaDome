import {LavaDome as LavaDomeReact} from '../../packages/react/index.mjs';

top.start = (function(){
    const secret = 'SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME';

    return function start(root) {
        root.innerHTML = '';
        const lavadome = new LavaDomeReact(root);
        lavadome.text(secret);
    }
}());