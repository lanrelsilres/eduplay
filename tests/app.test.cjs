const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
// DOM mínimo para testar os eventos reais da aplicação, sem navegador ou dependências.
class Element {
 constructor(){this.children=[];this.attrs={};this.dataset={};this.events={};this.style={setProperty(){}};this.classList={toggle(){},add(){}};this.value='';this.hidden=false;}
 setAttribute(k,v){this.attrs[k]=v;} removeAttribute(k){delete this.attrs[k];}
 append(child){this.children.push(child);} replaceChildren(...children){this.children=children;} get firstChild(){return this.children[0];}
 addEventListener(k,fn){this.events[k]=fn;} focus(){} click(){if(!this.disabled)this.events.click?.();} showModal(){this.open=true;} close(){this.open=false;this.events.close?.();}
}
function app(){
 const nodes=new Map();const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
 const nav=['colors','shapes','words','writing'].map(activity=>Object.assign(new Element(),{dataset:{activity}}));
 const prompts=['AZUL','BOLA','SOL'].map(prompt=>Object.assign(new Element(),{dataset:{prompt}}));
 const document={getElementById:get,createElement:()=>new Element(),addEventListener(){},querySelector:s=>s==='dialog[open]'?null:get(s),querySelectorAll:s=>s==='[data-activity]'?nav:s==='[data-prompt]'?prompts:s==='.word-option'?get('word-options').children:[]};
 const window={EduPlayRules:require('../dist/engine.js'),scrollTo(){},addEventListener(){}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),{document,window,console});
 return {get,nav,prompts};
}
test('dimensoes independentes, troca da ultima peca e reinicio de palavras apos conclusao',()=>{
 const {get,nav}=app();assert.equal(get('board').children.length,9);
 get('board-size').value='4';get('board-size').events.change();assert.equal(get('board').children.length,16);assert.equal(get('guides').children.length,4);
 get('board').children[15].click();get('board').children[0].click();
 nav[1].click();assert.equal(get('board').children.length,9);
 get('board-size').value='2';get('board-size').events.change();assert.equal(get('board').children.length,4);
 nav[0].click();assert.equal(get('board').children.length,16);
 nav[2].click();for(let id=0;id<3;id++){get('word-options').children.find(b=>Number(b.dataset.wordId)===id).click();if(id<2)get('next-word').click();}
 assert.equal(get('completion-dialog').open,true);assert.equal(get('completion-title').textContent,'Três palavras descobertas!');get('completion-stay').click();assert.equal(get('completion-dialog').open,false);assert.equal(get('words-success').hidden,false);assert.match(get('word-step').textContent,/concluído/);assert.ok(get('word-options').children.every(b=>b.disabled));
 get('restart-words').click();assert.equal(get('words-success').hidden,true);assert.equal(get('word-step').textContent,'1 de 3');assert.ok(get('word-options').children.every(b=>!b.disabled));assert.equal(get('next-word').hidden,true);
 get('word-options').children.find(b=>b.dataset.wordId==='0').click();assert.equal(get('next-word').hidden,false);
});
test('ideia escolhida aparece como referencia sem preencher ou apagar a escrita',()=>{
 const {get,nav,prompts}=app();nav[3].click();get('writing-input').value='S';prompts[2].click();assert.equal(get('writing-model').textContent,'SOL');assert.equal(get('writing-chosen').hidden,false);assert.equal(get('writing-input').value,'S');
 get('next-group').click();get('confirm-ok').click();assert.equal(get('writing-input').value,'');assert.equal(get('writing-chosen').hidden,true);
});
