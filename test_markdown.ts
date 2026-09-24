import { getMarkdownPosts } from './lib/markdown';

const posts = getMarkdownPosts('_noticias');
const post = posts.find(p => p.slug === '2026-09-22-celebracion-fiestas-patrias-comunidad');
console.log(post?.image_url);
