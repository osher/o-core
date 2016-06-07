var format = require('util').format
  , o      = require('../lib')
  ;
module.exports = 
{ 'o-core - utils' :
 { '.merge(obj)' : 
    { 'should merge flat objects successfully' : 
      function() {
          o.merge({a:1},{b:2}).should.eql({a:1,b:2});
      }
    , 'should merge nested object recursively' : 
      function() {
          var t = 
              { x: { ax: 1, z : { a : 1 } } 
              , y: { ay: 1, z : { a : 1 } }
              }
            , r
            ;
          r = 
            o.merge( t
            , { x: { bx: 1, z : { b : 1 } } 
              , y: { by: 1, z : { b : 1 } }
              }
            );
          r.should.eql(
            { x: { ax: 1, bx: 1, z : { a: 1, b : 1 } } 
            , y: { ay: 1, by: 1, z : { a: 1, b : 1 } }
            }
          );
          r.should.equal(t);
      }
    }
  , '.copy(obj)' :
    { 'should create clones recursively' : 
      function() {
          var orig = 
              { x: { ax: 1, bx: 1, z : { a: 1, b : 1 } } 
              , y: { ay: 1, by: 1, z : { a: 1, b : 1 } }
              }
            , clone = o.copy(orig)
            ;
          clone.should.eql(orig);
          clone.should.not.equal(orig);
          clone.x.should.not.equal(orig.x);

          clone.x.z.should.not.equal(orig.x.z);
          clone.y.should.not.equal(orig.y);
          clone.y.z.should.not.equal(orig.y.z);
      }
    }
  , '.contains(container, segment)' : 
    { 'should approve -' : 
      block(function() {
          var cases = 
          { 'two empty objects' :  
            { a: {}
            , b: {}
            }
          , 'similar flat object' :
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null, inf: Infinity, undef: undefined, nan: NaN } 
            , b: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null, inf: Infinity, undef: undefined, nan: NaN } 
            }
          , 'flat object, string attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
            , b: { name: "osher"            }
            }
          , 'flat object, numeric attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
            , b: {                YoB: 1976 }
            }
          , 'flat object, true attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
            , b: {                                         healthy: true }
            }
          , 'flat object, false attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
            , b: {                           angry: false }
            }
          , 'flat object, null attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
            , b: {                                                        pain: null }
            }
          , 'flat object, undefined attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null, inf: Infinity, undef: undefined, nan: NaN } 
            , b: { undef: undefined }
            }
          , 'flat object, Infinity attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null, inf: Infinity, undef: undefined, nan: NaN } 
            , b: { inf: Infinity }
            }
          , 'flat object, NaN attribute contained in a flat object' : 
            { a: { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null, inf: Infinity, undef: undefined, nan: NaN } 
            , b: { nan: NaN }
            }
          , 'similar compound objects' :
            { a: 
              { person: 
                { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
              }
            , b: 
              { person: 
                { name: "osher", YoB: 1976, angry: false, healthy: true, pain: null } 
              }
            }
          , 'nested flat array attribute - exact match' :
            { a: 
              { person: 
                { name: "osher"
                , hobbies: [ "javascript", "roleplay" ] 
                } 
              }
            , b: 
              { person: 
                { hobbies: [ "javascript", "roleplay" ]
                } 
              }
            }
          , 'nested flat array attribute - different order of elements' :
            { a: 
              { person: 
                { name: "osher"
                , hobbies: [ "javascript", "roleplay" ] 
                } 
              }
            , b: 
              { person: 
                { hobbies: [ "roleplay", "javascript" ]
                } 
              }
            }
          , 'nested flat array attribute - all searched entries found, container array has more' :
            { a: 
              { person: 
                { name: "osher"
                , hobbies: [ "javascript", "roleplay" ] 
                } 
              }
            , b: 
              { person: 
                { hobbies: [ "roleplay" ]
                } 
              }
            }
          , 'nested flat array, searching for null element' : 
            { a: 
              { person: 
                { name: "osher"
                , hobbies: [ "javascript", null, "roleplay" ] 
                } 
              }
            , b: 
              { person: 
                { hobbies: [ null ]
                } 
              }
            }
         , 'nested false attribute' : 
           { a: 
              { person:   { name: "osher", angry: false}
              , vehicle:  { car: { sportive: true } }
              }
            , b: 
              { person: { angry: false } 
              }
            }
          , 'nested true attribute' : 
            { a: 
              { person:   { name: "osher", angry: false}
              , vehicle:  { car: { sportive: true } }
              }
            , b: 
              { vehicle:  { car: { sportive: true } } 
              }
            }
          , 'compound array attribute - similar arrays' : 
            { a: { nested: { array: [ {} ] } } 
            , b: { nested: { array: [ {} ] } } 
            }
          , 'compound array attribute - contains all searched' : 
            { a: { nested: { array: [ 1, {}, true ] } } 
            , b: { nested: { array: [ {} ] } } 
            }
          , 'compound array attribute - search for null element' : 
            { a: { nested: { array: [ 1, {}, true, null ] } } 
            , b: { nested: { array: [ {}, null ] } } 
            }
          , 'compound array attribute - search for undefined element' : 
            { a: { nested: { array: [ 1, {}, true, undefined ] } } 
            , b: { nested: { array: [ {}, undefined ] } } 
            }
          , 'compound array attribute - search for NaN element' : 
            { a: { nested: { array: [ 1, {}, true, NaN ] } } 
            , b: { nested: { array: [ {}, NaN ] } } 
            }
          , 'compound array attribute - search for specific value in specific index' : 
            { a: { nested: { array: [ 1, 2, {}, 4 ] } } 
            , b: { nested: { array: { 2: {} } } } 
            }
          , 'compound array attribute - search for null value in specific index' : 
            { a: { nested: { array: [ 1, 2, null, {}, 4 ] } } 
            , b: { nested: { array: { 2: null } } } 
            }
          };
          return Object.keys(cases).reduce(function(suite, title) {
              var oCase = cases[title];
              suite[title] = function() {
                  if (o.contains(oCase.a, oCase.b)) return;
                  
                  var e = Error( format("Did not approve that \n\tobject   : %j\n        contains : %j", oCase.a, oCase.b))
                  e.container = oCase.a;
                  e.segment   = oCase.b;
                  throw e;
              };
              return suite;
          }, {})
      })
    , 'should reject -' : 
      block(function() {
          var cases = 
          { 'flat objects, missing numeric attribute' : 
            { a : {}
            , b : { missing: 1 }
            }
          , 'flat objects, missing bool attribute' : 
            { a : {}
            , b : { missing: true }
            }
          , 'flat objects, missing object attribute' : 
            { a : {}
            , b : { missing: {} }
            }
          , 'flat objects, missing array attribute' : 
            { a : {}
            , b : { missing: [] }
            }
          , 'flat objects, missing null attribute' : 
            { a : {}
            , b : { missing: null }
            }
          , 'flat objects, missing undefined attribute' : 
            { a : {}
            , b : { missing: undefined }
            }
          , 'flat objects, attribute existing with different string value' :
            { a : { str: "a", bTrue : true, bFalse: false, num: 13, obj: {}, vNull: null }
            , b : { str: "b"}
            }
          , 'flat objects, attribute existing with different true-false value' :
            { a : { str: "a", bTrue : true, bFalse: false, num: 13, obj: {}, vNull: null }
            , b : { bTrue: false }
            }
          , 'flat objects, attribute existing with different false-true value ' :
            { a : { str: "a", bTrue : true, bFalse: false, num: 13, obj: {}, vNull: null }
            , b : { bFalse: true }
            }
          , 'flat objects, attribute existing with different numeric value ' :
            { a : { str: "a", bTrue : true, bFalse: false, num: 13, obj: {}, vNull: null }
            , b : { num: 0.13 }
            }
          , 'flat objects, attribute existing with different non-null value ' :
            { a : { str: "a", bTrue : true, bFalse: false, num: 13, obj: {}, vNull: null }
            , b : { vNull: 0.13 }
            }
          , 'flat arrays, all elements missing' : 
            { a: [1,2,3]
            , b: [4]
            }
          , 'flat arrays, some elements missing' : 
            { a: [1,2,3]
            , b: [1,4]
            }
          , 'flat arrays, null elements missing' : 
            { a: [1,2,3]
            , b: [1,null]
            }
          , 'flat arrays, undefined elements missing' : 
            { a: [1,2,3]
            , b: [1,undefined]
            }
          , 'flat arrays, NaN elements missing' : 
            { a: [1,2,3]
            , b: [1,NaN]
            }
          , 'expect primitive value where there is an object' : 
            { a: { person: { name : "osher" } }
            , b: { person: "osher" }
            }
          , 'expect object where there a primitive value' : 
            { a: { person: "osher" }
            , b: { person: { name : "osher" } }
            }
          , 'expect an Array where there is an Object' : 
            { a: { ranking: { 0 : "osher" } }
            , b: { ranking: [ "osher" ] }
            }
          /* WARNING: this case contradicts searching for element in speciffic index
            ---------
          , 'expect an Object where there is an Array' : 
            { a: { ranking: [ "osher" ] }
            , b: { ranking: { 0 : "osher" } }
            }
            ---------
            WARNEnd
          */
          };
          
          return Object.keys(cases).reduce(function(suite, title) {
              var oCase = cases[title];
              suite[title] = function() {
                  if (!o.contains(oCase.a, oCase.b)) return;
                  
                  var e = Error( format("Did not reject that \n\tobject   : %j\n        contains : %j", oCase.a, oCase.b))
                  e.container = oCase.a;
                  e.segment   = oCase.b;
                  throw e
              };
              return suite
          }, {})
      })
    }
  }
}
