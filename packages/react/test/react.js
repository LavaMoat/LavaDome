const base = 'http://localhost:8080/';

async function setup(mode) {
    const url = base + '?' + mode;
    await browser.url(url);
    await browser.execute(function() {
        // something
    });
}

export {setup}