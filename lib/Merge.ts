import { ITransform } from "./ITransform.ts";

type Dict = {[k: string]: any};
/**
 * Hint: Rest matches against zero types.
 */

export type Merged<TS extends readonly E[], E = Dict> = TS extends [infer U1_2 , infer U2_2, ...infer R_2]
    ? R_2 extends E[] ? U1_2 & Merged<[U2_2, ...R_2]> : never
    : TS extends [infer U, ...infer R] ? U : never;

export type MergeTransforms<S, TS extends E[], E = Dict> = TS extends [infer U1_2, infer U2_2, ...infer R_2]
    ? R_2 extends E[] ? [ITransform<S, U1_2>, ...MergeTransforms<S, [U2_2, ...R_2]>] : never
    : TS extends [infer U, ...infer R] ? [ITransform<S, U>] : never;

class Merge<S, TS extends E[], E = Dict> implements ITransform<S, Merged<TS>> {
    private readonly transforms: MergeTransforms<S, TS>;

    constructor(...transforms: MergeTransforms<S, TS>) {
        this.transforms = transforms;
    }

    async transform(source: S): Promise<Merged<TS>> {
        const segments: any[] = await Promise.all(this.transforms.map(transform => transform.transform(source)));
        return segments.reduce((memo, current) => ({...memo, ...current}), {}) as Merged<TS>;
    }
}

const m = new Merge<string, [string, {l: number}], any>(
    {async transform(source: string) {return `! ${source}`;}},
    {async transform(source: string) {return {l: source.length}; }}
);

console.log(await m.transform("ok"));
