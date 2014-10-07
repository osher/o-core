var IBase  = 
    { base: 
        function(method, args){
            var parent
              , fMethod = this.constructor.prototype[method]
              ;
            //if args an arguments stack - convert to array
            if (args.length && !Array.isArray(args)) args = Array.prototype.slice.apply(args);
            
            //if no overrider on this instance
            if (arguments.callee.caller == fMethod)
                for(fMethod = null, parent = this.constructor.super_; !fMethod && parent || arguments.callee.caller == fMethod; parent = parent.super_)
                    fMethod = parent.prototype[method]
            //TODO - since every method of the parent exists on every one of its subclasses, 
            //       the search could find the recent override, but the first occurency from the bottom.
            //       this will not work when a parent method calls .base() to a parent's parent
            //   
            //       we first need to find the called method, and then find the method it overrides

            if (!fMethod) return;

            return fMethod.apply(this, args || []);        
        }
    , implements:
        function(){
            var i, mi;
            for(i=0, mi = arguments.length; i < mi; i++)
                o_extend(this, 'function' == typeof arguments[i] ? o_closure(arguments[i]) : arguments[i]);
            return this;
        }
    }
  , IndexedArray = 
    o_class(
      function IndexedArray( elementId ) {
          if (!elementId) elementId = 'id';
          Array.apply(this, arguments);
          Object.defineProperty(this, 'byId'
          , { value       : {}
            , enumerable  : false
            , writable    : true
            , configurable: true
            }
          );
          Object.defineProperty(this, 'idOf'
          , { value       : 
              'function' == typeof elementId
              ? elementId
              : function(e) { 
                    return e[elementId] 
                }
            , enumerable  : false
            , writable    : true
            , configurable: true
            }
          );
      }
    ).inherits( Array 
    ).overrides(
      { push: 
        function() {
            for (var id, i = 0; i < arguments.length; i++) 
                if ('undefined' != typeof(id = this.idOf(arguments[i])) )
                    this.byId[ id ] = arguments[i];
            return this.base("push", arguments);
        }
      , pop: 
        function() {
            var e = this.base('pop',arguments)
              , id
              ;
            if ('undefined' != typeof(id = this.idOf(arguments[i])) )
                delete this.byId[ this.idOf(e) ];
            return e;
        }
      , shift: 
        function() {
            for (var id, i = 0; i < arguments.length; i++) 
                if ('undefined' != typeof(id = this.idOf(arguments[i])) )
                    this.byId[ id ] = arguments[i];
            return this.base('shift',arguments);
        }
      , unshift: 
        function() {
            var e = this.base('unshift',arguments)
              , id
              ;
            if ('undefined' != typeof(id = this.idOf(e)) ) 
                delete this.byId[id];
            return e;
        }
      , splice: 
        function() {
            var a = this.base('splice', arguments)
              , byId = this.byId
              , idOf = this.idOf
              , id
              ;
            a.forEach(function(e) {
                if ('undefined' != typeof(id = idOf(e)) ) delete byId[id];
            });
            return a;
        }
      }
    )
  ;
IBase.overrides = IBase.implements;

module.exports = 
  { extend       : o_extend
  , copy         : o_copy
  , clone        : o_copy
  , defaults     : o_defaults
  , merge        : o_merge
  , closure      : o_closure
  , IBase        : IBase
  , class        : o_class
  , IndexedArray : IndexedArray
  , indexedArray : function(fIdGetter) { return new IndexedArray(fIdGetter) }
  }

function o_class(fCtor) {
    o_extend(fCtor
    , { inherits: 
        function (parentClass) {
            //credit: based on util.inherits of node.js
            fCtor.super_ = parentClass;
            fCtor.prototype = 
              Object.create(parentClass.prototype
              , { constructor: 
                  { value       : fCtor
                  , enumerable  : false
                  , writable    : true
                  , configurable: true
                  }
                }
              );
            return fCtor;
        }
      , implements : o_class_implements
      , overrides  : o_class_implements
      , alias : 
        function(o) { 
            for (var k in o)
                fCtor.prototype[k] = fCtor.prototype[ o[k] ];
            return fCtor;
        }
      , static : 
        function() {
            for(var i = 0; i < arguments.length; i++)
                o_extend(fCtor, arguments[i]);
            return fCtor;
        }
      }
    );
    return fCtor;

    function o_class_implements() {
        o_extend(fCtor.prototype, IBase);
        for(var i = 0; i < arguments.length; i++)
            o_extend(fCtor.prototype, 'function' == typeof arguments[i] ? o_closure(arguments[i]) : arguments[i] );
        return fCtor;
    }
}

function o_extend(t /*,s1,s2,s3...*/) { 
    var each, i; 
    for(i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue;
        for(each in arguments[i]) 
            t[each] = arguments[i][each]; 
        if (arguments[i].toString !== Object.prototype.toString) t.toString = arguments[i].toString;
    }
    return t
}

function o_copy(s) { 
    if (!s || typeof s != 'object') return s;
    if (Array.isArray(s)) return [].concat(s);
    var each,c = {};
    for(each in s) c[each] = o_copy(s[each]);
    return c
}

function o_defaults(t /*,s1,s2,s3...*/){//copies only missing values 
    var each, i, o; 
    for(i = 1; i < arguments.length; i++) {
        if (!arguments[i]) continue;
        for(each in arguments[i]) 
            if (undefined == t[each]) t[each] = typeof (o = arguments[i][each]) == 'object' ? o_copy(o) : o; 
        if (undefined == t.toString && arguments[i].toString !== Object.prototype.toString) t.toString = arguments[i].toString;
    }
    return t
}

var p = "";
function o_merge(t/*,s1,s2,s3...*/) {
    var each
      , i = 1
      , s
      ;
    p += "\t";

    while(s = arguments[i++]) 
        for(each in s) 
            if (t[each] !== s[each])
                if (t[each] && typeof s[each] == 'object')
                    o_merge(t[each], s[each]);
                else t[each] = o_copy(s[each]);
    

    p = p.substr(0,p.length-1);
    return t;
}
function o_closure(fClosure,args) { 
    return fClosure.apply({},args || [])  
}