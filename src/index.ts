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

type Action = {
    target: string;
    do: (context?: Object) => void;
};

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

type ApplicationSetupConfigs = {
    entry: string;
    appState: StateStore;
    actions: { [key: string]: Action };
    debug: boolean;
};

class App implements StateHolder, ValueBinder {
    readonly binder_atributte: string = 'bind';
    debugging: boolean;

    bindings: ValueBindings = {};
    store: StateStore = {};
    app_entry: HTMLElement;
    actions: { [key: string]: Action };

    constructor(config: ApplicationSetupConfigs) {
        this.debugging = config.debug;

        // Value and state storage
        this.setupBindedValues();
        this.store = config.appState;
        this.actions = config.actions;

        // Set up of the app entry point
        if (document.getElementById(config.entry) !== null) {
            this.app_entry = document.getElementById(config.entry) as HTMLElement;
        } else {
            throw new Error(
                '[mini] Error: The application entry point (html element id) is not valid'
            );
        }
        if (this.debugging) {
            console.log("App value bindings:\n");
            console.table(this.bindings);
            console.log("App value/state store:\n");
            console.table(this.store);
            console.log("App actions:\n");
            console.table(this.actions);
        }
    }

    public do = (action: string) => {
        if (!this.actions[action]) {
            let err_mss = `[mini] Error: The given action <${action}> is not registered`;
            throw new Error(err_mss);
        }
        /* State initialization is left to the user */
        let target = document.getElementById(
            this.actions[action].target
        );
        let target_id = (target as HTMLElement).id;

        this.actions[action].do(target as HTMLElement);
        // Debug
        if (this.debugging) console.log(`Target state changes: <${target}>`);

        this.updateStateListener(target_id);
        this.setStateByID(target_id);

        if (this.debugging) {
            console.log("-> App value/state store:\n");
            console.table(this.store);
        }
    };

    private updateStateListener = (src_id: string) => {
        if (this.debugging) console.log(`Updating state listners for: <${src_id}>`);

        Array.from(this.bindings[src_id]).forEach((listner) => {
            if (this.debugging) console.log("state listener: " + listner);
            // TESTING ONLY
            // Already know the element exists, so we can drop the null check
            let prev = (document.getElementById(listner) as HTMLElement);
            (document.getElementById(listner) as HTMLElement).innerHTML = prev.innerHTML.replace(
                /<var>(.+|)<\/var>/gm,
                `<var>${this.store[src_id].value || this.store[src_id]}</var>`
            );
            if (this.debugging) {
                console.log(
                    `The store key for the replace val: ${src_id}`
                );
                console.log(
                    `The value to use in replacement: ${this.store[src_id].value}`
                );
            }
        });
    };

    /**
     * The function will setup the applications value bindings
     * between the apps elements, so that reactivity can happen in
     * a on-call fashion, instead of periodically updating the application
     */
    private setupBindedValues = () => {
        Array.from((document.getElementById('app') as HTMLElement).children).map(
            (entry) => {
                let binded = entry.getAttribute(this.binder_atributte);
                if (this.debugging) console.log(entry);
                if (this.debugging) console.log("binded _> " + binded);

                // Check if the current children has a value binding
                if (binded) {
                    // Check if the binding value is already stored
                    if (this.getBindedValues(binded) !== null) {
                        // Adds the new binded item to the current value

                        if (this.debugging) console.log("entry id _> " + entry.id);
                        this.addValueBind(binded, entry.id);
                        return;
                    }
                    // If no existing binding, create and add the value in the
                    // store
                    this.addValueBind(binded, entry.id);
                }
            }
        );
    };

    // =================================================================

    public getBindedValues = (id: string) => {
        return this.bindings[id] || null;
    };

    public addValueBind = (src_id: string, ...binded_ids: string[]) => {
        if (!this.bindings[src_id]) this.bindings[src_id] = new Set<any>();

        binded_ids.forEach((id) => this.bindings[src_id].add(id));

        binded_ids.forEach((id) => {
            let err_mss = `[mini] Error: The new bindings <${binded_ids.join(
                ' + '
            )}> were not added`;
            if (!this.bindings[src_id].has(id)) new Error(err_mss);
        });

        return null;
    };

    public getStateByID = (id: string) => {
        return this.store[id];
    };

    public setStateByID = (id: string) => {
        if (document.getElementById(id) === null) {
            let err_mss = `[mini] Error: The given element <${id}> does not exist`;
            throw new Error(err_mss);
        }

        if (this.debugging) console.log(`[mini-debug] Setting state of: <${id}>`);

        this.store[id] = (document.getElementById(id) as HTMLElement);
        return null;
    };
}

const hello_world = () => {
    console.log('HelloWorld!');
};
