react-elemap
============

**A tool for transforming React elements.**

Why write out repetitive props on every element, when JavaScript can write them for you?

```jsx
// Add `onChange` and `value` props to inputs, based on `name`
elemap(
  <form name='data_we_will_steal_muahaha'>
    <input name='first_name' />
    <input name='last_name' />
    <input name='left_sock_color' />
  </form>,
  el =>
    (el.type !== 'input' || !el.props.name)
      ? el
      : React.cloneElement(el, {
          value: this.state.form[el.props.name],
          onChange: this.handleChange.bind(this, el.props.name)
        })
)
```

With react-elemap, you can map JSX and React elements just like you can map arrays. With a single function call, you can:

- Automatically prefix a component's CSS class names
- Add `onChange` handlers to a form's inputs based on their `name` property
- Do all manner of things with questionable utility

What, Where?
------------

You just need one function: `elemap(element, fn)`. It is the default export for the `react-elemap` package.

```bash
npm install react-elemap
```

```js
import elemap from 'react-elemap'
```

Usage
-----

The `elemap(element, mapFn: (Element) => Element)` function takes a React Element (i.e. a JSX tag) and a "map" function. It then runs the map function on each nested element. It works from the deepest to the shallowest, before finally running the map function on the passed in element.

Note: only elements that belong to the same component as the passed-in element are mapped. Elements that belong to other components, such as `children`, are not mapped.

### The "map" function

The map function receives an element, and is expected to return an element. Here are some tips:

- If there are no changes, just pass back the received element -- it will increase performance.
- If you'd like to make changes, pass back an element created using `React.cloneElement()`.
- If you'd like to remove the element, pass a falsy value.

### Example: Automatically prefix your CSS class names

```jsx
// Prepend the given prefix to all `className` props
function prefixClassNames(prefix, root) {
  return elemap(root, el =>
    !el.props.className
      ? el
      : React.cloneElement(el, {
          className:
            el.props.className
              .trim()
              .split(/\s+/g)
              .map(className => prefix+'_'+className)
              .join(' ')
        })
  )
}

function NameList() {
  return prefixClassNames('NameList_',
    <ul className='baby-names'>
      <li className='active'>Bangers</li>
      <li>Mash</li>
    </ul>
  )
}
```

### Example: Add `value` and `onChange` props to forms based on their `name`

```jsx
const form =
  <form>
    <fieldset name='private_data_we_will_steal_muahaha'>
      <input name='first_name' />
      <input name='last_name' />
      <input name='left_sock_color' />
    </fieldset>
  </form>

const formWithHandlers = elemap(form, el =>
  (el.type === 'input' && el.props.name)
    ? React.cloneElement(el, {
        value: this.state.form[el.props.name],
        onChange: this.handleChange.bind(this, el.props.name)
      })
    : el
)
```

### Example: Remove all elements with the class `note`

```jsx
function removeNotes(root) {
  return elemap(root, el =>
    // Does the element have a `className` that contains `note`?
    /(^|\s)note($|\s)/.test(el.props.className)
      ? null
      : el
  )
}

function Document({ showNotes }) {
  const content =
    <div>
      <h1>What are we going to do tomorrow night, Brain?</h1>
      <p className='note'>First, buy some dougnuts. Then, maybe...</p>
      <p>The same thing we do every night, Pinky - try to take over the world!</p>
    </div>

  return showNotes ? content : removeNotes(content)
}
```

### Example: Make things more complicated without actually doing anything

```jsx
elemap(
  someElement,
  el => el,
)
```

Notes
-----

I haven't tested the performance of this, but I wouldn't recommend using it in ultra performance sensitive code like grids.


