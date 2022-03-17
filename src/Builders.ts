/**
 * Builds a new mini app, given the configurations for its initialization
 * @param {ApplicationSetupConfigs} configs _mini_ application setup configuration
 * @returns {App} A new mini app **ready to use**
 */
const newMini = (configs: ApplicationSetupConfigs) => {
    return new App(configs);
};