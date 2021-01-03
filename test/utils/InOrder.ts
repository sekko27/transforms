import { assertEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";

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

    fail<S>(id: string): ITransform<S, S> {
        return this.transform<S, S>(id, (source: S) => {
            throw new Error("Failure");
        });
    }
    ensure(...expected: string[]): void {
        assertEquals(expected, this.calls);
    }
}