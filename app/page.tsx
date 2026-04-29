import { supabase } from "./lib/supabase";
import HomeClient from "./HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const { data: featured } = await supabase
    .from("products")
    .select("*")
    .limit(4)
    .order("created_at", { ascending: false });

  return <HomeClient initialFeatured={featured || []} />;
}