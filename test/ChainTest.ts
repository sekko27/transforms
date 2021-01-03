import {Chain} from "../lib/Chain.ts";
import {InOrder} from "./utils/InOrder.ts";
import { fail } from "https://deno.land/std@0.83.0/testing/asserts.ts";

Deno.test("chain should execute in order", async () => {
    const inOrder = new InOrder();
    await new Chain(inOrder.identity("t1"), inOrder.identity("t2")).transform("test");
    inOrder.ensure("t1", "t2");
});

Deno.test("should throw error on first failure", async () => {
    const inOrder = new InOrder();
    try {
        await new Chain(inOrder.fail("t1"), inOrder.identity("t2")).transform("test");
        fail("chain should throw error");
    } catch (err) {}
});

Deno.test("should throw error on second failure", async () => {
    const inOrder = new InOrder();
    try {
        await new Chain(inOrder.identity("t1"), inOrder.fail("t2")).transform("test");
    } catch (err) {
        inOrder.ensure("t1", "t2");
    }
});

Deno.test("second should not be called when first fails", async () => {
    const inOrder = new InOrder();
    try {
        await new Chain(inOrder.fail("t1"), inOrder.identity("t2")).transform("test");
        fail("chain should throw error");
    } catch (err) {
        inOrder.ensure("t1");
    }
});

