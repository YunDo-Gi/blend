import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PostItem from './post-item';
import Pagination from '../../../shared/ui/pagination';

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
}

const allPosts: Post[] = [
  {
    id: 1,
    date: '2015.06.05',
    title: '글 제목이 들어가는 공간입니다. 제목을 입력해주세요.',
    category: 'frontend',
  },
  {
    id: 2,
    date: '2015.06.05',
    title: 'React Hook을 활용한 상태 관리 최적화',
    category: 'frontend',
  },
  {
    id: 3,
    date: '2015.06.05',
    title: 'Node.js와 Express로 REST API 구축하기',
    category: 'backend',
  },
  {
    id: 4,
    date: '2015.06.05',
    title: '데이터베이스 설계 패턴과 최적화',
    category: 'backend',
  },
  {
    id: 5,
    date: '2015.06.05',
    title: '블로그 개발 일지 - 첫 번째 이야기',
    category: 'blog',
  },
  {
    id: 6,
    date: '2015.06.04',
    title: 'TypeScript 제네릭 활용법',
    category: 'frontend',
  },
  {
    id: 7,
    date: '2015.06.04',
    title: 'CSS Grid와 Flexbox 비교 분석',
    category: 'frontend',
  },
  {
    id: 8,
    date: '2015.06.04',
    title: 'MongoDB 스키마 설계 가이드',
    category: 'backend',
  },
  {
    id: 9,
    date: '2015.06.04',
    title: 'Docker를 활용한 개발 환경 구축',
    category: 'backend',
  },
  {
    id: 10,
    date: '2015.06.04',
    title: '새로운 프로젝트 시작하기',
    category: 'blog',
  },
  {
    id: 11,
    date: '2015.06.03',
    title: 'Next.js 13 App Router 완벽 가이드',
    category: 'frontend',
  },
  {
    id: 12,
    date: '2015.06.03',
    title: 'JavaScript 비동기 처리 패턴',
    category: 'frontend',
  },
  {
    id: 13,
    date: '2015.06.03',
    title: 'GraphQL과 REST API 비교',
    category: 'backend',
  },
  {
    id: 14,
    date: '2015.06.03',
    title: '마이크로서비스 아키텍처 설계',
    category: 'backend',
  },
  {
    id: 15,
    date: '2015.06.03',
    title: '개발자 성장 경험담',
    category: 'blog',
  },
  {
    id: 16,
    date: '2015.06.02',
    title: 'Tailwind CSS 활용 팁',
    category: 'frontend',
  },
  {
    id: 17,
    date: '2015.06.02',
    title: 'Redux vs Zustand 상태관리 비교',
    category: 'frontend',
  },
  {
    id: 18,
    date: '2015.06.02',
    title: 'Prisma ORM 사용법',
    category: 'backend',
  },
  {
    id: 19,
    date: '2015.06.02',
    title: 'AWS Lambda 서버리스 구축',
    category: 'backend',
  },
  {
    id: 20,
    date: '2015.06.02',
    title: '코딩 테스트 준비 후기',
    category: 'blog',
  },
  {
    id: 21,
    date: '2015.06.01',
    title: 'React 18 Concurrent Features',
    category: 'frontend',
  },
  {
    id: 22,
    date: '2015.06.01',
    title: '웹 성능 최적화 기법',
    category: 'frontend',
  },
  {
    id: 23,
    date: '2015.06.01',
    title: 'Redis 캐싱 전략',
    category: 'backend',
  },
  {
    id: 24,
    date: '2015.06.01',
    title: 'CI/CD 파이프라인 구축',
    category: 'backend',
  },
  {
    id: 25,
    date: '2015.06.01',
    title: '첫 번째 오픈소스 기여 경험',
    category: 'blog',
  },
];

export default function PostList() {
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const selectedCategory = searchParams.get('category') || 'all';

  const postsPerPage = 10;

  // 카테고리 필터링된 포스트
  const filteredPosts = useMemo(() => {
    return selectedCategory === 'all' ? allPosts : allPosts.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // 현재 페이지에 해당하는 포스트들
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage]);

  return (
    <div className="bg-background">
      {currentPosts.map((post) => (
        <PostItem key={post.id} date={post.date} title={post.title} />
      ))}

      {filteredPosts.length === 0 && (
        <div className="p-8 text-center text-gray-500">해당 카테고리에 게시글이 없습니다.</div>
      )}

      {filteredPosts.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
    </div>
  );
}

export const totalPostsCount = allPosts.length;
