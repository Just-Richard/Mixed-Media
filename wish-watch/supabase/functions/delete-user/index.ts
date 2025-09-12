// supabase/functions/delete-user/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


// Environment variables
const SUPABASE_URL = Deno.env.get("DATABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("DATABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Common headers for CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete from public "users" table
    const { error: userError } = await supabase.from("users").delete().eq("id", userId);
    if (userError) throw userError;

    // Delete from auth.users (requires service role key)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Delete user error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

//     const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
//       global: { headers: { Authorization: authHeader } },
//     });

//     const { userId } = await req.json().catch(() => ({}));
//     if (!userId) {
//       return new Response(JSON.stringify({ error: "Missing userId" }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const supabaseUserScoped = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
//       global: { headers: { Authorization: `Bearer ${token}` } },
//     });
//     const { data: userData, error: getUserErr } = await supabaseUserScoped.auth.getUser();
//     if (getUserErr || !userData?.user || userData.user.id !== userId) {
//       return new Response(JSON.stringify({ error: "Unauthorized" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // 1) Delete rows in child tables first (avoid FK issues)
//     const { error: mediaErr } = await supabaseAdmin.from("media_list").delete().eq("user_id", userId);
//     if (mediaErr) {
//       return new Response(JSON.stringify({ error: mediaErr.message }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // 2) Delete profile row
//     const { error: profileErr } = await supabaseAdmin.from("users").delete().eq("id", userId);
//     if (profileErr) {
//       return new Response(JSON.stringify({ error: profileErr.message }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     // 3) Delete auth account (removes ability to log in with that email)
//     const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
//     if (authErr) {
//       return new Response(JSON.stringify({ error: authErr.message }), {
//         status: 400,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (e) {
//     console.error(e);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// });