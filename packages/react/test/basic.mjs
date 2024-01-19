import {setup} from "./index.mjs"

describe('test javascript mode', async function () {
    before(setup);

    it('naively try to steal the secret using innerText', async function () {
        const result = await browser.executeAsync(function(done) {
            done(document.documentElement.innerText)
        });
        expect(result.includes('PUBLIC_CONTENT_NOT_ONLY_ACCESSIBLE_TO_LAVADOME')).toBeTruthy();
        expect(result.includes('TO BE REPLACED')).toBeFalsy();
        expect(result.includes('SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME')).toBeFalsy();
    });
    it('steal secret from react metadata on DOM nodes', async function () {
        const result = await browser.executeAsync(function(done) {
            const hostref = document.querySelector("#PRIVATE>span");
            const cache = new Set();
            const result = JSON.stringify(
            hostref[
                Object.getOwnPropertyNames(hostref).find((a) => a.includes("reactInternal"))
            ].child,
            (key, value) => {
                if (typeof value === "object" && value !== null) {
                if (cache.has(value)) return;
                cache.add(value);
                }
                return value;
            }
            );
            // specifically in the props / memoizedProps fields
            done(result)
        });
        expect(result.includes('SECRET_CONTENT_ONLY_ACCESSIBLE_TO_LAVADOME')).toBeFalsy();
    });
});