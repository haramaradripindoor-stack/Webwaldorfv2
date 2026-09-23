import re

with open('./app/noticias/[slug]/page.tsx', 'r') as f:
    content = f.read()

# 1. Add import statement near the top
import_statement = "import MDXGallery from '@/components/MDXGallery'\n"
if "MDXGallery" not in content:
    # Insert after import ReactMarkdown
    content = content.replace("import ReactMarkdown from 'react-markdown'", "import ReactMarkdown from 'react-markdown'\n" + import_statement)

# 2. Replace the code block
old_code_block = """                    code: ({node, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      if (match && match[1] === 'gallery') {
                        const images = String(children).trim().split('\\n').filter(Boolean);
                        return (
                          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 my-16 md:my-24 space-y-6">
                            {images.map((src, i) => (
                              <div key={i} className="break-inside-avoid relative rounded-2xl overflow-hidden group">
                                <img 
                                  src={src.trim()} 
                                  alt={`Galería imagen ${i+1}`} 
                                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105" 
                                  loading="lazy" 
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-[#D35D3E]" {...props}>{children}</code>;
                    }"""

new_code_block = """                    code: ({node, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      if (match && match[1] === 'gallery') {
                        const images = String(children).trim().split('\\n').filter(Boolean).map(s => s.trim());
                        return <MDXGallery images={images} />;
                      }
                      return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm text-[#D35D3E]" {...props}>{children}</code>;
                    }"""

content = content.replace(old_code_block, new_code_block)

with open('./app/noticias/[slug]/page.tsx', 'w') as f:
    f.write(content)
