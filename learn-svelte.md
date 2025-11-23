# Svelte
 
## Introduction
Svelte removes unused CSS codes when compiling, so the bundle size stays small and efficient.
Binding a reference in JS to HTML happens when putting the reference in single curly braces in the HTML.

```sveltehtml
<div>{variableName}</div>
<button onclick={functionRef}>{buttonText}</button>
<textarea rows="4" cols="50" value="{description}"></textarea>
```

When binding a value to a component's input or output, the curly braces can be optionally within double quotation.
```sveltehtml
<textarea rows="4" cols="50" value="{description}"></textarea>
<textarea rows="4" cols="50" value={description}></textarea>
```


## Inject and bind HTML code
Syntax:
```html <p>{@html htmlContent}</p>```
Beware of XSS attacks. HTML content should be from a trusted source and be sanitized before injected.  
The `@html` asks svelte to use element.innerHTML to directly add string HTML to DOM.

To sanitize, use a trusted library such as “dompurify”
```shell
npm i dompurify
```
```sveltehtml
<script>
  import DOMPurify from 'dompurify';
  export let stringHtml = '<div style="background: blue;">HTML DOM injection is not recommended!</div>';
  let safeHtml = DOMPurify.sanitize(stringHtml);
</script>
<div>{@html safeHtml}</div>
```

## Dynamic Expression
Svelte uses the labeled statement to allow reactive variables (similar to computed signals and effect in Angular).  
A Labeled statement can be run for any JS statement that should be reevaluated if any variable inside the statement is updated (similar to angular computed signal and effect)  
```js
$: console.log(variable);
```

## Two-way Binding
Curly braces by default provide one way binding: changes in JS updates HTML.  
To make the reverse direction of binding work, we use the “bind” word.
```sveltehtml
<input type="text” bind:value="{personName}" >
```

If the variable name is value:
```sveltehtml
<input type="text” bind:value >
```

The second approach would be to allow an input event.
```sveltehtml
<input type="text” value={personName} on:input=" { (event) => { personName = event.target.value } }” >
```

Every `.svelte` file is called a component.
A component is made of script tags, style tags, and HTML code.  
All scripts, styling, and HTML codes in a component are scoped to the component.
So, for example, styling elements in one component won’t be applied to elements with the same ID or tag in other components.  
Component naming follows Pascal case convention.
Lower case naming is reserved for built-in HTML elements.  
Example:
```sveltehtml
<ContactCard  username="{name}" jobTitle="{jobTitle}" description="{description}" imageUrl="{image}" />
```

The variables which allow being used as input are exported in the component's definition.
```sveltehtml
-- inside ContactCard.svelte file
<script >
  export let username;
  export let jobTitle;
  export let description;
  export let imageUrl;
  // the rest of the code
</script>
```

### Self-Extending Properties
Use self-extending properties if input props variable name and the binding variable name are the same
Example:
```sveltehtml
<ContactCard  username="{name}" {jobTitle} {description} imageUrl="{image}" />
```

### Spread Props
If properties of an object match with the input props variable name, the object can be spread to the component.
Example: in the parent component:
```sveltehtml
<script>
    const product = {
        name: 'Product 1',
        price: 100,
        description: 'Product 1 description'
    };
</script>
<ChildComponent  {...product} />
```
In the child component:
```sveltehtml
<script>
    export let name;
    export let price;
    export let description;
</script>
<div>{name}</div>
<div>{price}</div>
<div>{description}</div>
```

### Optional Props
If a property is not provided in the parent component, the default value will be used.
Example:
```sveltehtml
<script>
    export let name = 'John Doe'; // name is never left undefined, if not provided by the parent component, it will be set to the default value.
</script>
<div>{name}</div>
```

## Select CSS Classes With Conditions
CSS classes can be set dynamically based on a condition.  
Approach one: 
```sveltehtml
<div class=“{condition ? className1 : className2}”>Content</div>
```
Approach two:
```sveltehtml
<div class="className1” class:className2=“{condition}”>Content</div>
```

## Conditions
If a block statement allows conditionally render all HTML lines between `{ #if condition }` and `{ /if }`  
The condition is a JavaScript expression.
```sveltehtml
{ #if condition1 } 
  <div>Condition 1 triggered</div>
{ :else if condition2 } 
  <div>Condition 2 triggered</div>
{ :else } 
  <div>Skipped all conditions</div>
{ /if }
```

## Loops
Loops are implemented using an `each` block in HTML. 
All lines of HTML code between `{ #each array as item }` and `{ /each }` are looped over.  
Accessing index: `{ #each array as item, index }`
The else statement allows rendering an element if the array is empty.
```sveltehtml
{ #each array as item, index } 
  <div>{index}</div> 
  <CustomComponent name={item.name} />
{ :else } 
  <div>Nothing yet to show<div>
{ /each }

```

### Updating a Reference Type Without Using An Equal Sign (Reassignment)
Consider the following conditions in a scenario:
1. A reference type is being updated without using the equal sign. Example: `arr.push(value)`
2. Elements are rendered one per item in the array
Example:
```sveltehtml
<script >
  const values = [1, 2, 3, 4, 5];
  function updateValues() {
    const last = values.length ? values[values.length-1] : 0;
    values.push(last+1);
  }
</script>
<button onclick="{updateValues}">Update Values</button>
{ #each values as value }
  <div>{value}</div>
{ /each }
```

#### Problem
- Since the array is a refence type, Svelte does not understand if it is modified.
- Svelte can only detect assignment as an update.
- As a consequence, the rendered values remains unchanged after array is updated.

#### Solution
- Recreate the referenced variable and use the equal sign. `arr = [...arr, value];`
Example:
```sveltehtml
<script >
  const values = [1, 2, 3, 4, 5];
  function updateValues() {
    const last = values.length ? values[values.length-1] : 0;
    values = [...values, last+1];
  }
</script>
<button onclick="{updateValues}">Update Values</button>
{ #each values as value }
  <div>{value}</div>
{ /each }
```

### Tracking ID in a Loop
Consider the following conditions in a scenario:
1. An array is made of referenced items like JavaScript objects. Example: `const orders = [{madeBy: 'David'}, {madeBy: 'Hossein'}];`
2. The custom component closes on some values. So these values are not given as input.
Example:
```sveltehtml
<script>
  export let madeBy; // this variable can be given a value as input to the component
  let lastTimeRead = Date.now(); // this variable is private and is closed by the instantiation of the component
</script>
```
3. The parent component loops over the array and instantiates the child component once per item in the array.
Example:
```sveltehtml
<script >
  let orders = [{madeBy: 'David'}, {madeBy: 'Hossein'}];
  function removeFirst() {
    orders = orders.slice(1);
  }
</script>
<button onclick="{removeFirst}">Delete First</button>
{ #each orders as order }
  <OrderComponent madeBy="{order.madeBy}" />
{ /each }
```

4. Array can be modified. For example the first item can be removed.

#### Problem
- Array is made of objects, so Svelte does not really know how to uniquely map them to the HTML elements that are rendered.
- If the array size is shrunk, Svelte counts items in the array and remove HTML elements from the end.
- Then Svelte binds the values of each item in the array with the existing rendered elements and rerenders those values in the child component that are changed.
- The first HTML element was previously rendered based on the first item in the array. After removing the first item from the array, the first HTML element is now updated with the second items in the array, which is now became the first item.
- Then the first HTML Element is rendered with new item values being bind and old private values that was made previously.
- Similarly, the second HTML element is rendered with new item values being bind to it and old private values that was made previously.

### Solution
To fix this issue, each item in the loop must present a key to svelte so svelte would have an identifier in hand once the array is modified.
Syntax: `{ #each array as item, index (item.id) }`
Example:
```sveltehtml
{ #each orders as order (order.id)}
  <OrderComponent madeBy="{order.madeBy}" />
{ /each }
```
The key must be uniquely defined so Svelte would know which item in the array is removed, and then it removes the corresponding HTML element from the DOM.  
Providing a unique key allows Svelte no the render an element that does not need any update. This makes the runtime more efficient.

## Modifiers
- Modifiers wrap an event and extend their behaviour. Use pipes to attach a modifier to an event.
### Once
Once allows an event to execute only once.
Example:
```sveltehtml
<button onclick|pipe="{apply}">Apply</button>
```
An alternative approach could be to handle a logic in the `apply` method to make sure the button cannot be used multiple times.

### Passive
Will be explained later

### Capture
Will be explained later

### Stop Propagation
This will prevent multiple events being executed with one trigger.  
For example, if there is a bookmark button inside a clickable UI card, bookmarking is not expected to select the card and open it.  
So one event for the inner button (which is the bookmark button) should be executed and the propagation of the event to the outer button should be prevented.  
```sveltehtml
<button onclick|stopPropagation="{() => bookmark(item)}">Bookmark</button>
```
An alternative approach could be to pass the event to the `bookmark(event)` method and use `event.stopPropagation()` in the bookmark method.

### Prevent Default
There are events that can be triggered based on a default behaviour. The `preventDefault` modifier skip this default behaviour.  
For example, an input of type `submit` ion a form automatically submits a form to a pre-defined destination.
Read more in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)
An alternative approach could be to pass the event to the handling method and use `event.preventDefault()` in that method.


## Multiple Root-Level Components

The `main.js` file usually mounts one main component called the `App` component to the `index.html`.
But there can be multiple components that are independently mounted in the `index.html` file.

### One Component
A typical `main.js` file structure.
```js
import App from './App.svelte';

const app = new App({
  target: document.body
});

export default app;
```

### Multiple Components
This is a great approach if we are not building an SPA, but instead want to add some widget-like elements into a page.  
The `index.html` file:
```html
<!doctype html>
<html>

<body>
    <div id="header"></div>
    <div id="app"></div>
	<script src='build/bundle.js'></script>
</body>
</html>
```

The `main.js` file:
```js
import App from './App.svelte';
import Header from './Header.svelte';

const app = new App({
	target: document.querySelector('#app')
});

const app = new Header({
	target: document.querySelector('#header')
});

export default app;
```

## Emit Events to Parent Components
A child Component can emit an event to its parent component.

### Event Forwarding
A child component can forward an event without handling it directly.

Example: in product item component.
```sveltehtml
<button onclick>Delete</button> 
<button on:click>Add to Cart</button> 
```

```sveltehtml
<Product on:click="{(event) => handle(event)}"/>
```

In the example above, the event handler is not defined.
The product component just forwards the event to its parent component.  
The problem with this approach is that the parent component cannot easily differentiate between the two events.


### Emit Custom Events
A child component can emit a custom event.
It needs to import the `createEventDispatcher` function from the `svelte` module.  
Then it can dispatch an event with a given name and any custom data.

```sveltehtml

<script>
	import { createEventDispatcher } from '../../go/src/github.com/Hesam-Eskandari/svelte/svelte';

	const dispatch = createEventDispatcher();

	function addToCart() {
		dispatch('add-to-cart', anyData);
	}

	function deleteItem() {
		dispatch('delete-product', anyOtherData);
	}
</script>
<button on:click="{addToCart}">Add to Cart</button>
<button on:click="{deleteItem}">Delete</button>
```

Then in the parent component, the event can be handled. The parent receives a browser event where the custom data is stored in the `event.detail` property.
```sveltehtml
<script>
    function addProductToCart(event) {
        const anyData = event.detail;
    }
    function deleteProduct(event) {
        const anyOtherData = event.detail;
    }
</script>
<Product on:add-to-cart={addProductToCart} on:delete-product={deleteProduct}></Product>
```

## Slots
Slots are a way to pass contents (which are nested elements) from a parent component to a child component.
Example:
```sveltehtml
<script>
    import Email from './Email.svelte'; // a custom component
</script>
<Email>
    <p This is the email body, first paragraph</p>
    <p This is the email body, second paragraph</p>
</Email>
```

In the email component, use the `slot` tag to pass the contents.
```sveltehtml
<div>
    <slot />
</div>
```

### Named Slots
A named slot is a slot that can be referenced by its name.
Example: The parent component:
```sveltehtml
<script>
    import Email from './Email.svelte'; // a custom component
</script>
<Email>
    <div slot="body">This is the body of the email</div>
    <div slot="subject">This is the subject of the email</div>
    <div>This is the frowarded email body</div>
    <div>This is the extra content in the body</div>
</Email>
```

The child component:
```sveltehtml
<div class="email-subject">
    <slot name="subject">
        <div>Place holder subject to be shown if the subject is not provided</div>
    </slot>
</div>
<div class="email-body">
    <slot name="body"></slot>
</div>
<div class="email-others">
    <slot></slot>
</div>
```

- The placeholder slot content (aka the default content) is only rendered if the subject content is not provided by the parent component.
- The unnamed slot contains all contents that are not named.

### Slot Props
There are scenarios where the parent component needs to update a content slot based on a condition that exists and
gets updated in the child component.  
So the child component needs to communicate back a value the parent needs to apply changes to the slot based on it.  
Instead of emitting a custom event, tha child component can use slot props.

Example: child component.
```sveltehtml
<script>
  let agreeToc = false;
</script>
<style>
  button { margin: 5px; }
</style>
<div style="background: #CBA">
  This is the child component
  <slot name="toc" isTocAgreed="{agreeToc}"></slot>
  <button on:click="{() => agreeToc = true}">Agree Terms Of Use</button>
</div>

```
In this example, the child component allows the `agreeToc` to be passed to the parent, so the slot can be updated accordingly.  
The parent component:
```sveltehtml
<script >
  import Child from './Child.svelte';
</script>
<style>
  .content { width: 100px; height: 20px; margin: 10px 0; padding: 10px; }
</style>
<div style="background: #ABC">
  This is the parent component
  <Child let:isTocAgreed={accepted}>
    <div class="content" slot="toc" style="background: {accepted ? '#5F5' : '#F55'}">{accepted ? 'Agreed' : 'Not Agreed' }</div>
  </Child>
</div>
```
The `accepted` variable does not need to be declared in the parent component.
It is declared and assigned a value by the HTML code automatically.  

The `isTocAgreed` is a slot prop that is created by the child component and is accessed by the parent.  
This aligns with dependency direction which makes the parent component to be dependent to the child component and not the other way around.

## Life Cycles

### Components Life Cycle
There are three events in the life cycle of a component that run in the following order.

#### Script
The script tag of the components that runs JavaScript from top to bottom.
This step initializes the component.

#### On Mount
The `onMount()` function should be implemented for all works that needs to be done after component's initialization.  
For example, fetching data from API endpoints should be triggered in this step.

#### On Destroy
The `onDestroy()` function should be implemented to process all cleanups before the component is removed from memory.  
Memory cleanup is an example of the work that should be done at this step.

### Component's DOM Update Life Cycle

#### Before Update
The `beforeUpdate()` function should be implemented if a logic should be executed right before DOM updates the component's UI.  
For example, if the state of the DOM should be read before changes, this step can be helpful.  
If for example, a button is clicked, this event triggers after the button click event.

#### After Update
The `afterUpdate()` function should be implemented if a logic should be executed right after the DOM updated the component's UI.  
For example, if the scroll position should be changed after DOM is updated, the logic for it is applied at this step.

#### Tick
The `tick()` runs after the current update to DOM is applied.
`tick()` returns a promise that can be awaited to make sure the subsequent code runs after DOM is updated.  

Example of life cycle hooks:
```sveltehtml

<script>
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from 'svelte';
  
  onMount(() => console.log('onMount'));
  onDestroy(() => console.log('onDestroy'));
  beforeUpdate(() => console.log('beforeUpdate'));
  afterUpdate(() => console.log('afterUpdate'));
  
  console.log('initialization');
</script>
<div>Life Cycle Hooks</div>
```
The Order if items being logged to the console is:
1. initialization
2. beforeUpdate
3. afterUpdate
4. onMount
5. onDestroy: this will print while DOM is removing the component's UI.

All life cycle hooks other than `tick()` must be defined in the initialization level.
They cannot be defined, for example, inside a function executed by a button.

## Bind A Reference To An Element
Use `bind:this={variableName}` to bind a reference to an element.
The reference is a DOM element and is assigned to the `variableName` variable.
Example:
```sveltehtml
<script>
    let inputElement = null;
    function click() {
        console.dir(inputElement);
        console.log(inputElement.value); // the input text
    }
</script>
<input type="text" bind:this={inputElement}>
<button on:click={click}>ShowInput</button>
```

`console.dir()` prints as a JavaScript object.
It is not recommended to update the reference. Use it for a readonly purpose.


## Bind A Reference To A Custom Component
Use `bind:this={variableName}` to bind a reference to a custom component.  
The reference is the component object and is assigned to the `variableName` variable.
Example:
```sveltehtml
<script>
    let compRef = null;
    function click() {
        console.dir(compRef);
        console.log(compRef.calculate()); // calculate is an exported function in the custom component
    }
</script>
<CustomComponent bind:this={compRef} />
button on:click={click}>ShowComponent</button>
```
It is not a common pattern to read a component's public properties or call its public methods using a reference.


## HTTP Requests

### POST Request
Use the JavaScript `fetch()` method to send a POST request.
```sveltehtml
<script >
    let userInput = '';
    let isRequestLoading = false;
    function send() {
        if (!userInput.trim().length) return;
        isRequestLoading = true;
        fetch('url', {
            method: 'POST',
            body: JSON.stringify({userInput}),
            headers: {'Content-Type': 'application/json'}
        }).then(res =>{
            isRequestLoading = false;
            if (!res.ok) throw new Error('No acceptable response is returned');
            return res.json();
        }).catch(err => {
            isRequestLoading = false;
            console.error(err);
        });
    }
</script>
<button on:click="{send}">Send</button>
<input type="text" bind:value="{userInput}">
```

### Get Request
Use the JavaScript `fetch()` method to send a GET request.  
It is not recommended to fetch data in a component's initialization.
Instead, use the `onMount()` function to fetch data. 
```sveltehtml
<script >
    import { onMount } from 'svelte';}
    let isRequestLoading = false;
    
    onMount(() => {
        isRequestLoading = true;
        fetch('url')
                .then(res =>{
                    isRequestLoading = false;
                    if (!res.ok) throw new Error('No acceptable response is returned');
                    return res.json();
                }).then(data => {
            // do something with the data  
        }).catch(err => {
            isRequestLoading = false;
            console.error(err);
        });
    });
</script>
```

#### The `await` Block
The potential exception is caught in the `catch` block, so the promise itself should not have a `catch` method.  
The `then` block receives the transformed data returned from the last `then` method of the promise.  
In this scenario, the `fetch` method is not used in the `onMount()` hook.
This approach is used for simple receive and show data without much of logic or state and store management. 

```sveltehtml
<script >
    const dataFetcher = fetch('url')
                          .then(res =>{
                            isRequestLoading = false;
                            if (!res.ok) throw new Error('No acceptable response is returned');
                            return res.json();
                        }).then(data => data.fieldOfInterest);
                        
</script>

{#await dataFetcher}
    <div>Loading...</div>
{:then data}
    <div>Data: {data}</div>
{:catch err}
    <div>Error: {err.message}</div>
{/await}
```
    

## Store
- Store instances are singleton (or static functions). Importing same state into to components allows accessing the same underlying value.

### Writable
A writable store can be imported from `svelte.store` and supports the following public callbacks.
- set: store a new value
- update: take the previously stored value and return an updated one
- subscribe: received set and updated values asynchronously immediately

Example: define the state;
```javascript
  import { writable } from 'svelte/store';
  const defaultOrZeroValue = null;
  const itemState = writable(defaultOrZeroValue);
  export default itemState;
```

The client code:
```sveltehtml
<script>
  import { onDestroy } from 'svelte';
  import itemState from 'path/to/itemstate';
  
  const unsubscribe = itemstate.subscribe(value => {
    // this block reactively and automatically run every time the state is changed
  });

  itemstate.update(prev => {
    const curr = updatedPrev;
    return curr;
  });
  
  itemstate.set(replacementValue);
  
  onDestroy(() => {
    unsubscribe();
  });
</script>
```

Usually (but not always) for none collection values, default value is null.  
For collection values, use zero value for that collection as the default value. For example, an empty array for an array value.  
If a store state is populated with raw data fetched from an API endpoint, refetch updated data from API to update the store, rather than updating the store manually in frontend.  

A subscription is an async process and its lifecycle does not depend on the component's lifecycle. Subscriptions will leak if not unsubscribed when component is destroyed.

### Auto Subscription
If a store state needs to be directly used in HTML, Svelte has a shortcut for such use-case.  
In this approach Svelte will automatically subscribe and unsubscribe from the state.  
Prepend the item state with `$` sign and bind it in HTML directly. 

Example: the client code.
```sveltehtml
<script>
  import itemState from 'path/to/itemstate';
</script>
<div>{$itemState}</div>
```

A writable store can be used in a two-way binding with auto subscription.

### One Time Subscription
It is possible to unsubscribe right after subscription.
Svelte knows that only one value (the latest available at the time) should be read in subscription.

Example: the client code
```sveltehtml
<script>
  import itemState from 'path/to/itemstate';
  itemState.subscribe(value => { someLogic })();
</script>
```

### Readable
A readable store only updates the store state internally.  
Client code cannot set or update the state.

Example: define the state
```javascript
import { readable } from 'svelte/store';
let initialValue = null;
export itemState = readable(initialValue, (set) => {
  set(newValue);
  return () => { cleanupLogic };
});
```

Client code will only have access to the `subscribe()` method.  
Readable stores are useful when a value should be automatically updated.  For example, local storage value change, user geolocation updates, etc.


### Derived Store
Derived store creates a state that is readable and is auto updated based on another store state.

```javascript
import { writable, derived } from 'svelte/store';


export const lastUpdatedDateState = writable(null);

const msPerDay = = 24 * 60 * 60 * 1000;

export const lastUpdatedDaysAgoState = derived(
  lastUpdatedDateState,
  (lastUpdatedDate) => Math.floor((toUtcStartOfDay(now).getTime() - toUtcStartOfDay(lastUpdatedDateState).getTime()) / msPerDay)
);
```

### Strategy And Dependency Inversion
Consider TypeScript as the language to use.  

When designing software, there is usually abstraction hierarchy.
Classes that are higher in the abstraction hierarchy should not be dependent to concrete classes and implementations.  

For example, a recipe component which receives ingredients as a list of strings and renders them with styling.
Does the implementation of the class which provides the ingredients matter? The answer is no.  

The recipe component might be used in different pages and there might be different sources that could provide ingredients data.  
For example, this data can be provided by a service class that makes API request or by a store class that already cached the ingredients.  

In such scenarios, the abstraction does not import and directly work with a concrete class.
Instead, it imports and uses an interface that is implemented by those concrete classes.
The interface belongs to the abstraction layer.
So the dependency direction is inverted by introducing an interface (or an abstract class) in the abstract layer and letting
concrete classes implementing (or inheriting from) it.

Based on dependency inversion principle, a store should not be directly used in components. The interface which stores implement can be used in components.

Example: in the abstraction layer:
```typescript
export interface IngredientService {
  async getIngredients(recipeId: number) Promise<IngredientModel[]>;
}
```

First concrete implementation:
```typescript
export class IngredientApiService implements IngredientService {
  async getIngredients(recipeId: number) Promise<IngredientModel[]> {
    return fetch('url')
      .then((res) => {
      if (!res.ok) {
        throw new Error('failed to fetch ingredients');  
      }
      return res.json();
    });
  }
}
```

Second concrete implementation:
```typescript
import { writable } from 'svelte/store';

class ingredientState {
  data: Ingredients[] = [],
  isLoading = false;
}

export class IngredientStoreService implements IngredientService {
  private static instance: IngredientStoreService | null = null;
  private apiService = new IngredientApiService();
  private states = writable({});
  private constructor()
  
  getInstance(): IngredientStoreService {
    if (IngredientStoreService.instance === null) {
      IngredientStoreService.instance = IngredientStoreService();
    }
    return IngredientStoreService.instance;
  }
  
  async getIngredients(recipeId: number) Promise<IngredientModel[]> {
    const unsubscribe = this.states.subscribe(states =>
      
        
    );
    unsubscribe();
  }
}

```