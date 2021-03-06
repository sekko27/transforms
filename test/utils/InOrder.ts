import { assertEquals, assertArrayIncludes } from "https://deno.land/std@0.83.0/testing/asserts.ts";

import {Result} from "../../lib/Result.ts";
import {ITransform} from "../../lib/ITransform.ts";
import {Transforms} from "../../lib/Transforms.ts";

export class InOrder {
    private readonly calls: string[] = [];

    transform<S, T = S>(id: string, fun: (source: S) => Result<T>): ITransform<S, T> {
        return Transforms((source: S) => {
            this.calls.push(id);
            return fun(source);
        });
    }

    identity<S>(id: string): ITransform<S, S> {
        return this.transform<S, S>(id, (source: S) => source);
    }

    fail<S>(id: string, errorFactory: () => Error = () => new Error("Failure")): ITransform<S, S> {
        return this.transform<S, S>(id, (source: S) => {
            throw errorFactory();
        });
    }

    method<C extends object, M extends keyof C, A extends any[]>(id: string, instance: C, method: M): C {
        return new Proxy(instance, {
            get: (target, name, args) => {
                if (method === name) {
                    this.calls.push(id);
                }
                return Reflect.get(target, name, args);
            }
        });
    }
    ensure(...expected: string[]): void {
        assertEquals(this.calls, expected);
    }

    includes(...expected: string[]): void {
        assertArrayIncludes(this.calls, expected);
    }
}
