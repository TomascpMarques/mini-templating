"use strict";var _App_debugging,_App_customTags,__classPrivateFieldSet=this&&this.__classPrivateFieldSet||function(e,t,i,s,a){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===s?a.call(e,i):a?a.value=i:t.set(e,i),i},__classPrivateFieldGet=this&&this.__classPrivateFieldGet||function(e,t,i,s){if("a"===i&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!s:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?s:"a"===i?s.call(e):s?s.value:t.get(e)};class App{constructor(e){var t;this.binderAtributte="@bind",this.valueBidedAttribute="@value",_App_debugging.set(this,void 0),_App_customTags.set(this,{}),this.bindings={},this.store={},this.setUpOnChangeEventForValuedElements=()=>{Array.from(document.getElementById(this.app_entry).getElementsByTagName("*")).filter((e=>e.hasAttribute("@value"))).map((e=>{var t;const i=null===(t=e.getAttribute(this.valueBidedAttribute))||void 0===t?void 0:t.slice(2,-2);e.setAttribute("onchange",`app.updateStateValuesFormBindings(this.value, '${i}')`)}))},this.setUpAbsorberState=()=>{this.setStateByID("_",null)},this.handle=e=>{if(!this.actions[e]){throw new Error(`[mini-debug] Error: The given action <${e}> is not registered`)}let t,i=this.actions[e].target,s=this.getStateByID(i);if(void 0===this.getStateByID(i))throw new Error(`[mini-debug] Error: The given state is not valid: <${s}>`);t=this.actions[e].do(this.store,s),__classPrivateFieldGet(this,_App_debugging,"f")&&miniCustomMessage("mini-debug",{"Handle Target":i,"Target state changes":t}),"_"!==this.actions[e].target&&this.updateStateAndListners(i,t),__classPrivateFieldGet(this,_App_debugging,"f")&&(console.log("[mini-debug] App value/state store:\n"),console.table(this.store))},this.valueUpdateStdHTMLElements=e=>{const t=Array.from(document.getElementById(this.app_entry).getElementsByTagName("*")).filter((t=>t.hasAttribute(this.binderAtributte)&&t.getAttribute(this.valueBidedAttribute)===`{{${e}}}`&&t.tagName.toLowerCase()!==__classPrivateFieldGet(this,_App_customTags,"f").template));console.log("-> Current src_id: "+e),t.forEach((t=>{if(console.log("Current Element: "+t.tagName),"textarea"===t.tagName.toLowerCase())t.value=t.innerHTML.split(" ").map((e=>{const t=e.match(/\{\{\@\w+\}\}/gm);if(null!==t){let i=t[0].slice(3,-2);e=e.replace(/\{\{\@\w+\}\}/gm,this.getStateByID(i))}return e})).join(" ");else t.setAttribute("value",this.getStateByID(e))}))},this.updateStateValuesFormBindings=(e,t)=>{this.setStateByID(t,e),this.updateStateListener(t)},this.updateStateListener=e=>{__classPrivateFieldGet(this,_App_debugging,"f")&&(miniCustomMessage("mini-debug",{"The app_entry poins is ":this.app_entry}),miniCustomMessage("mini-debug",{"Updating state listners for":e,"State listners for":Object.keys(this.bindings)}));Array.from(document.getElementById(this.app_entry).getElementsByTagName("mini-var")).filter((t=>t.getAttribute("@react")===e)).forEach((t=>t.updateInnerValue(this.getStateByID(e)))),this.valueUpdateStdHTMLElements(e)},this.valueBindingsForStdHTMLElements=()=>{Array.from(document.getElementById(this.app_entry).getElementsByTagName("*")).filter((e=>e.hasAttribute(this.valueBidedAttribute))).forEach((e=>{miniCustomMessage("mini-debug",{"stdHTMLElement tag type":e.tagName});const t=e.getAttribute(this.valueBidedAttribute).slice(2,-2).toString();if("textarea"===e.tagName.toLowerCase())e.value=e.value.replace(/\{\{\@\w+\}\}/gm,this.getStateByID(t));else e.setAttribute("value",this.getStateByID(t))}))},this.setupBindedValues=()=>{__classPrivateFieldGet(this,_App_debugging,"f")&&miniCustomMessage("mini-debug",{"App entry point is":this.app_entry}),this.valueBindingsForStdHTMLElements();let e=Array.from(document.getElementById(this.app_entry).getElementsByTagName("*"));e=e.filter((e=>e.hasAttribute(this.binderAtributte))),e.forEach((e=>{const t=__classPrivateFieldGet(this,_App_customTags,"f").template,i=e.textContent.match(/{{@\w+}}/gm);if(void 0===i)return;const s=null==i?void 0:i.map((e=>e.slice(3,-2))).filter((e=>e.match(/^\w+$/gm)));__classPrivateFieldGet(this,_App_debugging,"f")&&(miniCustomMessage("mini-debug",{Message:"The binded values table"}),console.table(s)),s&&s.forEach((i=>{let s=`<${t} @react="${i}" @value="${this.getStateByID(i)}"></${t}>`;__classPrivateFieldGet(this,_App_debugging,"f")&&(miniCustomMessage("mini-debug",{"Current Value":i,"Processed Template":s}),miniCustomMessage("mini-debug",{"Previous innerHTML":e.innerHTML}));const a=new RegExp(`{{@${i}}}`,"gm");"textarea"===e.tagName.toLowerCase()?e.value=e.value.replace(a,this.getStateByID(i)):e.innerHTML=e.innerHTML.replace(a,s),this.addValueBind(i,`@${i}`),__classPrivateFieldGet(this,_App_debugging,"f")&&miniCustomMessage("mini-debug",{"Generated a <mini-var>":s,"For state":i})}))}))},this.getBindedValues=e=>this.bindings[e]||null,this.addValueBind=(e,...t)=>(this.bindings[e]||(this.bindings[e]=new Set),t.forEach((t=>this.bindings[e].add(t))),t.forEach((i=>{let s=`[mini-debug] Error: The new bindings <${t.join(" + ")}> were not added`;this.bindings[e].has(i)||new Error(s)})),null),this.getStateByID=e=>this.store[e],this.setStateByID=(e,t)=>(__classPrivateFieldGet(this,_App_debugging,"f")&&(miniCustomMessage("mini-debug",{"Setting state of":e}),miniCustomMessage("mini-debug",{State:e,Value:t})),this.store[e]=t,null),__classPrivateFieldSet(this,_App_debugging,e.debug,"f"),document.addEventListener("custom-compo-build",(()=>{this.setupBindedValues(),this.setUpOnChangeEventForValuedElements()}),!1);let i=null===(t=document.getElementById(e.entry))||void 0===t?void 0:t.id;if("string"!=typeof i)throw new Error("[mini-debug] Error: The application entry point (html element id) is not valid");this.app_entry=i,__classPrivateFieldGet(this,_App_debugging,"f")&&miniCustomMessage("mini-debug",{"New app entry point":this.app_entry}),customElements.define("mini-basic",Mini),customElements.define("mini-var",MiniTemplate),customElements.define("mini-component",CustomElement),__classPrivateFieldSet(this,_App_customTags,{basic:"mini-basic",template:"mini-var",component:"mini-component"},"f"),this.store=e.store,this.setUpAbsorberState(),this.actions=e.actions,this.setupBindedValues(),this.setUpOnChangeEventForValuedElements(),__classPrivateFieldGet(this,_App_debugging,"f")&&miniCustomMessage("mini-debug",{"App value bindings":JSON.stringify(this.bindings),"App value/state store":JSON.stringify(this.store),"App actions":JSON.stringify(this.actions)})}updateStateAndListners(e,t){this.setStateByID(e,t),this.updateStateListener(e)}}_App_debugging=new WeakMap,_App_customTags=new WeakMap;
"use strict";const hello_world=()=>{console.log("HelloWorld!")};
"use strict";class MiniTemplate extends HTMLElement{constructor(){super(),this.updateInnerValue=t=>{this.shadowRoot.replaceChildren(document.createTextNode(t))};let t,e,r=this.attachShadow({mode:"open"}),d=document.createTextNode("");t="string"==typeof this.getAttribute("@default")?this.getAttribute("@default"):"","string"==typeof this.getAttribute("@value")&&(e=this.getAttribute("@value")),d.textContent=e||t,r.appendChild(d)}}class Mini extends HTMLElement{constructor(){super();let t=this.attachShadow({mode:"open"}),e=document.createElement("div");e.setAttribute("id","yes"),e.setAttribute("class","bordered");let r=document.createElement("p");r.setAttribute("style","color:red;");let d=this.getAttribute("ptext");r.innerText=d;let i=document.createElement("style");i.textContent=String.raw`
        .bordered {
            padding: 0.2rem;
            color: #333333;
            border: 2px solid blueviolet;
        }
        `,t.appendChild(i),t.appendChild(e),e.appendChild(r)}}
export const newMini=n=>new App(n);
"use strict";class CustomElement extends HTMLElement{constructor(){super();let t="";this.hasAttribute("src")&&(t=this.getAttribute("src")),fetch(t).then((t=>t.text())).then((e=>{let n=document.createElement("section");n.innerHTML=e||"<b>No Component Content</b>",this.replaceWith(n),document.dispatchEvent(new CustomEvent("custom-compo-build",{bubbles:!0,detail:{text:()=>t}}))})),console.log("[COMPO] The component has been created")}}
"use strict";const miniCustomMessage=(o,e)=>{let c=`%c[${o}]%c\n`,n=`${"-".repeat(o.length)} `,s="";Object.keys(e).forEach((o=>s+=`${o}: ${e[o]}\n`)),console.log(c+(n+"\n%c")+s,"color: orange","color: salmon","color:white")};
