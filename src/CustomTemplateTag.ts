class CustomElement extends HTMLElement {
    constructor() {
        super();

        // let shadowRoot = this.attachShadow({ mode: 'open' });

        // console.log("The name:", this.getAttribute('src')?.match(/\w+\.html/gm)?.toString())
        let componentLocation: string = '';
        if (this.hasAttribute('src'))
            componentLocation = this.getAttribute('src') as string;

        fetch(componentLocation).then(content => content.text()).then(text => {
            let innerContent: HTMLElement = document.createElement('section');
            innerContent.innerHTML = text || '<b>No Component Content</b>';
            this.replaceWith(innerContent)
        });
        console.log(`[COMPO] The component has been created`);
    }
}