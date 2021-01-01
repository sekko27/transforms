import { ITransform } from "./ITransform.ts";
import { Result } from "./Result.ts";

export class Functional<S, T> implements ITransform<S, T> {
    constructor(private readonly func: (source: S) => Result<T>) {
    }

    transform(source: S): Result<T> {
        return this.func(source);
    }
}
