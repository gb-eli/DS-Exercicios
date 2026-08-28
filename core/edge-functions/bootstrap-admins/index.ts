import "jsr:@supabase/functions-js/edge-runtime.d.ts";
Deno.serve(()=>new Response(JSON.stringify({disabled:true}),{status:410,headers:{"content-type":"application/json"}}));
