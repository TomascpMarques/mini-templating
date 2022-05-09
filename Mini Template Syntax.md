# Mini Templating Syntax

## The awsome features

- Value binding;
- State actions;
- Action handeling;
- Value updating

## Create a new project using *Mini*

### **Initial Mini Import**

#### Raw mini.js file usage *(No NPM)*

First thing is, to import the script file **right in the head section**
of the document, this will allow you to use *Mini* later in the body
section of the document.

> Import Mini into the document.

```HTML
   <head>
       ...
       <script src="./../dist/mini.js">
           </script>
   </head>
```

#### Using the NPM package

Here, you can add the package to your project by using NPM or Yarn, choose the tool you fancy most. So now you can run the following commands:

##### NPM

```bash
npm i @sum_sum/mini-templating
```

##### Yarn

```bash
yarn add @sum_sum/mini-templating
```

---

### Mini usage - HTML

#### Using the app script in the HTML file

Now, at the end section of the body tag, declare the script tag or import your *Mini* app js file.

> In the body script section, create the a new mini app

```HTML
   <body>
       <main name='Mini App' id='app'>
           <!-- Future Html markup -->
       </main>

       <script>
           window.app = mini.newMini(
            /**
             * The configs will be explained
             * in the next section.
            */
           );
       </script>
   </body>
```

#### Or, if you fancy using external javascript, you can do the following

```html
<body>
       <main name='Mini App' id='app'>
           <!-- Future Html markup -->
       </main>

       <script type="module" src="app.js>
       </script>
   </body>
```

> Define the basic makrup/script structure of the page.

```javascript
'use strict';

import * as mini from "@sum_sum/mini-templating";

window.app = mini.newMini(
    /**
    * The configs will be explained
    * in the next section.
    * bla, bla, bla...
    */
);
```

---

Now, we will state the configurations for the new mini app.
These configs hold the state of the application, it's entry point in the markup, and the actions that work with state, that the app recognizes.

**Those configurations are:**
| Name | Type | Example |
| ----- | ------------------------ | --------------- |
| entry | String - HTML Element ID | `'app'` or `'Mini'` or `'Apples, etc...'` |
| store | Js Object - String/value pairs | `{ 'loggin': true }` |
| actions | Js Object - String/(target-func) pairs | `{'logout': {'target': 'login'}, 'do': (t) => return !t}` |
| debug | Boolean | `true` or `false` |

### **Example cofiguration**

#### **Body tag app section**

```HTML
   <body>
       <main name='Mini App' id='app'>
           <button id='bt1' onclick="app.handle('addOne')">
                Add 1
           </button>
           <p @bind>The value is: {{@number}}.</p>
           <!--
               On body ready: « The value is: 1. »
               After pressing bt1: « The value is: 2. »
            -->
       </main>
       <script
         type="module"
         src="app.js"
        ></script>
   </body>
```

#### **Body script tag**

```JavaScript
    import * as mini from
        "./node_modules/@sum_sum/mini-templating/src/mini.js";

    window.app = mini.newMini({
        entry: 'app',
        store: {
            state1: 1,
            num1: 0,
            num2: 0,
            result: 0,
        },
        actions: {
            noStateNoTargetFunc: {
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
            addOne: {
                target: 'state1',
                do: (_, targ) => {
                    return ++targ;
                },
            },

        },
        debug: false,
    });
```

---

## Components

### Intro

Components in mini are **directly inserted to the DOM**, replacing the **`<mini-component>`** tag was ocuppying, they also *share the global app state and its actions*. By sharing the state this way, no bubblig of events or dispatching, and or passing state to/through parent components, is needed.

### Component Creation

The component in itself is just a html file, containing a HTML tag at root level, such as **div** or **section**. The html file is then read and inserted into the DOM. The components can also incorporate style, wich is then turned global to the project.

### Component Example

A simple component, that will work with the [previous example](#body-script-tag), will be the following.

```HTML
<div >
    <h2>Component</h2>
    <hr>
    <h4 id="sub_title">Lorem ipsum dolor sit amet consectetur.</h4>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
        <mark>Commodi nostrum</mark> , illo fuga repudiandae provident non mollitia voluptatum corporis adipisci in voluptate labore. Ab totam placeat quos cumque molestiae ipsa repudiandae.
    </p>
    <q @bind>Some {{@state1}}</q>
    <button onclick="app.handle('addOne')">Press Me</button>
</div>
```

One other component example is:

```HTML
<div >
    <h2>Component</h2>
    <hr>
    <h4 id="sub_title">Lorem ipsum dolor sit amet consectetur.</h4>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
        <mark>Commodi nostrum</mark> , illo fuga repudiandae provident non mollitia voluptatum corporis adipisci in voluptate labore. Ab totam placeat quos cumque molestiae ipsa repudiandae.
    </p>
    <q @bind>Some {{@state1}}</q>
    <button onclick="app.handle('addOne')">Press Me</button>
</div>
```

The component inclusion in the main HTML file is as follows:

```HTML
<mini-component src="./component.html"> </mini-component>
```

The component (*achieved with JS's [customElement](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements))* will handle the creation of content, emitting an event that will assure all state listeners are all accounted for.
