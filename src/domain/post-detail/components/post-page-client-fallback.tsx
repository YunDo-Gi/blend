'use client';

import { usePost } from '@/shared/hooks/use-posts';
import { extractTocFromBlocks } from '@/shared/lib/toc';
import PostHeader from '@/domain/post-detail/components/post-header';
import PostContent from '@/domain/post-detail/components/post-content';
import CommentsSection from '@/domain/post-detail/components/comments-section';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';

interface PostPageClientFallbackProps {
  slug: string;
}

export default function PostPageClientFallback({ slug }: PostPageClientFallbackProps) {
  const { data: post, isLoading, isError, refetch } = usePost(slug, { enabled: Boolean(slug) });

  if (isLoading) {
    return <div className="text-gray py-20 text-center font-mono">Loading...</div>;
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-foreground mb-4 font-mono text-sm">Failed to load post detail.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="border-line text-foreground hover:bg-gray-2 border px-4 py-2 font-mono text-sm transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  const toc = extractTocFromBlocks(post.blocks);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center gap-8">
        <div className="max-w-2xl flex-1">
          <PostHeader post={post} />
          <PostContent
            blocks={post.blocks}
            postId={post.id}
            postTitle={post.title}
            postAuthor={post.author}
            postThumbnail={post.thumbnail}
            postCategory={post.category}
          />
          <CommentsSection postId={post.id} />
        </div>
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}
