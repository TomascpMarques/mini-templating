/**
 * Allows the templating system to
 * esealy update values, in the DOM
 */
class CustomElement extends HTMLElement {
    constructor() {
        super();

        // Make sure the component content source is
        // available for usage
        let componentLocation: string = '';
        if (this.hasAttribute('src'))
            componentLocation = this.getAttribute('src') as string;

        // Read the component content from an html file
        fetch(componentLocation).then(content => content.text()).then(text => {
            // Create a section html element, with the component content
            let innerContent: HTMLElement = document.createElement('section');
            innerContent.innerHTML = text || '<b>No Component Content</b>';

            // Replace theis customElement with the newlly created element
            // and fire an event to update the value binds
            this.replaceWith(innerContent)
            document.dispatchEvent(new CustomEvent('custom-compo-build', { bubbles: true, detail: { text: () => componentLocation } }));
        }).catch(e => {
            throw new Error(e.message || e);
        });
        // console.log(`[COMPO] The component has been created`);
    }
}
