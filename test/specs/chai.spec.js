import { assert, expect } from "chai";

let text = '25'
// assert.equal(text, 25) // works like ==
// assert.strictEqual(text, 25, "value is not matching") // works like ===
let words = 'Please enter your mobile number'
expect(words, `Not Matching`).to.be.oneOf(['Please enter your mobile number', ' /nPlease enter your mobile number'])

let obj1 = { a: 1, b: 2, c: { insideC: 3 } }
let obj2 = { a: 1, b: 2, c: { insideC: 3 } }

assert.deepEqual(obj1, obj2)

// ok --> truthy (i.e, not null, undefined, false, 0, or an empty string)
expect(1).to.be.ok; // Passes
expect(null).to.not.be.ok; // Passes
// expect(undefined).to.be.ok; // Fail
// expect(false).to.be.ok; // Fail
// expect(0).to.be.ok; // Fail
// expect('').to.be.ok; // Fail

expect(null).to.be.null; // Passes
let value;
expect(value).to.be.undefined; // Passes

// exist
expect('hello').to.exist; // Passes
expect(undefined).to.not.exist; // Passes

class Person { }
const person = new Person();
expect(person).to.be.an.instanceof(Person); // Passes

// include
expect([1, 2, 3]).to.include(2); // Passes
expect('Hello World').to.include('World'); // Passes

// assert all memebers in the array
expect([1, 2, 3]).to.have.members([1, 2, 3])
expect([1, 2, 3]).to.have.lengthOf(3); // Passes

// check the property and their value 
const man = { name: 'John', age: 30 };
expect(man).to.have.property('name'); // Passes
expect(man).to.have.property('age', 30); // Passes

// within
expect(5).to.be.within(1, 10); // Passes
// expect(11).to.be.within(1, 10); // Fails

// above or below
expect(10).to.be.above(5)
expect(5).to.be.below(20)

// empty
expect({}).to.be.empty;
expect([]).to.be.empty; // Passes
expect('').to.be.empty; // Passes