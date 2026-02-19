import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Post } from '@/shared/types/api';
import { extractTocFromBlocks } from '@/shared/lib/toc';
import PostHeader from '@/domain/post-detail/components/post-header';
import PostContent from '@/domain/post-detail/components/post-content';
import CommentsSection from '@/domain/post-detail/components/comments-section';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';
import PostPageClientFallback from '@/domain/post-detail/components/post-page-client-fallback';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const SERVER_API_BASE_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://tteokyi.com';

async function getPost(id: string): Promise<Post | null> {
  const reqHeaders = await headers();
  const cookie = reqHeaders.get('cookie') ?? '';
  const base = SERVER_API_BASE_URL.replace(/\/+$/, '');

  const response = await fetch(`${base}/api/v1/post/${id}`, {
    method: 'GET',
    headers: cookie ? { Cookie: cookie } : undefined,
    cache: 'no-store',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch post ${id}: ${response.status}`);
  }

  return (await response.json()) as Post;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  let post: Post | null = null;

  try {
    post = await getPost(slug);
  } catch (error) {
    console.error(`[posts/${slug}] server fetch failed, fallback to client fetch:`, error);
    return <PostPageClientFallback slug={slug} />;
  }

  if (!post) {
    notFound();
  }

  const toc = extractTocFromBlocks(post.blocks);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center gap-8">
        {/* 메인 컨텐츠 */}
        <div className="max-w-2xl flex-1">
          <PostHeader post={post} />

          <PostContent blocks={post.blocks} postId={post.id} />

          <CommentsSection postId={post.id} />
        </div>

        {/* TOC 사이드바 */}
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: `${post.title} - ${post.category}`,
    openGraph: {
      title: post.title,
      description: `${post.title} - ${post.category}`,
      type: 'article',
    },
  };
}
