

/**
 * Builds a new mini app, given the configurations for its initialization
 * @param {ApplicationSetupConfigs} configs _mini_ application setup configuration
 * @returns {App} A new mini app **ready to use**
 */
export const newMini = (configs: ApplicationSetupConfigs): App => {
    return new App(configs);
};

export const getComponentContent = async (componentLocation: string) => {
    return await fetch(componentLocation).then(content => content.text()).then(content => {
        let innerContent: HTMLElement = document.createElement('section');
        innerContent.innerHTML = content || '<b>No Component Content</b>';
        let event =
            new CustomEvent(
                'custom-compo-build',
                { bubbles: true, detail: { text: () => componentLocation } }
            );
        return { compo: innerContent, event: event };
    });
};