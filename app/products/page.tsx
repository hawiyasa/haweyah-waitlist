import { supabase } from "../lib/supabase";
import ProductsClient from "./ProductsClient";

export const revalidate = 60; // تحديث الكاش كل دقيقة

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProductsClient products={products || []} />;
}