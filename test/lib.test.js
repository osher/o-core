var o = require('../')

module.exports = 
{ "o-core" : 
  { "should be a utility module object" : mustBeAnObject(o)
  , "API summary" : 
    { ".extend(target, source, source, source...)" : mustHaveMethod("extend")
    , ".copy(source)" : mustHaveMethod("copy", 1)
    , ".clone(source)" : mustHaveMethod("clone", 1)
    , ".defaults(target, source, source, source...)" : mustHaveMethod("defaults")
    , ".closure(fHandler,args)" : mustHaveMethod("closure", 2)
    , ".IBase interface" : 
      { "should be a mixin" : mustBeAnObject(o.IBase)
      , ".base(method, args) " : mustHaveMethod("base", 2, o.IBase)
      , ".implements(methodSet, methodSet, methodSet...)" : mustHaveMethod("implements", null, o.IBase)
      }
    , ".class(fConstructor) - a factory method for classes" : mustHaveMethod("class",1)
    , ".IndexedArray(elementId) - a constructor" : mustHaveMethod("IndexedArray",1)
    , ".indexedArray(elementId) - a factory for the constructor (simply saves you using keyword new)" : mustHaveMethod("indexedArray",1)
    }
  }
}

function mustHaveMethod(api,numArgs, obj) {
    if (!obj) obj = o;
    return function() { 
        obj.should.have.property(api);
        obj[api].should.be.a.Function;
        if ('number' == typeof numArgs)
            obj[api].length.should.eql(numArgs);
    }
}

function mustBeAnObject(o) {
    return function() {
        Should.exist(o);
        o.should.be.an.Object;
    }
}