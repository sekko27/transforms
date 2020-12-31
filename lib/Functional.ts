import { ITransform } from "./ITransform.ts";

export class Functional<S, T> implements ITransform<S, T> {
    constructor(private readonly func: (source: S) => Promise<T>) {
    }

    transform(source: S): Promise<T> {
        return this.func(source);
    }
}
