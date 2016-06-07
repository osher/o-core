var o            = require('../lib')
  , IndexedArray = o.IndexedArray
  ;

module.exports = 
{ 'lib/o.indexedArray' : 
  { 'should be a factory function that names 1 argument' : 
    function() {
        Should(o.indexedArray).be.a.Function;
        o.indexedArray.length.should.eql(1)
    }
  , 'when used' : 
    { 'should return an instance of IndexedArray' : 
      function() {
          Should(o.indexedArray()).be.instanceOf(IndexedArray)
      }
    }
  }
, 'lib/o.IndexedArray' :
  { 'should be a constructor function that names 1 argument' : 
    function() {
        Should(IndexedArray).be.a.Function;
        IndexedArray.length.should.eql(1);
        Object.keys(IndexedArray.prototype).length.should.be.ok
    }
  , 'when constructed without propviding any arguments' : 
    { 'should create default .idOf(element) that returns element.id' : 
      function() {
          var ia = new IndexedArray()
            , id = 'id'  + Math.random()
          
          Should(ia.idOf).be.a.Function;
          ia.idOf({id: id }).should.eql(id);
      }
    }
  , 'when constructed with a function getter' :
    { 'should  use the passed function as .idOf(element)' : 
      function() {
          var ia = new IndexedArray(function() { called++; return id } )
            , called = 0
            , id = 'id'  + Math.random()
            ;          
          Should(ia.idOf).be.a.Function;
          ia.idOf({id: 'wrong-answer' }).should.eql(id);
          called.should.eql(1);
      }
    }  
  , 'when constructed with a property name' : 
    { 'should create .idOf(element) that returns the element\'s property of the passed property-name' : 
      function() {
          var ia = new IndexedArray('name')
            , id = 'name'  + Math.random()
            ;
          Should(ia.idOf).be.a.Function;
          ia.idOf({id: 'wrong-answer', name: id }).should.eql(id);
      }
    }
  , 'IndexArray': 
    { '#push': 
      { 'should add all elements to the array and index all elements that have id' : 
        function() {
            var ia = new IndexedArray()
              , a  = {id:'a'}
              , b  = {id:'b'}
              , c  = {id:'c'};
            
            ia.push(a,b);
            ia.length.should.eql(2);
            Should(ia.byId.a).equal(a)
            Should(ia.byId.b).equal(b)
            
            ia.push({}, c);
            
            ia.length.should.eql(4);
            Should(ia.byId.c).equal(c)
            Object.keys(ia.byId).should.eql(['a','b','c']);
            //ia.should.eql([a,b,{},c]);
        }
      }
    , '#unshift': 
      { 'should add all elements to the array and index all elements that have id' : 
        function() {
            var ia = new IndexedArray()
              , a  = {id:'a'}
              , b  = {id:'b'}
              , c  = {id:'c'};
            
            ia.unshift(a,b);
            ia.length.should.eql(2);
            Should(ia.byId.a).equal(a)
            Should(ia.byId.b).equal(b)
            
            ia.unshift({}, c);
            ia.length.should.eql(4);
            Should(ia.byId.c).equal(c)
            Object.keys(ia.byId).should.eql(['a','b','c']);
            //ia.should.eql([{},c,a,b]); 
        }
      }
    , '#pop': 
      { 'should remove the last element from the array and un-index it' : 
        function() {
            var ia = new IndexedArray()
              , a  = {id:'a'}
              , b  = {id:'b'}
              , c  = {id:'c'};
            
            ia.push(a,b,c);
            
            ia.pop();
            
            ia.length.should.eql(2);
            Should(ia.byId.c).not.be.ok;
            Object.keys(ia.byId).should.eql(['a','b'])
        }
      }
    }
  }
}
