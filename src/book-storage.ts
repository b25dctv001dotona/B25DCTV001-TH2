import type {Book} from './types.ts';
import {parseBook} from './books.ts';
export const booksStorageKey='la-sach-books-v1';
export function readStoredBooks(storage?: Pick<Storage,'getItem'>): Book[] | null {
 try {
  const raw=(storage ?? localStorage).getItem(booksStorageKey);
  if(raw===null)return null;
  const data:unknown=JSON.parse(raw);
  if(!Array.isArray(data))return null;
  const books=data.map(parseBook);
  if(new Set(books.map(book=>book.id)).size!==books.length)return null;
  return books;
 }catch{return null;}
}
export function saveBookList(books: Book[],storage?: Pick<Storage,'setItem'>): boolean {
 try{(storage ?? localStorage).setItem(booksStorageKey,JSON.stringify(books));return true;}catch{return false;}
}
