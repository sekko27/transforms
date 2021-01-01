import { ITransform } from "./ITransform.ts";

export class Map<S, T> implements ITransform<Iterable<S>, T[]> {
    constructor(private readonly map: ITransform<S, T>) {
    }

    async transform(source: Iterable<S>): Promise<T[]> {
        const result: T[] = [];
        for (const element of source) {
            result.push(await this.map.transform(element));
        }
        return result;
    }
}
