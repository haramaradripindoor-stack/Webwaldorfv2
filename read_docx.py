import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
        
        tree = ET.fromstring(xml_content)
        
        # Namespaces are usually something like:
        # xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
        namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
        
        text = []
        for p in tree.findall('.//w:p', namespaces):
            para_text = []
            for r in p.findall('.//w:r', namespaces):
                t = r.find('./w:t', namespaces)
                if t is not None and t.text:
                    para_text.append(t.text)
            text.append(''.join(para_text))
            
        return '\n'.join(text)
    except Exception as e:
        return str(e)

print(extract_text_from_docx("/Users/felipeandresvivancocornejo/Downloads/Comunicaciones/Estrategia_Comunicaciones_Trekan.docx")[:2000])
