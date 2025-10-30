import type * as VAN from "https://vanjs.org/code/van-1.5.5.d.ts";
import type * as VANX from "https://vanjs.org/code/van-x-0.6.3.d.ts";
type Replace<T extends object, K extends keyof T, R> = Omit<T, K> & { readonly [P in K]: R };
declare module "vanjs-core" { export type State<T> = VAN.State<T> }
declare global
{
    namespace Van { export type * from "https://vanjs.org/code/van-1.5.5.d.ts"; }
    namespace VanX { export type * from "https://vanjs.org/code/van-x-0.6.3.d.ts"; }
    const van: Replace<VAN.Van, "state", <T>(arg:T, HMRKey?:string)=>VAN.State<T>>
    const vanX: Replace<typeof VANX, "reactive", <T extends object>(obj: T, HMRKey?:string) => T> & {Store:<T>(obj:T, key:string)=>T}
}

declare global {

    namespace Gale { 
        type KeyQuery = "@";
        type KeyState = ":";
        type KeyChild = ".";
        type KeyGroup = "^";
        type UserStyles = Partial<CSSStyleDeclaration> & {[key: `${KeyQuery|KeyState|KeyChild|KeyGroup}${string}`]: UserStyles }
        type UserSheet = Record<string, UserStyles>
        type CollectKeys<Obj> = {[Key in keyof Obj]: Obj[Key] extends object ? Key | CollectKeys<Obj[Key]> : Key }[keyof Obj]
        type FilterKeys<Keys> = Keys extends `${KeyChild|KeyGroup}${infer Rest}` ? Keys : never
        type CrossMultiply<A, B> = A extends string ? B extends string ? `${A}${B}` : never : never 
        type CrossMultiplyRecord<Rec> = keyof Rec | { [K in keyof Rec]: K extends string ? CrossMultiply<K, FilterKeys<CollectKeys<Rec[K]>>> : never }[keyof Rec]
        type Tier = (selector:string, obj:UserStyles, suffix:string)=>string;
        type CreateSheet = <T extends UserSheet>(sheet:UserSheet&T, hash?:string)=>{
            Tag:(...args:CrossMultiplyRecord<T>[])=>string,
            CSS:string,
            DOM:Elemental<CrossMultiplyRecord<T>>,
            Div:Circular<CrossMultiplyRecord<T>, Van.TagFunc<HTMLDivElement>>
        }
        

        type Elemental<T extends string> = {[K in keyof HTMLElementTagNameMap]: Van.TagFunc<HTMLElementTagNameMap[K]>&Circular<T, Van.TagFunc<HTMLElementTagNameMap[K]>>}

        type Circular<Keys extends string, Func> = {
            [K in Keys]: Circular<Keys, Func>&Func
        };
    }

    const Gale:Gale.CreateSheet

}

