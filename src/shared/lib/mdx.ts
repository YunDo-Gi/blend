import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { evaluate } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { mdxComponents } from '@/shared/ui/mdx-components';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMetadata {
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface PostData {
  content: string;
  mdxSource: React.ReactElement;
  metadata: PostMetadata;
  toc: TocItem[];
}


// TOC 추출 함수
function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (id && title) {
      toc.push({ id, title, level });
    }
  }

  return toc;
}

export async function getMDXContent(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // TOC 추출
  const toc = extractToc(content);

  // MDX 컴파일
  const { content: mdxSource } = await evaluate({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeHighlight, {
            detect: true,
            ignoreMissing: true,
          }],
        ],
      },
    },
    components: mdxComponents,
  });

  return {
    content,
    mdxSource,
    metadata: {
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || [],
    },
    toc,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter((name) => name.endsWith('.mdx')).map((name) => name.replace(/\.mdx$/, ''));
}

export async function getAllPosts(): Promise<PostData[]> {
  const slugs = getAllPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      try {
        return await getMDXContent(slug);
      } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
      }
    }),
  );

  return posts.filter(Boolean) as PostData[];
}
