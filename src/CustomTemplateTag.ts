class CustomElement extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: 'open' });

        console.log(`[COMPO] The component has been created`);

        let componentLocation: string = '';
        if (this.hasAttribute('src'))
            componentLocation = this.getAttribute('src') as string;

        let componentIframe = document.createElement('iframe');
        componentIframe.setAttribute('src', componentLocation);
        shadowRoot.append(componentIframe);
    }
}