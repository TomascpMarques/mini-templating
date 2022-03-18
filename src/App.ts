class App implements StateHolder, ValueBinder {
    // Class development and debugging values
    readonly binderAtributte: string = '@bind';
    readonly #debugging: boolean;
    #customTags: { [key: string]: string } = {};

    // The value binds are what
    bindings: ValueBindings = {};
    // The state can be accessed by app elements
    // by using the binding atribute in them
    // then the state will be passed to the element/handler-function
    store: StateStore = {};
    app_entry: string;
    actions: { [key: string]: Action; };

    constructor(config: ApplicationSetupConfigs) {
        this.#debugging = config.debug;

        let temp: string | undefined = document.getElementById(config.entry)?.id;
        if (this.#debugging)
            console.log(`Temp check: <${temp}>`);

        if (typeof temp !== "string") {
            throw new Error(
                '[mini] Error: The application entry point (html element id) is not valid'
            );
        }

        this.app_entry = temp as string;
        if (this.#debugging)
            console.log(`New app entry point: <${this.app_entry}>`);

        // TESTING mini-basic tag
        // DEVELOPING Mini custom tags
        customElements.define('mini-basic', Mini);
        customElements.define('mini-var', MiniTemplate);
        this.#customTags = {
            'basic': 'mini-basic',
            'template': 'mini-var',
        };

        // Set up of the app entry point
        // Value and state storage
        this.setupBindedValues();
        this.store = config.appState;
        this.actions = config.actions;

        if (this.#debugging) {
            console.log('App value bindings:\n');
            console.table(this.bindings);
            console.log('App value/state store:\n');
            console.table(this.store);
            console.log('App actions:\n');
            console.table(this.actions);
        }

    }

    public handle = (action: string) => {
        if (!this.actions[action]) {
            let err_mss = `[mini] Error: The given action <${action}> is not registered`;
            throw new Error(err_mss);
        }
        /* State initialization is left to the user */
        let target = document.getElementById(this.actions[action].target);
        let target_id = (target as HTMLElement).id;

        if (target !== undefined)
            this.actions[action].do(target as Object);
        else {
            throw new Error(`[mini] Error: The given state is not valid: <${target}>`);
        }

        // Debug
        if (this.#debugging)
            console.log(`Target state changes: <${target}>`);

        // Handle valaue/state changes in DOM
        this.updateStateListener(target_id);
        this.setStateByID(target_id);

        if (this.#debugging) {
            console.log('-> App value/state store:\n');
            console.table(this.store);
        }
    };

    private updateStateListener = (src_id: string) => {
        if (this.#debugging)
            console.log(`Updating state listners for: <${src_id}>`);

        Array.from(this.bindings[src_id]).forEach((listner) => {
            if (this.#debugging)
                console.log('state listener: ' + listner);
            // TESTING ONLY
            // Already know the element exists, so we can drop the null check
            let prev = document.getElementById(listner) as HTMLElement;
            (document.getElementById(listner) as HTMLElement).innerHTML =
                prev.innerHTML.replace(
                    /<var>(.+|)<\/var>/gm,
                    `<var>${this.store[src_id].value || this.store[src_id]}</var>`
                );
            if (this.#debugging) {
                console.log(`The store key for the replace val: ${src_id}`);
                console.log(
                    `The value to use in replacement: ${this.store[src_id].value}`
                );
            }
        });

        // document.getElementById(src_id)?.addEventListener('input', () => {
        //     setTimeout(() => {
        //         this.updateStateListener(
        //             (document.getElementById(src_id) as HTMLElement).id
        //         );
        //     }, 400);
        // });
    };

    /**
     * The function will setup the applications value bindings
     * between the apps elements, so that reactivity can happen in
     * a on-call fashion, instead of periodically updating the application
     */
    private setupBindedValues = () => {
        if (this.#debugging)
            console.log(`The app entry point is: <${this.app_entry}>`);

        // Get all the values that specefie a binding
        let bindedElements = Array.from(
            (document.querySelector('#app') as HTMLElement)
                .getElementsByTagName('*')
        ).filter(
            element => element.hasAttribute(this.binderAtributte)
        );

        // Changin the template text for the proper mini-<tag>
        bindedElements.forEach(binded => {
            const template = this.#customTags['template'];

            const bindedValues = (binded.textContent as string).match(/{{@\w+}}/gm);
            if (typeof bindedValues === 'undefined') {
                // Skip execution
                return;
            }

            const filteredValues = bindedValues?.map(x => x.slice(3, -2)).filter(x => x.match(/^\w+$/gm)) as string[];
            if (this.#debugging) {
                console.log("[mini] The binded values table: ");
                console.table(filteredValues);
            }

            filteredValues.forEach(value => {
                let templateDefined = `<${template} @value="${value}"></${template}>`;
                binded.innerHTML = binded.innerHTML
                    .replace(
                        /{{@\w+}}/gm,
                        templateDefined
                    );

                if (this.#debugging) {
                    console.log(`[mini] Generated a <mini-var>: "${templateDefined}"`)
                }
            });

        });
    };

    // =================================================================
    public getBindedValues = (id: string) => {
        return this.bindings[id] || null;
    };

    public addValueBind = (src_id: string, ...binded_ids: string[]) => {
        if (!this.bindings[src_id])
            this.bindings[src_id] = new Set<any>();

        binded_ids.forEach((id) => this.bindings[src_id].add(id));

        binded_ids.forEach((id) => {
            let err_mss = `[mini] Error: The new bindings <${binded_ids.join(
                ' + '
            )}> were not added`;
            if (!this.bindings[src_id].has(id))
                new Error(err_mss);
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

        if (this.#debugging)
            console.log(`[mini-debug] Setting state of: <${id}>`);

        this.store[id] = document.getElementById(id) as HTMLElement;
        return null;
    };
}
