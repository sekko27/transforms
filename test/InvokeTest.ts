import { assertEquals, assertThrowsAsync } from "https://deno.land/std@0.83.0/testing/asserts.ts";

import {Invoke} from "../lib/Invoke.ts";
import {InOrder} from "./utils/InOrder.ts";

class CustomError extends Error {}

Deno.test("invoke - should invoke method", async () => {
    class InvokeTest {
        method(): string {
            return "a";
        }
    }
    const inOrder = new InOrder();
    await new Invoke<InvokeTest, "method", []>("method").transform(inOrder.method("m", new InvokeTest(), "method"));
    inOrder.ensure("m");
});

Deno.test("invoke - should fail on invocation failure", async () => {
    class Failure {
        method(): string {
            throw new CustomError();
        }
    }
    assertThrowsAsync(async () => {
        await new Invoke<Failure, "method", []>("method").transform(new Failure());
    }, CustomError);
});

Deno.test("invoke - should returns invocation result", async () => {
    assertEquals(
        await new Invoke<string, "split", [string]>("split", ".").transform("a.b.c"),
        ["a", "b", "c"]
    );
})