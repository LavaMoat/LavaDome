const base = 'http://localhost:3000/demo/';

async function setup() {
    const url = base;
    await browser.url(url);
    await browser.execute(function() {
        // something
    });
}

export {setup}