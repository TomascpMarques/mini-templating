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

        if (typeof temp !== "string") {
            throw new Error(
                '[mini-debug] Error: The application entry point (html element id) is not valid'
            );
        }

        this.app_entry = temp as string;
        if (this.#debugging)
            customMessage(
                'mini-debug',
                {
                    'New app entry point': this.app_entry
                }
            )

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
        this.store = config.appState;
        this.actions = config.actions;
        this.setupBindedValues();

        if (this.#debugging) {
            customMessage(
                'mini-debug',
                {
                    'App value bindings': JSON.stringify(this.bindings),
                    'App value/state store': JSON.stringify(this.store),
                    'App actions': JSON.stringify(this.actions),
                }
            )
        }

    }

    public handle = (action: string) => {
        if (!this.actions[action]) {
            let err_mss = `[mini-debug] Error: The given action <${action}> is not registered`;
            throw new Error(err_mss);
        }
        /* State initialization is left to the user */
        let target_id = this.actions[action].target;
        let target = this.getStateByID(target_id);
        let action_do_result: any;

        if (typeof this.getStateByID(target_id) !== 'undefined') {
            action_do_result = this.actions[action].do(target);
        }
        else {
            throw new Error(`[mini-debug] Error: The given state is not valid: <${target}>`);
        }

        // Debug
        if (this.#debugging) {
            customMessage(
                'mini-debug',
                {
                    'Handle Target': target_id,
                    'Target state changes': action_do_result
                }
            );
        }

        // Handle valaue/state changes in DOM
        this.setStateByID(target_id, action_do_result);
        this.updateStateListener(target_id);

        if (this.#debugging) {

            console.log('[mini-debug] App value/state store:\n');
            console.table(this.store);
        }
    };

    private updateStateListener = (src_id: string) => {
        if (this.#debugging) {
            customMessage(
                'mini-debug',
                {
                    'Updating state listners for': src_id,
                    'State listners for': Object.keys(this.bindings)
                }
            )
        }

        const listners = Array.from(
            (document.querySelector('#app') as HTMLElement)
                .getElementsByTagName('mini-var')
        ).filter(x => x.getAttribute('@react') === src_id);

        listners.forEach(e =>
            (e as MiniTemplate)
                .updateInnerValue(this.getStateByID(src_id))
        );

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
            customMessage(
                'mini-debug',
                {
                    'App entry point is': this.app_entry
                }
            );

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
                customMessage(
                    'mini-debug',
                    {
                        'Message': 'The binded values table'
                    }
                )
                console.table(filteredValues);
            }

            filteredValues.forEach(value => {
                let templateDefined = `<${template} @react="${value}" @value="${this.getStateByID(value)}"></${template}>`;
                binded.innerHTML = binded.innerHTML
                    .replace(
                        /{{@\w+}}/gm,
                        templateDefined
                    );

                this.addValueBind(value, `@${value}`)
                if (this.#debugging) {
                    customMessage(
                        'mini-debug',
                        {
                            'Generated a <mini-var>': templateDefined,
                        }
                    );
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
            let err_mss =
                `[mini-debug] Error: The new bindings <${binded_ids.join(' + ')}> were not added`;
            if (!this.bindings[src_id].has(id))
                new Error(err_mss);
        });

        return null;
    };

    public getStateByID = (id: string) => {
        return this.store[id];
    };

    public setStateByID = (id: string, value: any) => {
        // if (document.getElementById(id) === null) {
        //     let err_mss = `[mini-debug] Error: The given element <${id}> does not exist`;
        //     throw new Error(err_mss);
        // }

        if (this.#debugging) {
            customMessage(
                'mini-debug',
                {
                    'Setting state of': id,
                }
            );
            customMessage(
                'mini-debug',
                {
                    'State': id,
                    'Value': value,
                }
            );
        }

        this.store[id] = value;
        return null;
    };
}
