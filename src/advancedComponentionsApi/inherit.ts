import {AudioHTMLAttributes, ButtonHTMLAttributes, CanvasHTMLAttributes, ColHTMLAttributes, FormHTMLAttributes, HTMLAttributes, HtmlHTMLAttributes, IframeHTMLAttributes, ImgHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, LiHTMLAttributes, TableHTMLAttributes, TdHTMLAttributes, TextareaHTMLAttributes,} from "vue";

export type InheritAttributes<T> =
    T extends typeof HTMLAudioElement ? AudioHTMLAttributes:
    T extends typeof HTMLButtonElement ? ButtonHTMLAttributes:
    T extends typeof HTMLCanvasElement ? CanvasHTMLAttributes:
    T extends typeof HTMLTableColElement ? ColHTMLAttributes:
    T extends typeof HTMLFormElement ? FormHTMLAttributes:
    T extends typeof HTMLIFrameElement ? IframeHTMLAttributes:
    T extends typeof HTMLImageElement ? ImgHTMLAttributes:
    T extends typeof HTMLInputElement ? InputHTMLAttributes:
    T extends typeof HTMLLabelElement ? LabelHTMLAttributes:
    T extends typeof HTMLLIElement ? LiHTMLAttributes:
    T extends typeof HTMLTableElement ? TableHTMLAttributes:
    T extends typeof HTMLTextAreaElement ? TextareaHTMLAttributes:
    T extends typeof HTMLTableCellElement ? TdHTMLAttributes:
    T extends typeof HTMLDivElement ? HTMLAttributes :
    T extends typeof HTMLElement ? HtmlHTMLAttributes:T


// type A = InheritAttributes<typeof HTMLTableCellElement>
