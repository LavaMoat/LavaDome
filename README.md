<div align="center">
    <h1> LavaDome 🌋️ </h1>
    <i> ~ A new <a href="https://github.com/lavamoat">LavaMoat</a> tool for <b>DOM</b> nodes secured <b>E</b>ncapsulation ~ </i>
    <br><br>
</div> 

> ⚠️ EXPERIMENTAL [WIP] - USE AT YOUR OWN RISK ([learn more](#Disclaimer)) 

## [**Demo**](https://lavamoat.github.io/LavaDome/packages/core/demo/)

<details>
<summary><strong>Preview</strong><i> (click to expand) </i></summary>
<br>
<div align="center">
    <a href="https://lavamoat.github.io/LavaDome/packages/core/demo/">
        <img width="450" src="./assets/img4.png" alt="LavaDome DEMO"/>
    </a>
</div>
</details>

## Motivation

Under today's web standards, there is no established way to selectively isolate DOM subtrees in a **secured manner**. In other words, we can't control access to sections of the DOM by granting access for some parties while blocking access for others if they share the same JavaScript execution environment.

We live in a world where we can **no longer trust the code in our own apps**, and same-origin execution does not guarantee safety. To secure secrets in the frontend, we must be able to present content to the user while ensuring that it cannot be compromised by JavaScript code running under the same origin.

## Example

<details>
<summary>One use case for such a feature is MetaMask's "show private key" toggle, which exports the private key into plaintext upon user request. <i>(click to expand)</i></summary>
<br><div align="center"><img width="450" src="./assets/img1.png" alt="Show private key feature by MetaMask"/></div>
</details>

Currently, this sensitive content is simply attached to the DOM once it is exported, making it **fully accessible to all entities** running in the same app. That is, sections of the code that shouldn't have access to the private key could **easily extract it in plaintext**, so long as the malicious code has access to the DOM.

But rest assured. **We believe this is a [solvable problem 👇](#Solution).**

## Usage

**`LavaDome`** currently supports [Vanilla JavaScript](./packages/javascript) and [React](./packages/react) (with more on the way)

### [JavaScript](./packages/javascript)

```javascript
import { LavaDome as LavaDomeJavaScript } from '@lavamoat/lavadome-javascript';

const root = document.getElementById('root');
const lavadome = new LavaDomeJavaScript(root);
lavadome.text(secret);
```

### [React](./packages/react)

```javascript
import { LavaDome as LavaDomeReact } from '@lavamoat/lavadome-react';

function Secret({ text }) {
    return <LavaDomeReact text={text} />
}
```

### API

In addition to the root node, all constructors accept optional options 2nd argument:

```javascript
// javascript
new LavaDomeJavaScript(root, {
    // boolean
    unsafeOpenModeShadow: false,
});

// react
function Secret({ text }) {
    return <LavaDomeReact
        text={text}
        // boolean
        unsafeOpenModeShadow={false}
    />
}
```

### Testing

To integrate `LavaDome` into your testing environment too, you can unsafely set `@unsafeOpenModeShadow` to `true` to make the shadow `LavaDome` uses `{mode:open}`.

Once you did that, you'd be able to import `@lavamoat/lavadome-core`'s `LavaDomeDebug` API:

```javascript
import { LavaDomeDebug } from '@lavamoat/lavadome-core';
```

And then use its debugging util functions for your needs:

```javascript
new LavaDomeJavaScript(root, {
    unsafeOpenModeShadow: true,
}).text('123456');
LavaDomeDebug.getTextByRoot(root) === '123456'; // true
```

This works because `@unsafeOpenModeShadow=true` sets shadows to be `{mode:open}` instead of `{mode:closed}` which makes their content accessible from outside, which effectively also removes the whole purpose `LavaDome` comes to serve, and therefore:

> Remember: `@unsafeOpenModeShadow` option is UNSAFE to use, and should be enabled only to serve testing/debugging purposes - **never use in production!**

## Develop

To set up a local development build of **`LavaDome`**, clone this repo and run one of the following commands:

```bash
npm install && npm install --global serve
```

```bash
yarn install && yarn global add serve
```

## Solution

The [`ShadowDom`](https://web.dev/articles/`ShadowDom`-v1) Web API enables us to isolate and encapsulate DOM nodes. Although it's [not designed as a security feature](https://web.dev/articles/`ShadowDom`-v1#:~:text=Note%3A%20Closed%20shadow%20roots%20are%20not%20very%20useful.%20Some%20developers%20will%20see%20closed%20mode%20as%20an%20artificial%20security%20feature.%20But%20let%27s%20be%20clear%2C%20it%27s%20not%20a%20security%20feature.for%20Closed%20mode%20simply%20prevents%20outside%20JS%20from%20drilling%20into%20an%20element%27s%20internal%20DOM.), `ShadowDom` works well for isolating DOM subtrees from JavaScript and CSS that's running elsewhere in the page.

**`LavaDome`**'s basic approach is to leverage `ShadowDom`, while carefully addressing its [potential security gaps](https://blog.ankursundara.com/shadow-dom/).

**[LavaDome](https://github.com/lavamoat/lavadome/)** is intended to be a **security tool in the LavaMoat toolbox** for implementing frontend-only components that exclusively allow interactions with the user and trusted code, while blocking access attempts by untrusted JavaScript and CSS code in the app.

> Shout-out to [@arxenix](https://github.com/arxenix) for their [research](https://blog.ankursundara.com/shadow-dom/) into `ShadowDom` security, which provided the basis for major security improvements implemented in **`LavaDome`**.

## Goals

The **`LavaDome`** project follows the following core principles:

### Secure

Our top priority is providing air-tight security. We have wrapped the `ShadowDom` API with advanced security properties to make it safe for use when presenting sensitive info.

Visit [Security](#Security) to learn more about this effort.

### DX

We strive to provide a streamlined developer experience. To this end, we will:

1. Support as many popular frameworks (React, Angular, etc) as possible;
2. Make the API easy and simple to use.

### Read-mode only

At this stage, we do not plan to support write-mode, meaning **`LavaDome`** will only accept plaintext content for protection, and nothing more complex than that.

This is because supporting write-mode will require implementing an intractable isolated DOM, which introduces multiple security complications that we're not yet ready to face at this point, such as:

1. Event listeners security - prevent outer code from intercepting input that is destined for LavaDome inner nodes.
2. Overlay security - prevent malicious code from laying a phishing DOM on **`LavaDome`** to make the user serve sensitive input to the wrong entity.

## Design

The design complexity of this project isn't high. However, satisfying the combined requirements of the security principles it implements is a non-trivial task (see [Security](#Security)).

**`LavaDome`** consists of the following packages:

### [Core](./packages/core)

Implements the basic API layer that mediates the communication between the consumer and the protected isolated component. The API aspires to allow as much external manipulation of the isolated component as possible without providing actual DOM nodes from within it to anyone - not even the consumer of LavaDome - to maintain the highest security level possible.

In addition, it takes the responsibility of implementing all necessary security hardening to make `ShadowDom` feature usage truly secure in contrast to its native nature of not being a security feature by default (see [Security](#Security)).

> Remember: the core package is not to be used for production purposes!

### [JavaScript](./packages/javascript) / [React](./packages/react) / etc

Export functionalities for developers to consume **`LavaDome`** however they prefer, whether by JavaScript or as a React component (or any other platform - [ask away!](https://github.com/lavamoat/lavadome/issues/new?title=**`LavaDome`**+misses+support+for+...))
> NOTE: Delivering **`LavaDome`** support for frameworks integrates third party code that we do not control, which causes "security blank spots".

> Please read the [Security](#Security) section to learn how to remain as safe as possible when using **`LavaDome`** with third-party frameworks.

## Security

If you plan on using **`LavaDome`** for a project, here are the security aspects to be aware of:

### `ShadowDom` vs `iframe`

Again, this is still an experimental project, but we did put some thought into this decision. A natural alternative to using the `ShadowDom` is leveraging cross-origin `iframe`s. Infiltrating a cross-origin `iframe` is impossible, and it is recognized as a security critical mechanism by W3C spec. This means that if a breach somehow happens, it is treated as a security vulnerability and fixed by browser vendors with urgency.

The downside to this approach, however, is that integrating an iframe-based solution is significantly more difficult, in terms of UI/UX/DX, especially as a tool aimed at mass adoption.

**`LavaDome`** needs to provide a smooth and natural developer experience while facilitating the secure integration of encapsulated shadow DOM nodes within the host DOM tree, and `ShadowDom` is a DOM-oriented API built precisely for that purpose. This made it better-suited for our goals.

While the `ShadowDom` API is not officially endorsed as a security tool by its creators, its implementation is highly secure, and it does not leak any encapsulated information from within the shadow DOM tree except under very specific scenarios.

We believe that by carefully addressing those very scenarios, `ShadowDom` can be augmented into a secured DOM encapsulation API (worth a shot).

### Threats

It's important to address the current security threats that exist with `ShadowDom` based solution such as `LavaDome`.

#### 1. Injection

Developers might provide **`LavaDome`** with HTML/JS/CSS content that, when loaded, can accidentally or intentionally leak DOM nodes from within the `ShadowDom`, for example by dynamically adding JavaScript code at runtime.

To prevent this possibility, **`LavaDome`** does not accept DOM nodes at all into the shadow DOM tree, and only supports encapsulating plain text. This lets us avoid having to grapple with the security issues inherent in trusting user-supplied HTML/JS/CSS content.

We'd love to revisit this decision in the future as we research a stable and secure means of supporting DOM node and subtree input.

#### 2. Findability ([window.find()](https://blog.ankursundara.com/shadow-dom/#introducing-windowfind-and-text-selections))

This API allows developers to find and extract DOM nodes by searching for text that they contain. This is the only API that has so far been known to successfully leak DOM nodes from within a `ShadowDom`.

<details>
<summary>
    In Firefox, after finding the text, one can use <code>getSelection()</code> API to leak DOM nodes from within the `ShadowDom`, thus compromising the whole idea: <i>(click to expand)</i>
</summary>

```js
// defender
const secret = 'AN UNPREDICTABLE SECRET';
const opts = { mode:'closed' };
const root = document.body.firstElementChild.firstElementChild;
const p = document.createElement('p');
const shadow = root.attachShadow(opts);
shadow.append(p);
p.innerText = 'Secret is: ' + secret;

// attacker
setTimeout(() => {
    find('Secret is:'); // assuming the Shadow includes predictable text
    console.log('stolen secret: ', getSelection().anchorNode.textContent);
});
```

<div align="center"><img width="800" src="./assets/img2.png" alt="`ShadowDom` bypass Firefox"/></div>
</details>

To defend against this attack, the **`LavaDome`** consumer must not pass predictable content to the **`LavaDome`** API. While this might sound obvious, developers could easily be tempted to pass **`LavaDome`** an input that looks something like `The secret is: ldsjf9304rjdkn`, which would fully compromise the security of **`LavaDome`**. Even though the `ldsjf9304rjdkn` part is unguessable, the fixed phrase `"The secret is: "` could be exploited to reveal the secret, especially if it was previously exposed in the DOM.

Therefore, when using **`LavaDome`**, developers MUST only pass 100% unpredictable text as input.

<details>
<summary>
    Chromium is secure against the above attack. However, if a selected DOM node within the `ShadowDom` is <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable">content-editable</a>, attackers can leverage <code>document.execCommand('insertHTML', ...)</code> to achieve arbitrary code execution in the inner scope of the `ShadowDom`, and use that to access the encapsulated DOM nodes. <i>(click to expand)</i>
</summary>

```js
// defender
const secret = 'AN UNPREDICTABLE SECRET';
const opts = { mode:'closed' };
const root = document.body.firstElementChild.firstElementChild;
const div = document.createElement('div');
const shadow = root.attachShadow(opts);
shadow.append(div);
const p = document.createElement('p');
p.innerText = 'Secret is: ' + secret;
div.appendChild(p);
div.setAttribute('contenteditable', 'true');

// attacker
setTimeout(() => {
    console.log(1, 'stolen secret:');
    const bypass = '<audio/src/onerror=console.log(2,this.nextSibling.innerHTML)>';
    find('Secret is:'); // assuming the Shadow includes predictable text
    // assuming the found node is contenteditable=true
    document.execCommand('insertHTML', false, bypass);
});
```

<div align="center"><img width="800" src="./assets/img3.png" alt="`ShadowDom` bypass Chromium"/></div>
</details>

To defend against this attack vector, **`LavaDome`** removes all style attributes from its custom elements using the highest priority style attribute possible (`-webkit-user-modify: unset;`). This ensures that its elements are not vulnerable to injection of malicious external CSS that applies the `-webkit-user-modify:read-write` attribute, which would make `ShadowDom` elements `contenteditable`.

The second technique of using `contenteditable` as an attribute isn't currently relevant as **`LavaDome`** does not support accepting DOM nodes.

#### 3. Selectability ([getSelection](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection))

The attack vectors above aren't so useful if `getSelection` is mitigated. By making the text contained in **`LavaDome`** non-selectable, we harden the security against possible injection as demonstrated above. This works well in Chromium but we are working out some issues with Firefox.

#### 4. Secret splitting

If an attacker manages to guess a subset of the secret, they can compromise the entire secret (assuming `getSelection` captures scoped nodes like in Firefox). This is because searching for the subset will leak the text node that includes that subset of the secret, giving the attacker access to the entire secret.

As a countermeasure, **`LavaDome`** stores each character of the secret in its own `ShadowDom`, ensuring that compromising a subset of the secret will not lead to the rest being compromised as well. This safeguard has the additional benefit of making it exponentially more difficult to attackers to leak the whole secret the longer it is and the more character options it potentially includes.

A breach is still possible, but only if the attacker brute-forces all possible characters one by one, leaks all of the shadows they find, and then synchronously reorders all of the shadows correctly to align with their respective positions within the **`LavaDome`** main host.

> NOTICE: This technique was proven to be possible against LavaDome (see [#15](https://github.com/LavaMoat/LavaDome/issues/15#issuecomment-1873375440)), but only in Firefox.

#### 5. Side channeling

Another well known attack is to leak contents of ShadowDOMs using inheritable CSS properties such as `@font-face` to a remote server, character by character.

To address that, LavaDome adds to the parent Shadow all characters possible, so that such leaking attempt is confused when finding all possible characters, leaving this attack useless.

> NOTICE: This technique was proven to be possible against LavaDome (see [#16](https://github.com/LavaMoat/LavaDome/issues/16#issue-2067572697))

#### 6. Defensive coding

A secure solution requires defensive coding practices.

- To this end, all of the native APIs we use are cached for internal usage, to prevent attackers from reconfiguring global APIs to sabotage the execution flow of **`LavaDome`**.

- If you observe unconventional stylistic choices in the source code, there's a good chance they were informed by defensive coding principles.

- It is **crucial** to include **`LavaDome`** in the app before any scripts you don't trust, and preferably before ALL scripts!

- When using the framework versions of **`LavaDome`**, you should assume that these frameworks are not defensively written, and that the native APIs use are not safe from malicious interference. Be warned that the security of external code is outside of **`LavaDome`**'s control.

Therefore, we recommend always integrating such security solutions with the [SES](https://github.com/endojs/endo/tree/master/packages/ses#ses) technology developed by [@agoric](https://github.com/agoric). This is a security practice followed at [LavaMoat](https://github.com/lavamoat/lavamoat) and [MetaMask](https://github.com/MetaMask/metamask-extension).

## Disclaimer

If you read everything above, you should have a good sense of why **`LavaDome`** is still very experimental. Making a non-security feature secure is inherently risky, but as this problem space has no good existing solutions, we feel that this attempt represents a step in the right direction.

We still recommend using **`LavaDome`**, as it represents an unambiguous improvement compared to relying only on current web standards. Just remember that our solution will make your code "safer," but not "safe."

Additionally, please remember: LavaDome helps you bring a secret to DOM securely. Whether the secret was breached or not before being passed to LavaDome is out of LavaDome's scope.

This means it is your responsibility making sure the secret is safe up until the point you share it with LavaDome.

The best way to achieve that is by running under a locked down environment using [SES](https://github.com/endojs/endo/tree/master/packages/ses#ses) / [LavaMoat](https://github.com/lavamoat/lavamoat).
