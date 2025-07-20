import SectionHeader from '../../../shared/ui/section-header';

interface RecentPost {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  image?: string;
}

const recentPosts: RecentPost[] = [
  {
    id: 1,
    title: '글 제목이 들어가는 공간입니다. 제목을 입력해주세요.',
    content:
      '그러나, 겨울이 지나고 나의 별에도 봄이 오면, 무덤 위에 파란 잔디가 피어나듯이 내 이름자 묻힌 언덕 위에도 자랑처럼 풀이 무성할 거다다. 계절이 지나가는 하늘에는...',
    date: '2025.06.05',
    author: 'MINSEOK KIM',
  },
];

export default function RecentSection() {
  const currentPost = recentPosts[0];

  return (
    <>
      <SectionHeader title="/ RECENT" />

      <div className="group flex cursor-pointer gap-8 pb-(--layout-grid-padding)">
        <div className="border-foreground aspect-image group-hover:border-primary w-72 border"></div>

        <div className="flex flex-1 flex-col content-between justify-between">
          <h3 className="text-lg leading-relaxed font-medium">{currentPost.title}</h3>

          <p className="text-gray-foreground text-xs leading-relaxed">{currentPost.content}</p>

          <div className="text-gray-foreground flex items-center gap-2 font-mono text-xs">
            <span>{currentPost.date}</span>
            <span>•</span>
            <span>{currentPost.author}</span>
          </div>
        </div>
      </div>
    </>
  );
}
