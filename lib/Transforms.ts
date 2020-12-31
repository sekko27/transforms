import { ITransform } from "./ITransform.ts";
import { Chain } from "./Chain.ts";
import { Dict, Merge, Merged, MergeTransforms } from "./Merge.ts";

export interface ChainFunction<S, T> {
    transform(source: S): Promise<T>;
    <N>(next: ITransform<T, N>): ChainFunction<S, N>;
}

export interface MergeFunction<S, TS extends E[], E = Dict> {
    transform(source: S): Promise<Merged<TS>>;
    <N>(next: ITransform<S, N>): MergeFunction<S, [...TS, N]>;
}
export class Transforms {
    public static chain<S, T>(first: ITransform<S, T>): ChainFunction<S, T> {
        const result = <N>(next: ITransform<T, N>): ChainFunction<S, N> => Transforms.chain(new Chain(first, next));
        result.transform = (source: S): Promise<T> => first.transform(source);
        return result;
    }

    private static _merge<S, TS extends E[], E = Dict>(transform: MergeTransforms<S, TS>): MergeFunction<S, TS> {
        const result = <N>(next: ITransform<S, N>): MergeFunction<S, [...TS, N]> => {
            return Transforms._merge([...transform, next] as unknown as MergeTransforms<S, [...TS, N]>);
        }
        result.transform = (source: S): Promise<Merged<TS>> => (new Merge(...transform)).transform(source);
        return result;
    }
    
    public static merge<S, TS extends E, E = Dict>(transform: ITransform<S, E>): MergeFunction<S, [E]> {
        return Transforms._merge([transform]);
    }
}
