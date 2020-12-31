import { ITransform } from "./ITransform.ts";
import { Dict } from "./Dict.ts";

export type ComposeMap<S, TS extends Dict> = {[k in keyof TS]: ITransform<S, TS[k]>};
export type Composed<TS extends Dict> = {[k in keyof TS]: TS[k]};

export class Compose<S, TS extends Dict> implements ITransform<S, Composed<TS>> {
    constructor(private readonly transforms: ComposeMap<S, TS>) {
    }

    async transform(source: S): Promise<Composed<TS>> {
        const entries = await Promise.all(
            Object.entries(this.transforms).map(async ([key, transform]) => [key, await transform.transform(source)])
        );
        return entries.reduce((memo, [key, transformed]) => ({...memo, [key]: transformed}), {}) as Composed<TS>;
    }
}
