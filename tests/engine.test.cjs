'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const rules = require('../dist/engine.js');
for (const size of [2,3,4]) {
 test(`${size}x${size}: 200 misturas validas e solucionaveis`, () => {
  for(let seed=1;seed<=200;seed++) {
   let value=seed;
   let board=rules.shuffled(size,()=>{value=value*16807%2147483647;return(value-1)/2147483646;});
   assert.equal(board.length,size*size); assert.ok(rules.validBoard(board)); assert.ok(rules.correctCount(board)<board.length);
   const original=board.slice();
   assert.deepEqual(rules.swap(rules.swap(board,0,board.length-1),0,board.length-1),original);
   assert.deepEqual(board,original);
   for(let i=0;i<board.length;i++) if(board[i]!==i%size) {
    const j=board.findIndex((id,k)=>k>i&&id===i%size);
    assert.ok(j>i); board=rules.swap(board,i,j); assert.ok(rules.validBoard(board));
   }
   assert.equal(rules.correctCount(board),board.length);
  }
  assert.ok(rules.correctCount(rules.shuffled(size,()=>.9999999))<size*size);
 });
}
test('todas as seis disposicoes 2x2 sao alcancaveis',()=>{
 const seen=new Set(),queue=[[0,1,0,1]];
 while(queue.length){const board=queue.shift(),key=board.join('');if(seen.has(key))continue;seen.add(key);for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const next=rules.swap(board,i,j);if(!seen.has(next.join('')))queue.push(next);}}
 assert.equal(seen.size,6);
});
test('dados invalidos e tabuleiros incompletos sao rejeitados',()=>{
 for(const size of [0,1,5,2.5,'3',null])assert.throws(()=>rules.shuffled(size));
 for(const value of [-1,1,NaN,Infinity])assert.throws(()=>rules.shuffled(3,()=>value));
 for(const board of [null,[],[0,1,2,0,1,2],[0,0,0,0],[0,1,0,4]])assert.equal(rules.validBoard(board),false);
 const board=rules.shuffled(); for(const index of [-1,9,1.5])assert.throws(()=>rules.swap(board,index,0));
 assert.throws(()=>rules.correctCount([0]));
});
