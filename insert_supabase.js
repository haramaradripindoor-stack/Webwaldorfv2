const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function insert() {
  const { data, error } = await supabase.from('noticias').insert([
    {
      title: "El arte de ser comunidad: La madurez adulta y el cuidado del organismo escolar",
      slug: "2026-10-06-limites-respeto-corresponsabilidad-comunidad-waldorf",
      excerpt: "Una escuela Waldorf no es una empresa de servicios, sino un organismo vivo. Construir comunidad exige corresponsabilidad, comunicación sana y la voluntad de educar a través de nuestro propio ejemplo como adultos.",
      published_at: "2026-10-06T12:00:00Z",
      image_url: "/imagenes-web/galeria5.webp"
    }
  ]);
  if (error) console.error("Error:", error);
  else console.log("Success inserting to Supabase!");
}
insert();
