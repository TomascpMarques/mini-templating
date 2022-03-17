/**
 * Facilitation the use of state/binding values
 * in the html, allowing for variable content representation
 * and definitions of default values.
 */

/*
Array.from(document.querySelector('#app').getElementsByTagName('*')).filter(x => x.hasAttribute('@bind'))[0]
*/

class MiniTemplate extends HTMLElement {
    constructor() {
        super();
        /**
         * The tag will have two fields:
         * 1. The value binded to it
         * 2. The default value for the variable conent
         *
         * Tag name: mini-var
        */

        /*
            Callback hooks can provide the context of the content
            between the tags, abilitty to make templates
        */

        /*
            Future implementations of templating might only show this tag in
            compiled code, but in development a text pattern will provide easier
            usage of templating values.
        */

        let shadowRoot = this.attachShadow({ mode: 'open' });

        let wrapper = document.createElement('div');
        wrapper.setAttribute('denomination', 'main')

        let variableContent: string;
        if (typeof this.getAttribute('ptext') === 'string') {
            variableContent = this.getAttribute('ptext') as string;
        } else {
            variableContent = "[mini] Attention: No value was given";
        }

        let p = document.createElement('p');
        p.innerText = variableContent;

        shadowRoot.appendChild(wrapper);
        wrapper.appendChild(p);
    }
}

class Mini extends HTMLElement {
    constructor() {
        super();

        // Allows for js to acces the inner HTML of the element
        // if closed, the further customizations will be difficult
        // to implement
        let shadow_root = this.attachShadow({ mode: 'open' });

        let wrapper = document.createElement('div');
        wrapper.setAttribute('id', 'yes');
        wrapper.setAttribute('class', 'bordered');

        let wrapperInerText = document.createElement('p');
        wrapperInerText.setAttribute('style', 'color:red;');

        let passedText = this.getAttribute('ptext');
        wrapperInerText.innerText = passedText as string;


        let style = document.createElement('style');
        style.textContent = String.raw`
        .bordered {
            padding: 0.2rem;
            color: #333333;
            border: 2px solid blueviolet;
        }
        `;

        shadow_root.appendChild(style);
        shadow_root.appendChild(wrapper);
        wrapper.appendChild(wrapperInerText);
    }
}
