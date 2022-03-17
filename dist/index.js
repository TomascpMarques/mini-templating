"use strict";
/*
    1. get the element with the bind
    2. get child <var> element
    3. update the innerHTML of the <var> element

    1. get number of binds in element
    2. get number of vars in element
    3. map each bind to a var by order of occurrence

    1. get elements with value binders
    2. set a listen for changes of value by a limmiting event
    3. update state acording to bindings
*/
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_debugging;
class App {
    constructor(config) {
        var _a;
        //
        this.binder_atributte = '@mini-bind';
        _App_debugging.set(this, void 0);
        this.bindings = {};
        // The state can be accessed by app elements
        // by using the binding atribute in them
        // then the state will be passed to the element/handler-function
        this.store = {};
        this.handle = (action) => {
            if (!this.actions[action]) {
                let err_mss = `[mini] Error: The given action <${action}> is not registered`;
                throw new Error(err_mss);
            }
            /* State initialization is left to the user */
            let target = document.getElementById(this.actions[action].target);
            let target_id = target.id;
            if (target !== undefined)
                this.actions[action].do(target);
            else {
                throw new Error(`[mini] Error: The given state is not valid: <${target}>`);
            }
            // Debug
            if (__classPrivateFieldGet(this, _App_debugging, "f"))
                console.log(`Target state changes: <${target}>`);
            // Handle valaue/state changes in DOM
            this.updateStateListener(target_id);
            this.setStateByID(target_id);
            if (__classPrivateFieldGet(this, _App_debugging, "f")) {
                console.log('-> App value/state store:\n');
                console.table(this.store);
            }
        };
        this.updateStateListener = (src_id) => {
            if (__classPrivateFieldGet(this, _App_debugging, "f"))
                console.log(`Updating state listners for: <${src_id}>`);
            Array.from(this.bindings[src_id]).forEach((listner) => {
                if (__classPrivateFieldGet(this, _App_debugging, "f"))
                    console.log('state listener: ' + listner);
                // TESTING ONLY
                // Already know the element exists, so we can drop the null check
                let prev = document.getElementById(listner);
                document.getElementById(listner).innerHTML =
                    prev.innerHTML.replace(/<var>(.+|)<\/var>/gm, `<var>${this.store[src_id].value || this.store[src_id]}</var>`);
                if (__classPrivateFieldGet(this, _App_debugging, "f")) {
                    console.log(`The store key for the replace val: ${src_id}`);
                    console.log(`The value to use in replacement: ${this.store[src_id].value}`);
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
        this.setupBindedValues = () => {
            if (__classPrivateFieldGet(this, _App_debugging, "f"))
                console.log(`The app entry point is: <${this.app_entry}>`);
            Array.from(document.getElementById(this.app_entry).children).map((entry) => {
                let binded = entry.getAttribute(this.binder_atributte);
                if (__classPrivateFieldGet(this, _App_debugging, "f"))
                    console.log(entry);
                if (__classPrivateFieldGet(this, _App_debugging, "f"))
                    console.log('binded _> ' + binded);
                // Check if the current children has a value binding
                if (binded) {
                    // Check if the binding value is already stored
                    if (this.getBindedValues(binded) !== null) {
                        // Adds the new binded item to the current value
                        if (__classPrivateFieldGet(this, _App_debugging, "f"))
                            console.log('entry id _> ' + entry.id);
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
            if (__classPrivateFieldGet(this, _App_debugging, "f"))
                console.log(`[mini-debug] Setting state of: <${id}>`);
            this.store[id] = document.getElementById(id);
            return null;
        };
        __classPrivateFieldSet(this, _App_debugging, config.debug, "f");
        let temp = (_a = document.getElementById(config.entry)) === null || _a === void 0 ? void 0 : _a.id;
        if (__classPrivateFieldGet(this, _App_debugging, "f"))
            console.log(`Temp check: <${temp}>`);
        if (typeof temp !== "string") {
            throw new Error('[mini] Error: The application entry point (html element id) is not valid');
        }
        this.app_entry = temp;
        if (__classPrivateFieldGet(this, _App_debugging, "f"))
            console.log(`New app entry point: <${this.app_entry}>`);
        // Set up of the app entry point
        // Value and state storage
        this.setupBindedValues();
        this.store = config.appState;
        this.actions = config.actions;
        if (__classPrivateFieldGet(this, _App_debugging, "f")) {
            console.log('App value bindings:\n');
            console.table(this.bindings);
            console.log('App value/state store:\n');
            console.table(this.store);
            console.log('App actions:\n');
            console.table(this.actions);
        }
    }
}
_App_debugging = new WeakMap();
const hello_world = () => {
    console.log('HelloWorld!');
};
//# sourceMappingURL=index.js.map