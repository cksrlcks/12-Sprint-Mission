import { PageWrapper } from "@/components/Page";
import { CommentAdd, CommentList } from "@/components/Comment";
import BoardDetail from "@/components/board/BoardDetail";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageWrapper>
      <BoardDetail id={Number(id)} />
      <CommentAdd name="articles" />
      <CommentList name="articles" id={Number(id)} />
    </PageWrapper>
  );
}
