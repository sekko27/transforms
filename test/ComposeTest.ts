import { assertEquals, assertThrowsAsync } from "https://deno.land/std@0.83.0/testing/asserts.ts";

import {Compose} from "../lib/Compose.ts";
import {InOrder} from "./utils/InOrder.ts";
import {Transforms} from "../lib/Transforms.ts";

class CustomError extends Error {}

Deno.test("compose - should return empty object on no transforms", async () => {
    const result = await new Compose({}).transform("test");
    assertEquals({}, result);
});

Deno.test("compose - should call all nested transforms", async () => {
    const inOrder = new InOrder();
    await new Compose({
        a: inOrder.identity("a"),
        b: inOrder.identity("b"),
        c: inOrder.identity("c"),
    }).transform("test");
    inOrder.includes("a", "b", "c");
});

Deno.test("compose - should fail on nested failure", async () => {
    await assertThrowsAsync(async () => {
        const inOrder = new InOrder();
        await new Compose({
            a: inOrder.identity("a"),
            b: inOrder.fail("b", () => new CustomError()),
            c: inOrder.identity("c")
        }).transform("test");
    }, CustomError);
});

Deno.test("compose - should transform properly", async () => {
    const inOrder = new InOrder();
    const result = await new Compose({
        a: Transforms(() => "a"),
        b: Transforms(() => 2),
        c: Transforms((source: string) => `${source} c`)
    }).transform("test");
    assertEquals(result, {a: "a", b: 2, c: "test c"});
})