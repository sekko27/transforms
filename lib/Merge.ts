import { ITransform } from "./ITransform.ts";
import { Dict } from "./Dict.ts";

/**
 * Hint: Rest matches against zero types.
 */

export type Merged<TS extends readonly E[], E = Dict> = TS extends [infer U1_2 , infer U2_2, ...infer R_2]
    ? R_2 extends E[] ? U1_2 & Merged<[U2_2, ...R_2]> : never
    : TS extends [infer U, ...infer R] ? U : never;

export type MergeTransforms<S, TS extends E[], E = Dict> = TS extends [infer U1_2, infer U2_2, ...infer R_2]
    ? R_2 extends E[] ? [ITransform<S, U1_2>, ...MergeTransforms<S, [U2_2, ...R_2]>] : never
    : TS extends [infer U, ...infer R] ? [ITransform<S, U>] : never;

export class Merge<S, TS extends E[], E = Dict> implements ITransform<S, Merged<TS>> {
    private readonly transforms: MergeTransforms<S, TS>;

    constructor(...transforms: MergeTransforms<S, TS>) {
        this.transforms = transforms;
    }

    async transform(source: S): Promise<Merged<TS>> {
        const segments: any[] = await Promise.all(this.transforms.map(transform => transform.transform(source)));
        return segments.reduce((memo, current) => ({...memo, ...current}), {}) as Merged<TS>;
    }
}
