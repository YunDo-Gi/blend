import { notFound } from 'next/navigation';
import { getMDXContent, PostData } from '@/shared/lib/mdx';
import PostHeader from '@/domain/post-detail/components/post-header';
import CommentsSection from '@/domain/post-detail/components/comments-section';
import TableOfContents from '@/domain/post-detail/components/table-of-contents';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostData(slug: string): Promise<PostData | null> {
  try {
    return await getMDXContent(slug);
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }

  const { mdxSource, metadata, toc } = postData;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-center gap-8">
        {/* 메인 컨텐츠 */}
        <div className="max-w-2xl flex-1">
          <PostHeader metadata={metadata} />

          <article>{mdxSource}</article>

          <CommentsSection postSlug={slug} />
        </div>

        {/* TOC 사이드바 */}
        <TableOfContents toc={toc} />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const postData = await getPostData(slug);

  if (!postData) {
    return {
      title: 'Post Not Found',
    };
  }

  const { metadata } = postData;

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
    },
  };
}
