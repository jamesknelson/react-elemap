const React = require('react')


module.exports = function elemap(element, fn, owner=undefined) {
  if (owner && owner !== element._owner) {
    return element
  }

  var childOwner = owner
  if (childOwner === undefined) childOwner = element._owner

  var props = element.props
  var changes = {}

  if (typeof props.children === 'object') {
    var children = React.Children.toArray(props.children)
    var transformedChildren = []
    var childrenHaveChanged = false
    for (var i = 0; i < children.length; i++) {
      var child = children[i]
      if (React.isValidElement(child)) {
        var transformedChild = elemap(
          child,
          fn,
          childOwner
        )
        childrenHaveChanged = childrenHaveChanged || (transformedChild !== child)
        transformedChildren.push(transformedChild)
      }
      else {
        transformedChildren.push(child)
      }
    }
    if (childrenHaveChanged) {
      changes.children = transformedChildren
    }
  }

  if (typeof element.type !== 'string') {
    var propKeys = Object.keys(props)
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i]
      if (key == 'children') continue
      var value = props[key]
      if (React.isValidElement(value)) {
        var transformed = elemap(
          value,
          fn,
          childOwner
        )
        if (transformed !== value) {
          changes[key] = transformed
        }
      }
    }
  }

  var hasChanges = Object.keys(changes).length > 0
  var updatedElement = hasChanges ? React.cloneElement(element, changes) : element
  return fn(updatedElement)
}
