import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchBooks,parseBook,createBook} from '../src/books.ts';
const book={id:'12',title:'Sách thử nghiệm',author:'Tác giả',genre:'Văn học',year:2026};
test('JSON books load with validated IDs and years',async()=>{
 let url;
 const result=await fetchBooks(async(input)=>{url=input;return Response.json([{...book,id:12,year:'2026'}]);});
 assert.equal(url,'/books.json');assert.equal(result[0].id,'12');assert.equal(result[0].year,2026);
});
test('loading handles HTTP errors and malformed book data',async()=>{
 await assert.rejects(fetchBooks(async()=>new Response('',{status:500})),/HTTP 500/);
 await assert.rejects(fetchBooks(async()=>Response.json({})),/không hợp lệ/);
 assert.throws(()=>parseBook({...book,year:''}),/không hợp lệ/);
});
test('new books get unique IDs and numeric publication year without any API',()=>{
 const input={title:book.title,author:book.author,genre:book.genre,year:'2026'};
 const first=createBook(input),second=createBook(input);
 assert.notEqual(first.id,second.id);assert.equal(first.year,2026);assert.equal(first.title,input.title);
});
