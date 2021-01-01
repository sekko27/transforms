import { ITransform } from "./ITransform.ts";

export type InvokeValue<T, A extends any[]> = T extends (...args: A) => infer R | Promise<infer R>
    ? R
    : never;

export class Invoke<S, K extends keyof S, A extends any[]> implements ITransform<S, InvokeValue<S[K], A>> {
    private readonly args: A;
    constructor(private readonly key: K, ...args: A) {
        this.args = args;
    }

    transform(source: S): Promise<InvokeValue<S[K], A>> {
        return (source[this.key] as unknown as Function)(...this.args);
    }
}
