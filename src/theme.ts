export type Theme = 'light' | 'dark';
const key = 'la-sach-theme';
export function getTheme(): Theme {
 const active=document.documentElement.dataset.theme;if(active==='light' || active==='dark')return active;
 try { const saved = localStorage.getItem(key); if(saved === 'light' || saved === 'dark')return saved; } catch {}
 return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function applyTheme(theme: Theme): void {
 document.documentElement.dataset.theme = theme;
 try {localStorage.setItem(key,theme);} catch {}
}
export function initTheme(): void { applyTheme(getTheme()); }
export function bindThemeToggle(button: HTMLButtonElement): void {
 function update(){const dark = getTheme() === 'dark';button.textContent = dark ? '☀ Sáng' : '☾ Tối';button.setAttribute('aria-label',dark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối');button.setAttribute('aria-pressed',String(dark));}
 update();button.addEventListener('click',()=>{applyTheme(getTheme()==='dark'?'light':'dark');update();});
}
