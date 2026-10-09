import { createClient } from "@supabase/supabase-js";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Configure SUPABASE_URL e SUPABASE_SECRET_KEY no arquivo .env.");
const supabase = createClient(url, key);
export default supabase;
