"use strict";
class App {
    constructor(config) {
        this.binder_atributte = 'bind';
        this.bindings = {};
        this.store = {};
        this.do = (action) => {
            if (!this.actions[action]) {
                let err_mss = `[mini] Error: The given action <${action}> is not registered`;
                throw new Error(err_mss);
            }
            /* State initialization is left to the user */
            let target = document.getElementById(this.actions[action].target);
            let target_id = target.id;
            this.actions[action].do(target);
            // Debug
            if (this.debugging)
                console.log(`Target state changes: <${target}>`);
            this.updateStateListener(target_id);
            this.setStateByID(target_id);
            if (this.debugging) {
                console.log("-> App value/state store:\n");
                console.table(this.store);
            }
        };
        this.updateStateListener = (src_id) => {
            if (this.debugging)
                console.log(`Updating state listners for: <${src_id}>`);
            Array.from(this.bindings[src_id]).forEach((listner) => {
                if (this.debugging)
                    console.log("state listener: " + listner);
                // TESTING ONLY
                // Already know the element exists, so we can drop the null check
                let prev = document.getElementById(listner);
                document.getElementById(listner).innerHTML = prev.innerHTML.replace(/<var>(.+|)<\/var>/gm, `<var>${this.store[src_id].value || this.store[src_id]}</var>`);
                if (this.debugging) {
                    console.log(`The store key for the replace val: ${src_id}`);
                    console.log(`The value to use in replacement: ${this.store[src_id].value}`);
                }
            });
        };
        /**
         * The function will setup the applications value bindings
         * between the apps elements, so that reactivity can happen in
         * a on-call fashion, instead of periodically updating the application
         */
        this.setupBindedValues = () => {
            Array.from(document.getElementById('app').children).map((entry) => {
                let binded = entry.getAttribute(this.binder_atributte);
                if (this.debugging)
                    console.log(entry);
                if (this.debugging)
                    console.log("binded _> " + binded);
                // Check if the current children has a value binding
                if (binded) {
                    // Check if the binding value is already stored
                    if (this.getBindedValues(binded) !== null) {
                        // Adds the new binded item to the current value
                        if (this.debugging)
                            console.log("entry id _> " + entry.id);
                        this.addValueBind(binded, entry.id);
                        return;
                    }
                    // If no existing binding, create and add the value in the
                    // store
                    this.addValueBind(binded, entry.id);
                }
            });
        };
        // =================================================================
        this.getBindedValues = (id) => {
            return this.bindings[id] || null;
        };
        this.addValueBind = (src_id, ...binded_ids) => {
            if (!this.bindings[src_id])
                this.bindings[src_id] = new Set();
            binded_ids.forEach((id) => this.bindings[src_id].add(id));
            binded_ids.forEach((id) => {
                let err_mss = `[mini] Error: The new bindings <${binded_ids.join(' + ')}> were not added`;
                if (!this.bindings[src_id].has(id))
                    new Error(err_mss);
            });
            return null;
        };
        this.getStateByID = (id) => {
            return this.store[id];
        };
        this.setStateByID = (id) => {
            if (document.getElementById(id) === null) {
                let err_mss = `[mini] Error: The given element <${id}> does not exist`;
                throw new Error(err_mss);
            }
            if (this.debugging)
                console.log(`[mini-debug] Setting state of: <${id}>`);
            this.store[id] = document.getElementById(id);
            return null;
        };
        this.debugging = config.debug;
        // Value and state storage
        this.setupBindedValues();
        this.store = config.appState;
        this.actions = config.actions;
        // Set up of the app entry point
        if (document.getElementById(config.entry) !== null) {
            this.app_entry = document.getElementById(config.entry);
        }
        else {
            throw new Error('[mini] Error: The application entry point (html element id) is not valid');
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
}
const hello_world = () => {
    console.log('HelloWorld!');
};
//# sourceMappingURL=index.js.map