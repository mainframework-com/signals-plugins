import { effect, createSignal } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";

const count = createSignal("c", 0);
const dom = domSignal("x", null);
effect(() => {
  dom.textContent = String(count());
});
