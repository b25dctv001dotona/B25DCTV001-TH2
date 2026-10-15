import test from 'node:test';
import assert from 'node:assert/strict';
import {readStoredBooks,saveBookList,booksStorageKey} from '../src/book-storage.ts';
const book={id:'new',title:'Sách đã lưu',author:'Tác giả',genre:'Văn học',year:2026,color:'#698675'};
function memory(){const map=new Map();return {getItem:key=>map.get(key) ?? null,setItem:(key,value)=>map.set(key,value)};}
test('added books survive a new read and deleting the last book persists an empty list',()=>{
 const storage=memory();assert.equal(readStoredBooks(storage),null);
 assert.equal(saveBookList([book],storage),true);assert.deepEqual(readStoredBooks(storage).map(b=>b.id),['new']);
 assert.equal(saveBookList([],storage),true);assert.deepEqual(readStoredBooks(storage),[]);
});
test('invalid JSON, malformed books and duplicate IDs fall back safely',()=>{
 const storage=memory();
 for(const raw of ['bad','{}',JSON.stringify([{id:'x'}]),JSON.stringify([book,book])]){storage.setItem(booksStorageKey,raw);assert.equal(readStoredBooks(storage),null);}
});
test('blocked or full storage returns a failure without replacing the saved list',()=>{
 const storage=memory();saveBookList([book],storage);
 assert.equal(saveBookList([],{setItem(){throw new Error('QuotaExceededError');}}),false);
 assert.equal(readStoredBooks(storage).length,1);
 assert.equal(readStoredBooks({getItem(){throw new Error('SecurityError');}}),null);
});
