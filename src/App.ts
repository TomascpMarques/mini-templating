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
            miniCustomMessage(
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
            miniCustomMessage(
                'mini-debug',
                {
                    'App value bindings': JSON.stringify(this.bindings),
                    'App value/state store': JSON.stringify(this.store),
                    'App actions': JSON.stringify(this.actions),
                }
            )
        }
    }

    /**
     * Runs an action against a target
     * @param {string} action Action to run name
     */
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
            miniCustomMessage(
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

    private valueUpdateStdHTMLElements = (src_id: string) => {
        const regularTagListners = Array.from(
            (document.getElementById(this.app_entry) as HTMLElement)
                .getElementsByTagName('*')
        ).filter(
            x => x.hasAttribute('@bind') || x.getAttribute('@value') === `{{${src_id}}}`
                && x.tagName.toLowerCase() !== 'mini-var'
        );

        regularTagListners.forEach(element => {
            switch (element.tagName.toLowerCase()) {
                // Fully replace the text-area value with the state
                // no templating yet
                case 'textarea': {
                    (element as HTMLTextAreaElement).value =
                        (element as HTMLTextAreaElement).innerHTML.split(' ')
                            .map(currentTxtWord => {
                                const bindersInCurrentWord =
                                    currentTxtWord.match(/\{\{\@\w+\}\}/gm);

                                if (bindersInCurrentWord !== null) {
                                    let bindedState = bindersInCurrentWord[0].slice(3, -2);
                                    currentTxtWord = currentTxtWord.replace(
                                        /\{\{\@\w+\}\}/gm,
                                        this.getStateByID(bindedState)
                                    );
                                }
                                return currentTxtWord;
                            }).join(' ');
                    break;
                };
                default: {
                    element.setAttribute(
                        'value',
                        this.getStateByID(src_id)
                    )
                    break;
                }
            };
        }
        );
    };

    private updateStateListener = (src_id: string) => {
        if (this.#debugging) {
            miniCustomMessage(
                'mini-debug',
                {
                    'The app_entry poins is ': this.app_entry
                }
            )
            miniCustomMessage(
                'mini-debug',
                {
                    'Updating state listners for': src_id,
                    'State listners for': Object.keys(this.bindings)
                }
            )
        }

        // Update template values + + + + + + + + + + + + + + + + +
        const listners = Array.from(
            (document.getElementById(this.app_entry) as HTMLElement)
                .getElementsByTagName('mini-var')
        ).filter(x => x.getAttribute('@react') === src_id);

        listners.forEach(e =>
            (e as MiniTemplate)
                .updateInnerValue(this.getStateByID(src_id))
        );
        // + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // Update regular HTML elements state binded values + + +
        this.valueUpdateStdHTMLElements(src_id);
        // + + + + + + + + + + + + + + + + + + + + + + + + + + + +

        // document.getElementById(src_id)?.addEventListener('input', () => {
        //     setTimeout(() => {
        //         this.updateStateListener(
        //             (document.getElementById(src_id) as HTMLElement).id
        //         );
        //     }, 400);
        // });
    };

    private valueBindingsForStdHTMLElements = () => {
        // Document body std HTML elements value binding attribute value
        // set from state
        let stdHTMLBindedValues = Array.from(
            (document.getElementById(this.app_entry) as HTMLElement)
                .getElementsByTagName('*')
        ).filter(
            elem => elem.hasAttribute('@value')
        );

        stdHTMLBindedValues.forEach(e => {
            miniCustomMessage(
                'mini-debug',
                {
                    'stdHTMLElement tag type': e.tagName,
                },
            );

            const valueBinding =
                (e.getAttribute('@value') as string)
                    .slice(2, -2).toString();

            switch (e.tagName.toLowerCase()) {
                case 'textarea': {
                    (e as HTMLTextAreaElement).value =
                        (e as HTMLTextAreaElement).value.replace(
                            /\{\{\@\w+\}\}/gm,
                            this.getStateByID(valueBinding)
                        );
                    break;
                }
                default:
                    e.setAttribute(
                        'value',
                        this.getStateByID(valueBinding)
                    )
                    break;
            };
        });
    }

    /**
     * The function will setup the applications value bindings
     * between the apps elements, so that reactivity can happen in
     * a on-call fashion, instead of periodically updating the application
     */
    private setupBindedValues = () => {
        if (this.#debugging)
            miniCustomMessage(
                'mini-debug',
                {
                    'App entry point is': this.app_entry
                }
            );

        // Document body std HTML elements value binding
        // attribute value set from state
        this.valueBindingsForStdHTMLElements();

        // Get all the values that specefie a binding
        let bindedElements = Array.from(
            (document.getElementById(this.app_entry) as HTMLElement)
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
                miniCustomMessage(
                    'mini-debug',
                    {
                        'Message': 'The binded values table'
                    }
                )
                console.table(filteredValues);
            }

            filteredValues.forEach(value => {
                let templateDefined = `<${template} @react="${value}" @value="${this.getStateByID(value)}"></${template}>`;
                if (this.#debugging) {
                    miniCustomMessage(
                        'mini-debug',
                        {
                            'Current Value': value,
                            'Processed Template': templateDefined,
                        }
                    );
                    miniCustomMessage(
                        'mini-debug',
                        {
                            'Previous innerHTML': binded.innerHTML
                        }
                    );
                }
                const currentValueTemplateExp = new RegExp(
                    `\{\{\@${value}\}\}`,
                    'gm'
                );

                if (binded.tagName.toLowerCase() === 'textarea') {
                    (binded as HTMLTextAreaElement).value = (binded as HTMLTextAreaElement).value
                        .replace(
                            currentValueTemplateExp,
                            this.getStateByID(value)
                        );
                } else {
                    binded.innerHTML = binded.innerHTML
                        .replace(
                            currentValueTemplateExp,
                            templateDefined
                        );
                }

                this.addValueBind(value, `@${value}`)
                if (this.#debugging) {
                    miniCustomMessage(
                        'mini-debug',
                        {
                            'Generated a <mini-var>': templateDefined,
                            'For state': value,
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
            miniCustomMessage(
                'mini-debug',
                {
                    'Setting state of': id,
                }
            );
            miniCustomMessage(
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
