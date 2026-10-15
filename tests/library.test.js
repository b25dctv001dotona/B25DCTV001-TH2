import test from 'node:test';
import assert from 'node:assert/strict';
import {filterBooks,validateBook} from '../src/utils.ts';
import {books} from '../src/data.js';
test('search combines title, genre and favorites, ignoring Vietnamese accents',()=>{
 assert.equal(filterBooks(books,'hoa vang','Văn học')[0].id,'b02');
 assert.equal(filterBooks(books,'hoa vang','Khoa học').length,0);
 assert.equal(filterBooks(books,'','',true,new Set(['b02'])).length,1);
 assert.equal(filterBooks(books,'không tồn tại','').length,0);
});
test('form enforces required fields and year boundaries',()=>{
 const valid={title:'Sách mới',author:'Tác giả',genre:'Văn học',year:'2026'};
 assert.deepEqual(validateBook(valid,2026),{});
 assert.equal(Object.keys(validateBook({title:'ab',author:' ',genre:'',year:'1899'},2026)).length,4);
 for(const year of ['2027','1900.5','', 'abc'])assert.ok(validateBook({...valid,year},2026).year);
 assert.deepEqual(validateBook({...valid,year:'1900'},2026),{});
});
