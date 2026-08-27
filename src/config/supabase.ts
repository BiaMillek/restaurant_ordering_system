import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.supabaseUrl!;
const supabaseSecretKey = process.env.supabaseSecretKey!;

const supabase = createClient(
    supabaseUrl,
    supabaseSecretKey,
);

export default supabase;
