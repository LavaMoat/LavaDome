import {setup} from "./index.mjs"

describe('test vanilla mode', async function () {
    before(setup.bind(null, 'vanilla'));

    it('naively try to steal the secret using innerText', async function () {
        const result = await browser.executeAsync(function(done) {
            done(document.documentElement.innerText)
        });
        expect(result.includes('PUBLIC_CONTENT_NOT_ONLY_ACCESSIBLE_TO_LAVADOME')).toBeTruthy();
        expect(result.includes('SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME')).toBeFalsy();
    });
});