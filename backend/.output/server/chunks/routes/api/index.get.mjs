import { c as defineEventHandler, f as getQuery } from '../../_/nitro.mjs';
import { g as getTransactions } from '../../_/store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

const index_get = defineEventHandler((event) => {
  const query = getQuery(event);
  const filter = query.filter;
  let data = getTransactions();
  if (filter) {
    const now = /* @__PURE__ */ new Date();
    data = data.filter((t) => {
      const tDate = new Date(t.time);
      if (filter === "Harian") {
        return tDate.getDate() === now.getDate() && tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      } else if (filter === "Mingguan") {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
        return tDate >= oneWeekAgo && tDate <= now;
      } else if (filter === "Bulanan") {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }
  return { success: true, data };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
