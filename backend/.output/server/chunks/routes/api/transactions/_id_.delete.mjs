import { c as defineEventHandler, g as getRouterParam, e as createError } from '../../../_/nitro.mjs';
import { d as deleteTransaction } from '../../../_/store.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

const _id__delete = defineEventHandler((event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "ID transaksi diperlukan" });
  }
  const deleted = deleteTransaction(id);
  if (!deleted) {
    throw createError({ statusCode: 404, message: "Transaksi tidak ditemukan" });
  }
  return { success: true, message: `Transaksi ${id} berhasil dihapus` };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
