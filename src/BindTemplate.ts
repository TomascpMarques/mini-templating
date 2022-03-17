/**
 * Facilitation the use of state/binding values
 * in the html, allowing for variable content representation
 * and definitions of default values.
 */


class Mini extends HTMLElement {
    constructor() {
        super();

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
