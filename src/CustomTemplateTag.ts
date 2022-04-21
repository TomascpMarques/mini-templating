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


        // let componentIframe = document.createElement('iframe');
        // componentIframe.setAttribute('src', componentLocation);

        // componentIframe.width = "100%";
        // componentIframe.onload = function () {
        //     if (componentIframe.contentWindow) {
        //         componentIframe.height =
        //             (componentIframe.contentWindow.document.body.scrollHeight as number) +
        //             35 + "px";
        //         componentIframe.contentWindow.document.body.style.padding = "0";
        //         componentIframe.contentWindow.document.body.style.margin = "0";
        //     }
        // }
        // componentIframe.style.border = "none";

        // shadowRoot.appendChild(document.createTextNode(componentIframe.contentDocument?.body.innerHTML as string));
        console.log(`[COMPO] The component has been created`);
    }
}