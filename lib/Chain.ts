import { ITransform } from "./ITransform.ts";

export class Chain<S, T, I0 extends I1, I1> implements ITransform<S, T> {
    constructor(private readonly first: ITransform<S, I0>, private readonly second: ITransform<I1, T>) {
    }

    async transform(source: S): Promise<T> {
        return this.second.transform(await this.first.transform(source));
    }
}
