import { notFound } from 'next/navigation';
import { postApi } from '@/shared/api';
import { Post } from '@/shared/types/api';
import { extractTocFromBlocks } from '@/shared/lib/toc';
import PostHeader from '@/domain/post-detail/components/post-header';
import PostContent from '@/domain/post-detail/components/post-content';
import CommentsSection from '@/domain/post-detail/components/comments-section';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    return await postApi.getById(id);
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

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
  const post = await getPost(slug);

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
