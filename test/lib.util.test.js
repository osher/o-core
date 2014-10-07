var o = require('../lib')
  ;
module.exports = 
{ 'o-core' :
  { 'API tests' :
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
              return
            clone.x.z.should.not.equal(orig.x.z);
            clone.y.should.not.equal(orig.y);
            clone.y.z.should.not.equal(orig.y.z);
        }
      }
    }
  }
}
