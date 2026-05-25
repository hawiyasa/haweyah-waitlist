import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function migrateImages() {
  // اختبر الاتصال أولاً
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log("Buckets:", buckets?.map(b => b.name), bucketsError);

  const { data: products } = await supabase
    .from("products")
    .select("id, name, image_url")
    .like("image_url", "data:%");

  if (!products?.length) {
    console.log("لا توجد صور base64 للنقل");
    return;
  }

  console.log(`سيتم نقل ${products.length} صورة...`);

  for (const product of products) {
    try {
      const matches = product.image_url.match(/^data:(.+);base64,(.+)$/);
      if (!matches) continue;

      const mimeType = matches[1];
      const base64Data = matches[2];
      const extension = mimeType.includes("png") ? "png" : "jpg";
      const fileName = `${product.id}.${extension}`;
      const buffer = Buffer.from(base64Data, "base64");

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error(`❌ فشل رفع ${product.name}:`, uploadError.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("products")
        .update({ image_url: urlData.publicUrl })
        .eq("id", product.id);

      if (updateError) {
        console.error(`❌ فشل تحديث ${product.name}:`, updateError.message);
      } else {
        console.log(`✅ ${product.name}`);
      }
    } catch (err) {
      console.error(`❌ خطأ في ${product.name}:`, err);
    }
  }

  console.log("✅ انتهى!");
}

migrateImages();