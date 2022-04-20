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


        componentIframe.width = "100%";
        componentIframe.onload = function () {
            if (componentIframe.contentWindow) {
                componentIframe.height =
                    (componentIframe.contentWindow.document.body.scrollHeight as number) +
                    31 + "px";
                componentIframe.contentWindow.document.body.style.padding = "0";
                componentIframe.contentWindow.document.body.style.margin = "0";
            }

            let script = document.createElement('script');

            script.src = Array.from(componentIframe.ownerDocument.scripts).filter(x => x.src.split('/').pop() == 'mini.js').pop().src as string;
            componentIframe.contentDocument?.head.append(document.createElement('script').src = );

            script = document.createElement('script');

            script.textContent = Array.from(componentIframe.ownerDocument.scripts).pop()?.textContent as string;
            componentIframe.contentDocument?.body.append(script);
        }
        componentIframe.style.border = "none";




        shadowRoot.append(componentIframe);
    }
}