import { effect, createSignal } from "@mainframework/signals";
import { domSignal } from "@mainframework/signals/dom";
import { markDomDirty } from "@mainframework/signals/dom/internal";
const count = createSignal("c", 0);
const dom = domSignal("x", null);
effect(() => {
  let _wrote_dom = false;
  try {
    const _v = String(count());
    const _el = dom.element;
    if (_el) {
      _el.textContent = _v;
      _wrote_dom = true;
    }
  } finally {
    if (_wrote_dom) markDomDirty(dom);
  }
});
