import { orderSchema } from "@/lib/schemas/order.schema";
import { requireAdmin, deepClean } from "@/lib/apiGuard";

export async function POST(req) {
  if (!requireAdmin(req)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Invalid data" }, { status: 400 });
  }

  const cleanData = deepClean(parsed.data);

  const order = {
    id: `ORD-${Date.now().toString().slice(-8)}`,
    ...cleanData,
  };

  return Response.json({ success: true, order });
}