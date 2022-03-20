# Mini Templating Syntax

## Current Functional Features

- Value binding;
- State actions;
- Action handeling;
- Value updating

<br>

## Create a new Mini App

---

### **Initial Mini Import**

First just import the script file **right in the head section**
of the document, this will allow you to use _Mini_ later in the body
section of the document.

> Import Mini into the document.

```HTML
   <head>
       ...
       <script src="./../dist/mini.js">
       </script>
   </head>
```

---

Next, at the end section of the body section, declare the script
secction or import you _Mini_ app file.

In the body script section, create the a new mini app

> Define the basic makrup/script structure of the page.

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

---

Now we will define the configurations for the new application.
These configs hold the state of the application, it's entry point and the actions the app recognizes.

**Those configurations are:**
| Name | Type | Example |
| ----- | ------------------------ | --------------- |
| entry | String - HTML Element ID | `'app'` or `'Mini'` |
| appState | Js Object - String/value pairs | `{ 'loggin': true }` |
| actions | Js Object - String/(target-func) pairs | `{'logout': {'target': 'login}, 'do': (t) => {return !t}}` |
| debug | Boolean | `true` or `false` |

<br>

### **Example cofiguration**

```HTML
   <body>
       <main name='Mini App' id='app'>
           <button id='bt1'>Add 1</button>
           <p @bind>The value is: {{@number}}.</p>
           <!--
               On body ready: « The value is: 1. »
               After pressing bt1: « The value is: 2. »
            -->
       </main>

       <script>
            // Define new App
            // -> entry point <main id='app'>
           const newApp = newMini(
            'entry': 'app',
            'appState': {
                'number': 1
            },
            'actions': {
                'addOne' : {
                    'target': 'number1',
                    'do': (t) => { return ++t }
                }
            },
            debug: false,
           );
       </script>
   </body>
```
