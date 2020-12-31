import { ITransform } from "./ITransform.ts";
import { Chain } from "./Chain.ts";
import { Merge, Merged, MergeTransforms } from "./Merge.ts";
import { Compose, Composed, ComposeMap } from "./Compose.ts";
import { Dict } from "./Dict.ts";
import { Functional } from "./Functional.ts";

export interface ChainFunction<S, T> {
    transform(source: S): Promise<T>;
    <N>(next: ITransform<T, N>): ChainFunction<S, N>;
}

export interface MergeFunction<S, TS extends E[], E = Dict> {
    transform(source: S): Promise<Merged<TS>>;
    <N>(next: ITransform<S, N>): MergeFunction<S, [...TS, N]>;
}

export const Transforms = <S, T>(func: (source: S) => Promise<T>) => new Functional(func);

Transforms.chain = <S, T>(first: ITransform<S, T>): ChainFunction<S, T> => {
    const result = <N>(next: ITransform<T, N>): ChainFunction<S, N> => Transforms.chain(new Chain(first, next));
    result.transform = (source: S): Promise<T> => first.transform(source);
    return result;
}

function _merge<S, TS extends E[], E = Dict>(transforms: MergeTransforms<S, TS>): MergeFunction<S, TS> {
    const result = <N>(next: ITransform<S, N>): MergeFunction<S, [...TS, N]> => {
        return _merge([...transforms, next] as unknown as MergeTransforms<S, [...TS, N]>);
    }
    result.transform = (source: S): Promise<Merged<TS>> => (new Merge(...transforms)).transform(source);
    return result;
}
    
Transforms.merge = <S, TS extends E, E = Dict>(transform: ITransform<S, E>): MergeFunction<S, [E]> => _merge([transform]);

Transforms.compose = <S, TS extends Dict>(transforms: ComposeMap<S, TS>): ITransform<S, Composed<TS>> => {
    return new Compose(transforms);
}

const c = Transforms.compose({
    numberOfAs: Transforms.chain
        (Transforms(async (s: string) => s.replace(/[^a]/g, "")))
        (Transforms(async (s) => s.length)),
    meta: Transforms.merge(
            Transforms.compose({
                l: Transforms.chain(Transforms(async (s: string) => s.replace(/[^l]/g, "")))(Transforms(async (s: string) => s.length)),
            })
        )
        (
            Transforms.compose({
                x: Transforms(async (s) => `x ${s}`),
                y: Transforms(async (s) => `y ${s}`)
            })
        )
});

console.log(await c.transform("lala"));
