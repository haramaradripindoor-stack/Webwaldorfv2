import os
import requests

url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
headers = {'apikey': key, 'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}

updates = {
    "el-ritmo-waldorf-y-la-ciencia-del-aprendizaje": """\n\n---\n**Fuentes y Evidencia Científica:**\n- [Pediatrics (AAP) - School Start Times, Sleep, and Youth Outcomes: A Meta-analysis](https://publications.aap.org/pediatrics/article/149/6/e2021054068/188062/School-Start-Times-Sleep-and-Youth-Outcomes-A-Meta)\n- [Sleep and cognitive performance in children and pre-adolescents: a review (Tandfonline)](https://www.tandfonline.com/doi/full/10.1080/09291016.2013.790136)""",
    
    "colegio-waldorf-puerto-varas-educacion-sin-pantallas-2026": """\n\n---\n**Fuentes y Evidencia Científica:**\n- [Digital Media Use and Child Health and Development: A Systematic Review and Meta-Analysis (PubMed)](https://pubmed.ncbi.nlm.nih.gov/41801211/)\n- [Revisión sobre niños de 0–36 meses y pantallas (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0001691826002398)""",
    
    "jardin-infantil-waldorf-el-valor-del-juego-libre-y-la-naturaleza-1783724379360": """\n\n---\n**Fuentes y Evidencia Científica:**\n- [The impact of free play on school-aged children’s mental wellbeing (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S2212657026000474)\n- [Benefits of nature exposure on cognitive functioning in children and adolescents (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0272494424001099)""",
    
    "cerebro-social-aula-multigrado": """\n\n---\n**Fuentes y Evidencia Científica:**\n- [Challenges and Opportunities of Multi-Grade Teaching: A Systematic Review (MDPI Education Sciences)](https://www.mdpi.com/2227-7102/15/8/1052)\n- [Classroom climate and children’s academic and psychological wellbeing (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0273229720300186)""",
    
    "horario-neurociencia-colegio-trekan": """\n\n---\n**Fuentes y Evidencia Científica:**\n- [School Start Times, Sleep, and Youth Outcomes: A Meta-analysis (PubMed Central)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9665092/)\n- [Impact of delaying school start time on adolescent sleep, mood, and behavior (PubMed)](https://pubmed.ncbi.nlm.nih.gov/26545246/)"""
}

# Fetch articles
res = requests.get(f"{url}/rest/v1/noticias?select=id,slug,content", headers=headers)
articles = res.json()

for art in articles:
    slug = art.get('slug')
    if slug in updates:
        current_content = art.get('content', '')
        # Only append if not already there
        if "Fuentes y Evidencia" not in current_content:
            new_content = current_content + updates[slug]
            patch_res = requests.patch(f"{url}/rest/v1/noticias?id=eq.{art['id']}", headers=headers, json={"content": new_content})
            print(f"Updated slug: {slug} - Status: {patch_res.status_code}")
        else:
            print(f"Already updated slug: {slug}")

