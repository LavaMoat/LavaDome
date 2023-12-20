<div align="center">
    <h1> LavaDome 🌋️ </h1>
    <i> ~ A new <a href="https://github.com/lavamoat">LavaMoat</a> tool for <b>DOM</b> nodes secured <b>E</b>ncapsulation ~ </i>
    <br/><br/>
    <img src="https://img.shields.io/npm/v/@lavamoat/lavadome"/>
    <img src="https://img.shields.io/bundlephobia/min/@lavamoat/lavadome"/>
    <img src="https://badges.frapsoft.com/javascript/code/javascript.svg?v=101" width="113">
    <img src="https://img.shields.io/npm/dw/@lavamoat/lavadome"/>
    <img src="https://img.shields.io/github/license/lavamoat/lavadome"/>
    <br/><br/>
    <br/><br/>
</div> 

> ⚠️ EXPERIMENTAL [WIP] - USE AT YOUR OWN RISK ([learn more](#Disclaimers)) 

## Motivation

As of today, standards of the web do not offer a way to selectively isolate subtrees 
of the DOM from some parties while granting access to others in a **secured manner** when 
both parties share the same JavaScript execution environment.

In a world where we **no longer trust the code in our app**, even when is executed in the 
same origin we consider to be trustworthy, we need to be able to present the user 
with content we trust that other JavaScript code cannot compromise.

## Example

<details>
<summary>
    A great example would be MetaMask's "show private key" feature, where 
    the private key can be exported by request of the user as plain text
</summary>
<img width="666" src="./assets/img1.png" alt="Show private key feature by MetaMask"/>
</details>

At that stage, this sensitive content is attached to DOM
and is fully **accessible to all entities** running in the same app.

So if some parts in the app are compromised, parts that don't have default access
to the private key but do have access to the DOM, they could **easily steal the private key**
from the DOM the minute it's being attached to it. 

**We believe this is solvable.** Worth a shot.

## Solution

In terms of successfully isolating DOM nodes,[ShadowDOM](https://web.dev/articles/shadowdom-v1) 
technology comes very close to that, and although it 
[isn't designed with security in mind](https://web.dev/articles/shadowdom-v1#:~:text=Note%3A%20Closed%20shadow%20roots%20are%20not%20very%20useful.%20Some%20developers%20will%20see%20closed%20mode%20as%20an%20artificial%20security%20feature.%20But%20let%27s%20be%20clear%2C%20it%27s%20not%20a%20security%20feature.%20Closed%20mode%20simply%20prevents%20outside%20JS%20from%20drilling%20into%20an%20element%27s%20internal%20DOM.), 
it does a pretty good job in isolating subtrees of the DOM from the rest of it.

Therefore, we believe leveraging ShadowDOM while carefully addressing 
[potential security gaps](https://blog.ankursundara.com/shadow-dom/), 
**[LavaDomEncapsulation](https://github.com/lavamoat/lavadome/)** should be 
a **security tool to join the LavaMoat toolbox** to allow developers to implement 
frontend-only components that will aspire to only allow their code and the user to access/interact with,
while not allow similar access to other untrusted JavaScript code in the app.

> Shout-out [@arxenix](https://github.com/arxenix) for his 
> [research](https://blog.ankursundara.com/shadow-dom/) on ShadowDOM security on top 
> of which important security principles were implemented in LavaDome

## Goals

This project follows some core principles to successfully serve the main goals of LavaDome:

### Secure

The most important part here is to make a secure solution, which is why we take ShadowDOM
and wrap it with advanced security properties so that it's safe to present sensitive info in it.

Visit [Security](#Security) to learn more about this effort.

### DX

We want to achieve as simple Developer Experience as possible by:

1. Support as many popular frameworks (React, Angular, etc) as possible;
2. Make the API as easy and simple and easy to use as possible.

### Read - not write

At this stage, we're not going to support write-mode, meaning the content LavaDome
is willing to support is plain text and nothing more complex than that.

This is because supporting write mode - meaning an intractable isolated DOM - introduces
multiple security complications we're not yet ready to face at this point, such as:

1. Event listeners security - prevent outer code from stealing input destined to 
LavaDome inner nodes;
2. Overlay security - prevent malicious code from laying phishing DOM on top of LavaDome,
thus making the user serve sensitive input to the wrong entity;
3. etc - Probably more stuff.



## Design

The design complexity level of this project isn't this high - it's the combination of
the different principles in this project that make it non-trivial 
(see [Security](#Security)).

Nevertheless, it's worth explaining the design in high level by listing the different packages:

### [Core](./packages/core)

Implements the basic API layer that mediates the communication between the consumer and
the protected isolated component. The API aspires to allow as much external manipulation
of the isolated component as possible without providing actual DOM nodes from within it to 
anyone - not even the consumer of LavaDome - to maintain the highest security level possible.

In addition, it takes the responsibility of implementing all necessary security hardening
to make ShadowDOM feature usage truly secure in contrast to its native nature of not
being a security feature by default (see [Security](#Security)).

### [Vanilla](./packages/vanilla) / [React](./packages/react) / etc

Export functionalities for developers to consume LavaDome however they prefer,
whether by vanilla JavaScript or as a React component 
(or any other platform - [ask away!](https://github.com/lavamoat/lavadome/issues/new?title=LavaDome+misses+support+for+...))

> NOTE: Delivering LavaDome support for frameworks integrates third party code
> that is out of our control, which results in "security blank spots" - please
> read the [Security](#Security) section to learn what to do to remain as safe as possible.

## Security

Whether you plan on using LavaDome or just interested in what we're trying to achieve here,
these are the security aspects to be aware of

### ShadowDOM vs iframes

Again, this is still an experimental project, but we did put some thought into this decision.
A natural alternative was leveraging cross-origin iframes. 

The upside to those is that infiltrating a cross-origin iframe is impossible, and is recognized 
as a security critical mechanism by W3C spec, which means that if it gets breached somehow, that 
will be treated as a security vulnerability and will be addressed and fixed by browser vendors urgently.

The downside however, is that integrating an iframe-based solution is significantly harder,
in terms of UI/UX/DX, especially as a tool aimed at mass adoption.

Because eventually, this is about being able to integrate DOM nodes within DOM trees
in the most natural and smooth way - ShadowDOM API is built exactly for that purpose - 
being a DOM oriented API aimed to easily integrate within DOM trees while belonging to
the same realm as the encapsulating DOM tree.

The alleged downside to the ShadowDOM API is that it isn't originally designed for security
goals, but in reality its implementation is introduced in a highly secured manner, not
leaking anything from within it except for very specific scenarios.

We believe that by addressing these scenarios securely and carefully, we can take ShadowDOM
another step closer to being a secured DOM encapsulation API (worth a shot).

### ShadowDOM security gaps

It's important to address the current security threats that do exist with ShadowDOM.

#### Injection

Developers might provide LavaDome with HTML/JS/CSS content that can accidentally or
intentionally leak DOM nodes from within the ShadowDOM when loaded, for example by
adding JavaScript code.

In order to not allow this to happen, LavaDome does not accept DOM nodes, but merely
plain text, as we want to avoid attempting to trust HTML/JS/CSS content.

We'd love to revisit this decision in the future when we research and find a stable and
secure way to achieve that.

#### [window.find()](https://blog.ankursundara.com/shadow-dom/#introducing-windowfind-and-text-selections)

This API allows developers to find and extract DOM nodes by finding some text inside them,
and is the only API that is known (so far) to successfully leak DOM nodes from within a ShadowDOM.

<details>
<summary>
    In Firefox, after finding the text, one can use <code>getSelection()</code> API to
    leak DOM nodes from within the ShadowDOM, thus compromising the whole idea
</summary>
<pre><code>
// defender
const secret = 'AN UNPREDICTABLE SECRET';
const opts = {mode:'closed'};
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
</code></pre>
<img width="800" src="./assets/img2.png" alt="ShadowDOM bypass Firefox"/>
</details>

To defend against that, for starters this means consumer of LavaDome must not
pass predictable content to LavaDome API. This might sound obvious, but developers
can easily be tempted to pass LavaDome something like `The secret is: ldsjf9304rjdkn`,
but that would compromise everything, because even though the `ldsjf9304rjdkn` part clearly
changes, the phrase `The secret is: ` can be exploited to get to the real secret.

Therefore, when using LavaDome, developers MUST only pass it 100% unpredictable text.

<details>
<summary>
    In Chromium, that wouldn't work, but if a selected DOM node within the ShadowDOM
    is <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable">content-editable</a>,
    leveraging <code>document.execCommand('insertHTML', ...)</code> can allow attackers
    run code in the inner scope of the ShadowDOM, and use that to access its DOM nodes
</summary>
<pre><code>
// defender
const secret = 'AN UNPREDICTABLE SECRET';
const opts = {mode:'closed'};
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
    find('Secret is:'); // assuming the Shadow includes predictable text
    // assuming the found node is contenteditable=true
    document.execCommand('insertHTML', false, '<svg/onload=console.log(2,this)>')
    console.log(1, 'stolen secret: ');
});
</code></pre>
<img width="800" src="./assets/img3.png" alt="ShadowDOM bypass Chromium"/>
</details>

To defend against that, LavaDome will apply to its custom elements the highest priority
style possible for `-webkit-user-modify: unset;` so that no elements of it are vulnerable
to injection of malicious outer style making it contenteditable.
Otherwise, malicious outer style applying `-webkit-user-modify:read-write` might
make the ShadowDOM elements contenteditable and vulnerable to this attack vector.

Needless to say that the other technique of using `contenteditable` as an attribute
isn't currently relevant as LavaDome does not support accepting actual DOM nodes by design.

### Defensive coding

Hard to achieve an actual secured solution without writing the code defensively.
This means that all the native APIs we use are cached for internal usage, so that
it isn't possible to reconfigure global APIs to sabotage the legit flow of LavaDome.

If you see some weird code style choices in the sourcecode, there's a good chance it
was done out of having defensive coding in mind.

As long as we remain in the realms of Vanilla JavaScript, defensive coding is something
we can (do our very best to) control.

However, when using the framework versions of LavaDome, this means these 
frameworks aren't defensively written which means the native APIs they make use
of aren't safe from malicious interference - and that is out of LavaDome's control.

Which is why we recommend to always integrate such security solutions with 
[SES](https://github.com/endojs/endo/tree/master/packages/ses#ses) technology by  
[@agoric](https://github.com/agoric) - same as we do at 
[LavaMoat](https://github.com/lavamoat/lavamoat) and 
[MetaMask](https://github.com/MetaMask/metamask-extension).

## Disclaimers

If you read everything above, you should have a good sense of why this is still very 
experimental. Ensuring security to a non-security feature by nature is risky, and this
project is merely an experimental attempt to solve a problem with no current great answer.

You should still use it - because it's probably better than what the web has to offer currently.
But even if it's safer than other solutions, it should not be mistaken for "safe" but rather "safer".