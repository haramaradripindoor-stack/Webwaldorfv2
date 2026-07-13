import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
    const { data, error } = await supabase.from(tableName).select('*').limit(5);
    if (error) {
        return { exists: false, error: error.message };
    }
    return { exists: true, rows: data.length, sample: data[0] };
}

async function run() {
    const tablesToCheck = [
        'homepage_content',
        'noticias',
        'actividades',
        'faqs',
        'lead_magnets',
        'recursos',
        'bot_settings',
        'blog_posts'
    ];
    
    console.log("=== DB AUDIT REPORT ===");
    for (const table of tablesToCheck) {
        const result = await checkTable(table);
        console.log(`Table: ${table}`);
        if (result.exists) {
            console.log(`  Exists: YES`);
            console.log(`  Rows found: ${result.rows}${result.rows === 5 ? '+' : ''}`);
            if (result.rows > 0) {
                // check for broken /images/ links in string fields
                let hasBrokenLinks = false;
                const sampleStr = JSON.stringify(result.sample);
                if (sampleStr.includes('"/images/')) {
                    hasBrokenLinks = true;
                }
                console.log(`  Has broken local /images/ paths in sample: ${hasBrokenLinks ? 'YES' : 'NO'}`);
                if (table === 'homepage_content' || table === 'bot_settings') {
                    console.log(`  Sample keys: ${Object.keys(result.sample).join(', ')}`);
                }
            } else {
                console.log(`  WARNING: Table is empty!`);
            }
        } else {
            console.log(`  Exists: NO (${result.error})`);
        }
        console.log('-------------------------');
    }
}

run();
