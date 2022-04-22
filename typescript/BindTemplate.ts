/**
 * Facilitation the use of state/binding values
 * in the html, allowing for variable content representation
 * and definitions of default values.
 */

/**
 * Allows the templating system to
 * esealy update values, in the DOM
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
        // Template's content
        let innerContent = document.createTextNode("");

        // Defenition of the default value for the template
        let defaultVariableContent: string;
        if (typeof this.getAttribute('@default') === 'string') {
            defaultVariableContent = this.getAttribute('@default') as string;
        } else {
            defaultVariableContent = "";
        }

        // Defenition of the given value for the template
        let variableValue: string | undefined
        if (typeof this.getAttribute('@value') === 'string') {
            variableValue = this.getAttribute('@value') as string;
        }

        // Add the elements to shadow root
        innerContent.textContent = variableValue || defaultVariableContent
        shadowRoot.appendChild(innerContent);
    }

    /**
     * Allows the template to change it's inner value
     * to a new specefied one
     * @param {any} new_value The new value to insert in the template
     */
    public updateInnerValue = (new_value: any) => {
        (this.shadowRoot as ShadowRoot).replaceChildren(
            document.createTextNode(new_value)
        );
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
