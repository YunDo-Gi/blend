import PostItem from './post-item';

interface Post {
  id: number;
  date: string;
  title: string;
  category: string;
}

interface PostListProps {
  selectedCategory: string;
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
];

export default function PostList({ selectedCategory }: PostListProps) {
  const filteredPosts =
    selectedCategory === 'all' ? allPosts : allPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="bg-background">
      {filteredPosts.map((post) => (
        <PostItem key={post.id} date={post.date} title={post.title} />
      ))}
      {filteredPosts.length === 0 && (
        <div className="p-8 text-center text-gray-500">해당 카테고리에 게시글이 없습니다.</div>
      )}
    </div>
  );
}
