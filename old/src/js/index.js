"use strict";

const addButton = (self, buttonTitle) => {
    console.log(`${self.value} -> message: ${buttonTitle}`);

    const butt = document.createElement("button");
    const node = document.createTextNode(`${buttonTitle}`);
    butt.appendChild(node);
    butt.innerText = buttonTitle;

    const s = document.createElement('button', { is: 'custom-button' });
    s.onmouseenter = () => {
        s.style = 'a b';
    }

    document.getElementById("app").appendChild(butt);
    document.getElementById("app").appendChild(s);
};

class CustomButton extends HTMLButtonElement {
    constructor(title, id) {
        super();
        this.title = title;
        this.id = id;
        this.innerText = "SUPER";
    }
}

let stateHolder = {};
let stateListenHolder = {};
let bindedValues = {};

const updateStateListener = (src) => {
    stateListenHolder[src].forEach((x) => {
            console.log(
                `cccc: ${x}\n` +
                `aaaa: ${document.getElementById(x).innerHTML}\n` +
                `bbbb: ${stateHolder[src].value}`
            );
            document.getElementById(x).innerHTML =
                document.getElementById(x).innerHTML.replace(
                    /<var>(.+|)<\/var>/gm,
                    `<var>${stateHolder[src].value}</var>`
                );
        })
        // console.log(bindedValues);
    Array.from(bindedValues[src]).forEach((element) => {
        console.log(`-> ${element} ` + document.getElementById(element).innerHTML.match(/<var>(.+|)<\/var>/gm));

        document.getElementById(element).innerHTML =
            document.getElementById(element).innerHTML.replace(
                /<var>(.+|)<\/var>/gm,
                `<var>${stateHolder[src].value}</var>`
            );
    });
}

const run = (actor) => {
    let target = document.getElementById(actor.target);
    stateHolder[actor.target] = target
    actor.do(
        target
    );
    console.log(`Target state: ${stateHolder[actor.target].value}`);
    updateStateListener(actor.target)
};

const check = () => {
    let x = document
        .getElementById('app').children;
    for (let i = 0; i < x.length; i++) {
        if (x.item(i).getAttribute('bind')) {
            let bindedTo = x.item(i).getAttribute('bind');
            console.log("HERE")
            if (bindedValues[bindedTo]) {
                bindedValues[bindedTo].add(x.item(i).id);
                continue;
            }
            bindedValues[bindedTo] = new Set();
            bindedValues[bindedTo].add(x.item(i).id);
        }
    };

    console.log(bindedValues)
};

const setListeners = (...subs) => {
    subs.forEach(sub => {
        stateListenHolder[sub.src] = sub.subscribers;
        console.log(stateListenHolder[sub.src]);
    })
}

// const listen = (subs) => {
// 	subs.subscribers.forEach(sub => {
// 		console.log(sub)
// 		console.log(document.getElementById(sub))
// 	});
// };

customElements.define('custom-button', CustomButton, { extends: 'button' });