export interface ITransform<S, T> {
    transform(source: S): Promise<T>;
}
