import type { Book, BookInput, Errors } from './types.ts';
export const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().trim();
export function filterBooks(books: Book[], query: string, genre: string, favoritesOnly = false, favorites: Set<string> = new Set()): Book[] {
 return books.filter(book => normalize(book.title).includes(normalize(query)) && (!genre || book.genre === genre) && (!favoritesOnly || favorites.has(book.id)));
}
export function validateBook(values: BookInput, currentYear = new Date().getFullYear()): Errors {
 const errors: Errors = {};
 if (values.title.trim().length < 3) errors.title = 'Tên sách cần ít nhất 3 ký tự.';
 if (!values.author.trim()) errors.author = 'Vui lòng nhập tên tác giả.';
 if (!['Văn học','Khoa học','Kỹ năng sống'].includes(values.genre)) errors.genre = 'Vui lòng chọn thể loại.';
 const year = Number(values.year);
 if (!String(values.year).trim() || !Number.isInteger(year) || year < 1900 || year > currentYear) errors.year = `Năm xuất bản từ 1900 đến ${currentYear}.`;
 return errors;
}
export function loadFavorites(key: string): Set<string> {
 try {const ids = JSON.parse(localStorage.getItem(key) || '[]'); return new Set(Array.isArray(ids) ? ids.filter(id => typeof id === 'string') : []);} catch {return new Set();}
}
export function saveFavorites(key: string, favorites: Set<string>): boolean {
 try {localStorage.setItem(key, JSON.stringify([...favorites])); return true;} catch {return false;}
}
