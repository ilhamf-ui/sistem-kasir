import { c as defineEventHandler } from '../../_/nitro.mjs';
import { J as JASUKE_TOPPINGS } from '../../_/store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

const toppings_get = defineEventHandler(() => {
  return { success: true, data: JASUKE_TOPPINGS };
});

export { toppings_get as default };
//# sourceMappingURL=toppings.get.mjs.map
