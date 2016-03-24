o-core [![Build Status](https://secure.travis-ci.org/osher/o-core.png?branch=master)](http://travis-ci.org/osher/o-core)
======

Very thin and lightweight utilities.

```
o-core
  √ should be a utility module object
  API summary
    √ o.extend(target, source, source, source...)
    √ o.copy(source)
    √ o.clone(source)
    √ o.defaults(target, source, source, source...)
    √ o.merge(target, source, source, source...)
    √ o.closure(fHandler,args)
    √ o.class(fConstructor) - a factory method for classes
    √ o.IndexedArray(elementId) - a constructor
    √ o.indexedArray(elementId) - a factory for the constructor (simply saves you using keyword new)
    o.IBase interface
      √ should be a mixin
      √ .base(method, args)
      √ .implements(methodSet, methodSet, methodSet...)

o.class(fConstructor)
  when used with a constructor function
    √ should return the provided constructor function
    the provided function should be augmented with
      √ .inherits(parentClass)
      √ .implements(methodSet, methodSet, methodSet...)
      √ .overrides(methodSet, methodSet, methodSet...)
      √ .static(methodSet, methodSet, methodSet...)
      √ .alias(aliasSet)
  Using the API of an initiated class
    .inherits
      √ should connect inheritence to the provided parent class
    .implements
      √ should add all methods from all method sets to the prototype
      √ when method set is a function - should execute it as a closure first
    .overrides
      √ should be asynonim for class.implements (different only semantically)
    .alias
      √ should create a synonim for every key name to the method named in the value
    .static
      - should add all methods from all method sets to the class as static method
      - when methodset is a function - should execute it as a closure first
    
      
```

