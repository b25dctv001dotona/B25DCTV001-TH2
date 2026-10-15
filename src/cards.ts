import type {Book} from './types.ts';
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
 const node = document.createElement(tag);
 if (className) node.className = className;
 if (text !== undefined) node.textContent = text;
 return node;
}
export function createBookCard(book: Book, favorite: boolean): HTMLElement {
 const card = element('article','book-card');
 const stage = element('div','cover-stage');
 const cover = element('div','cover'); cover.style.setProperty('--cover',book.color || '#698675'); cover.setAttribute('aria-hidden','true');
 cover.append(element('span','cover-title',book.title), element('span',`motif ${book.motif || 'sun'}`), element('span','cover-author',book.author));
 stage.append(cover,element('span','year',String(book.year)));
 const body = element('div','card-body');
 body.append(element('span','genre-tag',book.genre), element('h3','',book.title),element('p','author',book.author));
 const actions = element('div','card-actions');
 const fav = element('button',`favorite-btn${favorite?' selected':''}`);
 fav.type='button'; fav.dataset.action='favorite';fav.dataset.id=book.id;fav.setAttribute('aria-pressed',String(favorite));fav.setAttribute('aria-label',`${favorite?'Bỏ yêu thích':'Yêu thích'} ${book.title}`);
 fav.append(element('span','heart',favorite?'♥':'♡'),document.createTextNode(favorite?'Đã yêu thích':'Yêu thích'));
 const del = element('button','delete-btn','Xóa');del.type='button';del.dataset.action='delete';del.dataset.id=book.id;del.setAttribute('aria-label',`Xóa ${book.title}`);
 actions.append(fav,del);body.append(actions);card.append(stage,body);return card;
}
