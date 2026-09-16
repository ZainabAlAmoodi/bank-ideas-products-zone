import { Dashboard } from "@/components/Dashboard";
import { getProducts } from "@/lib/queries";

// This dashboard should always show the current state of the database
// (especially right after re-running `npm run seed`), not a cached build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { products, source } = await getProducts();
  return <Dashboard products={products} dataSource={source} />;
}
