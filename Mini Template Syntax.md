# Mini Templating Syntax

## Current Functional Features

- Value binding;
- State actions;
- Action handeling;
- Value updating

## Create a new Mini App

### **Initial Mini Import**

First just import the script file **right in the head section**
of the document, this will allow you to use _Mini_ later in the body
section of the document.

```HTML
   <head>
       ...
       <script src="./../dist/mini.js">
           </script>
   </head>
```

> Import Mini into the document.

---

Next, at the end section of the body section, declare the script
secction or import you _Mini_ app file.

In the body script section, create the a new mini app

```HTML
   <body>
       <main name='Mini App' id='app'>
           <!-- Future Html markup -->
       </main>

       <script>
           const newApp = newMini(
            /**
             * The configs will be explained
             * in the next section.
            */
           );
       </script>
   </body>
```

> Define the basic makrup/script structure of the page.

---

Now we will define the configurations for the new application.
These configs hold the state of the application, it's entry point and the actions the app recognizes.

**Those configurations are:**
| Name | Type | Example |
| ----- | ------------------------ | --------------- |
| entry | String - HTML Element ID | `'app'` or `'Mini'` |
| store | Js Object - String/value pairs | `{ 'loggin': true }` |
| actions | Js Object - String/(target-func) pairs | `{'logout': {'target': 'login}, 'do': (t) => {return !t}}` |
| debug | Boolean | `true` or `false` |

### **Example cofiguration**

### **Body tag app section**

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
         src="js/app.js"
        ></script>
   </body>
```

#### **Body script tag**

```JavaScript
    import * as mini from '@sum_sum/mini-templating';

    window.app = mini.newMini(
        'entry': 'app',
        'store': {
            'number': 1
        },
        'actions': {
            'addOne' : {
                'target': 'number1',
                /*  The first parameter is app state
                    The second parameter is the target  */
                do: (_, t) => { return ++t }
            },
            'logHello' : {
                /* This action targets no state, and mutates no state */
                'target': '_',
                do: () => { console.log('Hello!) }
            }
        },
        'debug': false,
    );
```

---

## Components

### Intro

Components in mini are **directly inserted to the DOM**, they also share
the global app state. By sharing the state this way no bubblig of events
or dispatching, and or passing state to/through parent components is needed.

### Component Creation

The component in itself is just a container HTML tag, such as **div** or
**section**. The html file is then read and inserted into the DOM.

### Component Example

A simple component, that will work with the [previous example](#body-script-tag), will be the following.

```HTML
<div>
    <h2>Lorem, ipsum.</h2>
    <hr>
    <h4 id="sub_title">Lorem ipsum dolor sit amet consectetur.</h4>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
        <mark>Commodi nostrum</mark> , illo fuga repudiandae.
    </p>
    <q id="sss" @bind>Some state change {{@state1}}</q>
    <button onclick="app.handle('addOne')">Press Me</button>
</div>
```

The component inclusion in the main HTML file is as follows:

```HTML
<mini-component src="./component.html"> </mini-component>
```

The component (_achieved with JS's [customElement](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements))_ will handle the creation of content, emitting an event that will assure all state listeners are accounted for.
