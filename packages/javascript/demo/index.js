import {LavaDome as LavaDomeJavaScript} from '../src/index.mjs';

top.start = (function(){
    const secret = 'SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME';

    return function start(root) {
        root.innerHTML = '';
        const lavadome = new LavaDomeJavaScript(root);
        lavadome.text(secret);
    }
}());