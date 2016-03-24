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
        , "should return the provided constructor function" : 
          function() {
              Should.exist(found);
              found.should.equal(cls)
          }
        , "the provided function should be augmented with" : 
          { ".inherits(parentClass)" : mustHaveMethod("inherits", 1, cls)
          , ".implements(methodSet, methodSet, methodSet...)" : mustHaveMethod("implements", null, cls)
          , ".overrides(methodSet, methodSet, methodSet...)" : mustHaveMethod("overrides", null, cls)
          , ".static(methodSet, methodSet, methodSet...)" : mustHaveMethod("static", null, cls)
          , ".alias(aliasSet)" : mustHaveMethod("alias", 1, cls)
          }
        }
    })
  , "Using API of an initiated class" :
    { ".inherits" : 
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
    , ".implements" : 
      { "should add all methods from all method sets to the prototype" : 
        function() {
            var Implementor = o.class(function() {} );
            Implementor.implements( 
              { foo : foo 
              , bar : "baz"
              }
            , { pam : foo 
              , bam : "ba"
              }
            );
            function foo() {}
            Implementor.prototype.should.have.property('foo');
            Implementor.prototype.foo.should.equal(foo);
            Implementor.prototype.should.have.property('bar','baz');
            Implementor.prototype.pam.should.equal(foo);
            Implementor.prototype.should.have.property('bam','ba');
        }
      , "when method set is a function - should execute it as a closure first" : 
        function() {
            var Implementor = o.class(function() {} );
            Implementor.implements( 
              function() {
                  var someState = 1;
                  return {
                    foo : function() { return someState++ }
                  , bar : "baz"
                  }
              }
            );
            
            Implementor.prototype.should.have.property('foo');
            Implementor.prototype.foo.should.be.a.Function;
            Implementor.prototype.should.have.property('bar','baz');
        }
      }
    , ".overrides" : 
      { "should be asynonim for class.implements" : 
        function() {
            var Klass = o.class(function() {} );
            Klass.should.have.property('overrides', Klass.implements);
        }
      }
    , ".alias" : 
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
    , ".static" : 
      { "should add all methods from all method sets to the class as static method" : 
        function() {
            var Implementor = 
                o.class(function() {} )
                 .implements( 
                  { hello : function() {}
                  , world : function() {}
                  }
                ).static(
                  { foo : foo 
                  , bar : "baz"
                  }
                , { pam : foo 
                  , bam : "ba"
                  }
                )
              ;
            
            Implementor.should.have.property("foo", foo);
            Implementor.should.have.property("bar", "baz");
            Implementor.should.have.property("pam", foo);
            Implementor.should.have.property("bam", "ba");
            
            function foo() {}
        }
      , "when methodset is a function - should execute it as a closure first" : 
        function() {
            var Implementor = o.class(function() {} );
            Implementor.static( 
              function() {
                  var someState = 1;
                  return {
                    foo : function() { return someState++ }
                  , bar : "baz"
                  }
              }
            );
            
            Implementor.should.have.property('foo');
            Implementor.foo.should.be.a.Function;
            Implementor.should.have.property('bar','baz');
        }
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