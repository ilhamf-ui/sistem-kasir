import { c as defineEventHandler, r as readBody, e as createError } from '../../_/nitro.mjs';
import { a as addTransaction } from '../../_/store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

const index_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.items || !Array.isArray(body.items)) {
    throw createError({ statusCode: 400, message: "Data transaksi tidak valid" });
  }
  const trx = {
    id: `TRX-${Date.now()}`,
    cashier: body.cashier || "Kasir",
    shift: body.shift || 1,
    items: body.items,
    total: body.total || 0,
    received: body.received || 0,
    change: body.change || 0,
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  addTransaction(trx);
  return { success: true, data: trx };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
