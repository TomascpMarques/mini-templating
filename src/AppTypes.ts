
/**
 * Holds html element state as a <any> value.
 * The state is stored in a key-value dictionary.
 */
type StateStore = {
    [key: string]: any;
};

/**
 * Keeps track of the elements bindings to values
 * of other elements;
 * It's stored in a key-value dictionary. (binder): (...binds)
 */
type ValueBindings = {
    [key: string]: Set<string>;
};

/**
 * Represents actions an element can call
 * that will be applied to a target.
 */
type Action = {
    target: string;
    do: (context?: Object) => void;
};

/**
 * ValueBinder aggregates value bounded elements
 * to each other, and functions related to
 * the management of those bindings
 */
interface ValueBinder {
    // The values that have binded to another elements value
    // stored in the key-value dictionary (id): Set(binders)
    bindings: ValueBindings;

    /**
     * @param {string} id The id of the src value holder
     * @return {Set<string>} The value binded elements
     */
    getBindedValues: (id: string) => Set<string> | null;

    /**
     * @param {string} src_id The id of the src value holder
     * @param {string[]} binded_ids The ids of the value binded elements
     */
    addValueBind: (src_id: string, ...binded_ids: string[]) => Error | null;
}

/**
 *  StateHolder will hold state in a key-value pair, any value
 *  will be stored, and they will relate to anything you pass
 */
interface StateHolder {
    // A way to store id associated state, by a key value pair
    store: StateStore;

    /**
     * Gets held state by a given id
     * @param {string} id the id of state holder
     * @return {{ holder: string, state: any}} the held state
     */
    getStateByID: (id: string) => { holder: string; state: any };

    /**
     * @param {string} id the id of the new state holder
     * @return {Error} If can't add the state to the store
     *                 return an error
     */
    setStateByID: (id: string) => Error | null;
}

/**
 * The application needs to be given store and value bindings
 * so it can update the page. In this way, the object has all the necessary
 * configurations for instanciating the app.
 */
type ApplicationSetupConfigs = {
    entry: string;
    appState: StateStore;
    actions: { [key: string]: Action };
    debug: boolean;
};

const hello_world = () => {
    console.log('HelloWorld!');
};
