import { Result } from "./Result.ts";

export interface ITransform<S, T> {
    transform(source: S): Result<T>;
}
