import * as mini from '../src/mini.js';

window.app = mini.newMini({
    entry: 'app',
    store: {
        state1: 1,
        state2: 4,
        state3: 'Hello',
        state5: '#ffbaa0',
        num1: 0,
        num2: 0,
        result: 0,
    },
    actions: {
        removeComponent: {
            target: '_',
            do: async() => {
                let x = await mini.getComponentContent('./component.html');
                document.getElementById('22')
                    .parentNode.replaceWith(x.compo);
                document.dispatchEvent(x.event);
            },
        },
        ss: {
            target: '_',
            do: () => console.log('Something cool'),
        },
        sumTwoNumbers: {
            target: 'result',
            do: (state, stateResult) => {
                const value1 = state.num1;
                const value2 = state.num2;
                console.log(`O valor da appState: ${app.store.result}`);
                stateResult = Number(value1) + Number(value2);
                return stateResult;
            },
        },
        docWrite: {
            target: '_',
            do: () => {
                console.log('Here');
            },
        },
        addOne: {
            target: 'state1',
            do: (_, targ) => {
                return ++targ;
            },
        },
        '2x': {
            target: 'state2',
            do: (_, targ) => {
                return (targ *= 2);
            },
        },
        spaceOutLetters: {
            target: 'state3',
            do: (_, targ) => {
                targ = targ.split('')
                    .join(' ');
                return targ;
            },
        },
    },
    debug: false,
});