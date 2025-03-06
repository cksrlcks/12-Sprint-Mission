import { PageWrapper } from "@/components/Page";
import { CommentAdd, CommentList } from "@/components/Comment";
import ProductDetail from "@/components/market/ProductDetail";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageWrapper>
      <ProductDetail id={Number(id)} />
      <CommentAdd name="products" />
      <CommentList name="products" id={Number(id)} />
    </PageWrapper>
  );
}
