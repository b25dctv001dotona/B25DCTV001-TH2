export interface Book { id: string; title: string; author: string; genre: string; year: number; color?: string; motif?: string; note?: string; }
export interface BookInput { title: string; author: string; genre: string; year: string | number; }
export type Field = keyof BookInput;
export type Errors = Partial<Record<Field, string>>;
