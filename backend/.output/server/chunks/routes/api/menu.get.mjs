import { c as defineEventHandler } from '../../_/nitro.mjs';
import { M as MENU_ITEMS } from '../../_/store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

const menu_get = defineEventHandler(() => {
  return { success: true, data: MENU_ITEMS };
});

export { menu_get as default };
//# sourceMappingURL=menu.get.mjs.map
