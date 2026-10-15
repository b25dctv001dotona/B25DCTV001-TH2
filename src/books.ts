import type {Book,BookInput} from './types.ts';
export function parseBook(value: unknown): Book {
 if(!value || typeof value !== 'object')throw new Error('Dữ liệu sách không hợp lệ.');
 const item = value as Record<string,unknown>;
 if(!['string','number'].includes(typeof item.id) || !String(item.id).trim() || typeof item.title!=='string' || typeof item.author!=='string' || typeof item.genre!=='string' || !['number','string'].includes(typeof item.year) || String(item.year).trim()==='' || !Number.isInteger(Number(item.year)))throw new Error('Dữ liệu sách không hợp lệ.');
 return {id:String(item.id),title:item.title,author:item.author,genre:item.genre,year:Number(item.year),color:typeof item.color==='string'?item.color:undefined,motif:typeof item.motif==='string'?item.motif:undefined};
}

export async function fetchBooks(fetcher: typeof fetch = fetch): Promise<Book[]> {
 const response=await fetcher('/books.json',{signal:AbortSignal.timeout(15000)});
 if(!response.ok)throw new Error('Không tải được sách: HTTP '+response.status);
 const data:unknown=await response.json();
 if(!Array.isArray(data))throw new Error('Danh sách sách không hợp lệ.');
 return data.map(parseBook);
}
export function createBook(input: BookInput): Book {
 return {...input,year:Number(input.year),id:crypto.randomUUID(),color:'#698675',motif:'flower'};
}
