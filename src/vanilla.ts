import {readStoredBooks,saveBookList,booksStorageKey} from './book-storage.ts';
import type {Book,BookInput,Field} from './types.ts';
import {fetchBooks,createBook} from './books.ts';
import {initTheme,bindThemeToggle} from './theme.ts';
function qs<T extends HTMLElement = HTMLElement>(selector: string): T {const node=document.querySelector<T>(selector);if(!node)throw new Error('Missing element: '+selector);return node;}
function field(name: Field): HTMLInputElement | HTMLSelectElement {return qs<HTMLInputElement | HTMLSelectElement>('#'+name);}
initTheme();
import './style.css';
import {headerMarkup,heroMarkup,footerMarkup,formMarkup} from './layout.ts';
import {element,createBookCard} from './cards.ts';
import {filterBooks,validateBook,loadFavorites,saveFavorites} from './utils.ts';

qs<HTMLElement>('#app').innerHTML = `${headerMarkup()}${heroMarkup}<main class="container main-layout"><section class="catalog" aria-labelledby="catalog-title"><div class="section-heading"><h2 id="catalog-title">Kệ sách của lớp</h2><span class="version-tag">PHẦN A · TYPESCRIPT</span></div><div class="toolbar"><div class="search-wrap"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Tìm tên sách bạn muốn đọc..." aria-label="Tìm sách theo tên"></div><select id="genre-filter" aria-label="Lọc theo thể loại"><option value="">Tất cả thể loại</option></select></div><div class="status-row"><span id="status" role="status">Đang tải...</span><button class="reset" id="reset">Đặt lại bộ lọc</button></div><div class="book-grid" id="book-grid" aria-busy="true"></div></section>${formMarkup}</main>${footerMarkup}<div class="toast" id="toast" role="status"></div><dialog id="delete-dialog" aria-labelledby="delete-title"><h2 id="delete-title">Xóa cuốn sách này?</h2><p id="delete-message"></p><div class="dialog-actions"><button id="cancel-delete">Giữ lại</button><button class="danger" id="confirm-delete">Xóa sách</button></div></dialog>`;
bindThemeToggle(qs<HTMLButtonElement>('#theme-toggle'));
let books: Book[] = [], loading = true, loadError = false, favoritesOnly = false, pendingDelete: string | null = null, deleting = false, adding = false;
const favoritesKey = 'la-sach-vanilla-favorites';
const favorites = loadFavorites(favoritesKey);
const grid = qs('#book-grid');
const status = qs('#status');
const search = qs<HTMLInputElement>('#search');
const genreFilter = qs<HTMLSelectElement>('#genre-filter');
const dialog = qs<HTMLDialogElement>('#delete-dialog');
let toastTimer: ReturnType<typeof setTimeout> | undefined;
function toast(message: string){clearTimeout(toastTimer);qs('#toast').textContent=message;toastTimer=setTimeout(()=>qs('#toast').textContent='',3500);}
function updateGenres(){
 const selected = genreFilter.value;
 genreFilter.replaceChildren(new Option('Tất cả thể loại',''));
 for(const genre of new Set(books.map(book=>book.genre))) genreFilter.append(new Option(genre,genre));
 genreFilter.value=[...genreFilter.options].some(option=>option.value===selected)?selected:'';
}
function render(){
 qs('#favorite-count').textContent=String(favorites.size);
 qs('#favorites-toggle').setAttribute('aria-pressed',String(favoritesOnly));
 grid.setAttribute('aria-busy',String(loading));grid.replaceChildren();
 if(loading){status.textContent='Đang tải...';return;}
 if(loadError){status.textContent='Không thể tải danh sách sách.';const empty=element('div','empty','Có lỗi khi tải dữ liệu. Vui lòng kiểm tra kết nối và thử lại.');const retry=element('button','primary-btn retry','Thử lại');retry.addEventListener('click',loadBooks);empty.append(retry);grid.append(empty);return;}
 const visible = filterBooks(books,search.value,genreFilter.value,favoritesOnly,favorites);
 status.textContent=`Đang hiển thị ${visible.length} / ${books.length} cuốn${favoritesOnly?' · Sách yêu thích':''}`;
 if(!visible.length){const empty=element('div','empty');empty.append(element('h3','',favoritesOnly?'Góc yêu thích còn trống':'Chưa tìm thấy cuốn sách nào'),element('p','',favoritesOnly?'Nhấn ♡ trên một cuốn sách để lưu vào góc này.':'Thử tên sách khác hoặc đặt lại bộ lọc.'));grid.append(empty);}
 const fragment=document.createDocumentFragment();for(const book of visible)fragment.append(createBookCard(book,favorites.has(book.id)));grid.append(fragment);
}
async function loadBooks(){
 loading=true;loadError=false;render();
 try{books=readStoredBooks() ?? await fetchBooks();for(const id of favorites)if(!books.some(book=>book.id===id))favorites.delete(id);saveFavorites(favoritesKey,favorites);updateGenres();}
 catch{loadError=true;}finally{loading=false;render();}
}
search.addEventListener('input',render);genreFilter.addEventListener('change',render);
qs('#favorites-toggle').addEventListener('click',()=>{favoritesOnly=!favoritesOnly;render();});
qs('#reset').addEventListener('click',()=>{search.value='';genreFilter.value='';favoritesOnly=false;render();});
grid.addEventListener('click',event=>{
 const button=event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button[data-action]') : null;if(!button || deleting || adding)return;
 const book=books.find(item=>item.id===button.dataset.id);if(!book)return;
 if(button.dataset.action==='favorite'){
  favorites.has(book.id)?favorites.delete(book.id):favorites.add(book.id);
  if(!saveFavorites(favoritesKey,favorites))toast('Trình duyệt không cho phép lưu yêu thích.');render();
  grid.querySelector<HTMLButtonElement>(`button[data-action="favorite"][data-id="${CSS.escape(book.id)}"]`)?.focus();
 }else{pendingDelete=book.id;qs('#delete-message').textContent=`Bạn có muốn xóa “${book.title}” khỏi thư viện?`;dialog.showModal();qs('#cancel-delete').focus();}
});
function closeDelete(){if(deleting)return;dialog.close();grid.querySelector<HTMLButtonElement>(`button[data-action="delete"][data-id="${CSS.escape(pendingDelete || '')}"]`)?.focus();pendingDelete=null;}
qs('#cancel-delete').addEventListener('click',closeDelete);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeDelete();});
qs('#confirm-delete').addEventListener('click',async()=>{
 if(!pendingDelete || deleting)return;
 const id=pendingDelete;deleting=true;
 const confirm=qs<HTMLButtonElement>('#confirm-delete'),cancel=qs<HTMLButtonElement>('#cancel-delete');
 confirm.disabled=true;cancel.disabled=true;confirm.textContent='Đang xóa...';
 try{const next=books.filter(book=>book.id!==id);if(!saveBookList(next)){toast('Không lưu được thay đổi. Vui lòng cho phép lưu dữ liệu hoặc giải phóng dung lượng trình duyệt.');return;}books=next;favorites.delete(id);saveFavorites(favoritesKey,favorites);dialog.close();pendingDelete=null;updateGenres();render();search.focus();toast('Đã xóa sách khỏi thư viện.');}
 catch{toast('Không xóa được sách. Vui lòng thử lại.');}
 finally{deleting=false;confirm.disabled=false;cancel.disabled=false;confirm.textContent='Xóa sách';}
});
const form=qs<HTMLFormElement>('#add-form');
function values(): BookInput {const data=new FormData(form);return {title:String(data.get('title') || ''),author:String(data.get('author') || ''),genre:String(data.get('genre') || ''),year:String(data.get('year') || '')};}
function showError(name: Field,error?: string){field(name).setAttribute('aria-invalid',String(Boolean(error)));qs(`#${name}-error`).textContent=error||'';}
form.addEventListener('input',event=>{const target=event.target;if(target instanceof HTMLInputElement || target instanceof HTMLSelectElement){const name=target.name as Field;showError(name,validateBook(values())[name]);}});
form.addEventListener('change',event=>{const target=event.target;if(target instanceof HTMLInputElement || target instanceof HTMLSelectElement){const name=target.name as Field;showError(name,validateBook(values())[name]);}});
form.addEventListener('submit',async event=>{
 event.preventDefault();const data=values(),errors=validateBook(data);for(const name of ['title','author','genre','year'] as const)showError(name,errors[name]);
 if(Object.keys(errors).length){field(Object.keys(errors)[0] as Field).focus();return;}
 if(loading||loadError){toast('Vui lòng tải danh sách sách thành công trước khi thêm.');return;}
 if(adding || deleting)return;adding=true;
 const submit=qs<HTMLButtonElement>('#add-form button[type="submit"]');submit.disabled=true;submit.textContent='Đang thêm...';
 try{const book=createBook({...data,title:data.title.trim(),author:data.author.trim()});const next=[book,...books];if(!saveBookList(next)){toast('Không lưu được sách. Nội dung form được giữ lại; hãy kiểm tra dung lượng và quyền lưu dữ liệu trình duyệt.');return;}books=next;form.reset();search.value='';genreFilter.value='';favoritesOnly=false;updateGenres();render();toast('Đã thêm sách mới lên đầu kệ sách.');}
 catch{toast('Không thêm được sách. Nội dung form được giữ lại; hãy thử lại.');}
 finally{adding=false;submit.disabled=false;submit.textContent='＋ Thêm vào thư viện';}

});
window.addEventListener('storage',event=>{if(event.key===booksStorageKey || event.key===null){closeDelete();void loadBooks();}});
loadBooks();
