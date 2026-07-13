import https from 'https';

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve('Error'));
  });
}

async function run() {
    const status1 = await checkUrl('https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/galeria3.webp');
    console.log("galeria3.webp status:", status1);
    
    const status2 = await checkUrl('https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/comunidad.jpg');
    console.log("comunidad.jpg status:", status2);
    
    const status3 = await checkUrl('https://ebpioebxcyjpjgiqpjaw.supabase.co/storage/v1/object/public/imagenes-web/actividapedagogicahumedales1.jpg');
    console.log("actividapedagogicahumedales1.jpg status:", status3);
}

run();
