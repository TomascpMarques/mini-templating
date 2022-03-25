class CustomElement extends HTMLElement {
    constructor() {
        super();
        // let shadowRoot = this.attachShadow({ mode: 'open' });

        let componentLocation: string = '';
        if (this.hasAttribute('src'))
            componentLocation = this.getAttribute('src') as string;

        // fetch component content
        fetch(componentLocation)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to read component file: ${componentLocation}`);
                }
                return response.text()
            })
            .then(data => {
                this.innerHTML = data;
                console.log(`The data is: ${data}`);
            });


        // // Template's content
        // let innerContent = document.createTextNode("");

        // // Defenition of the default value for the template
        // let defaultVariableContent: string;
        // if (typeof this.getAttribute('@default') === 'string') {
        //     defaultVariableContent = this.getAttribute('@default') as string;
        // } else {
        //     defaultVariableContent = "";
        // }

        // // Defenition of the given value for the template
        // let variableValue: string | undefined
        // if (typeof this.getAttribute('@value') === 'string') {
        //     variableValue = this.getAttribute('@value') as string;
        // }

        // // Add the elements to shadow root
        // innerContent.textContent = variableValue || defaultVariableContent
        // shadowRoot.appendChild(innerContent);
    }
}