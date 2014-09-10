var o = require('../')
  ;
module.exports = 
{ "lib/o.class(fConstructor)" : 
  { "when used with a constructor function" : 
    block( function() { 
        var cls = function() {} 
          , found
          ;
        return { 
          "should not fail" : 
          function() {
              found = o.class(cls)
          }
        , "the provided function should be augmented with" : 
          { ".inherits(parentClass)" : mustHaveMethod("inherits", 1, cls)
          , ".implements(methodSet, methodSet, methodSet...)" : mustHaveMethod("implements", null, cls)
          , ".overrides(methodSet, methodSet, methodSet...)" : mustHaveMethod("overrides", null, cls)
          , ".static(methodSet, methodSet, methodSet...)" : mustHaveMethod("static", null, cls)
          , ".alias(aliasSet)" : mustHaveMethod("alias", 1, cls)
          }
        , "should return the provided constructor function" : 
          function() {
              Should.exist(found);
              found.should.equal(cls)
          }
        }
    })
  , "API of an initiated class" :
    { "class.inherits" : 
      { "should connect inheritence to the provided parent class" : 
        function() {
            var Person = o.class(function() {} )
              , Worker = o.class(function() {}).inherits(Person)
              , w = new Worker()
              ;
            w.should.be.instanceOf(Person);
            w.should.be.instanceOf(Worker);
        }
      }
    , "~class.implements" : 
      { "should add all methods from all method sets to the prototype" : null
      , "when methodset is a function - should execute it as a closure first" : null
      }
    , "~class.overrides" : 
      { "should be asynonim for class.implements" : 
        function() {
            var Klass = o.class(function() {} );
            Klass.should.have.property('overrides', Klass.implements);
        }
      }
    , "~class.alias" : 
      { "should create a synonim for every key name to the method named in the value" : 
        function() {
             var Person = 
                 o.class(function() {} )
                  .implements( 
                    { hello : function() {}
                    , world : function() {}
                    }
                  ).alias(
                    { salam : "hello"
                    , allam : "world"
                    }
                  )
                ;
             Person.prototype.should.have.property("salam", Person.prototype.hello) ;
             Person.prototype.should.have.property("allam", Person.prototype.world) ;
        }
      }
    , "~class.static" : 
      { "should add all methods from all method sets to the class as static method" : null
      , "when methodset is a function - should execute it as a closure first" : null
      }
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