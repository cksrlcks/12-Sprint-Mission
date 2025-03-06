"use client";

import { notFound, useRouter } from "next/navigation";
import { More } from "@/components/Button";
import { Author, Fullscreen, LikeButton, Thumbnail } from "@/components/ui";
import styles from "./BoardDetail.module.scss";
import {
  useArticleDelete,
  useArticleToggleLike,
  useGetArticle,
} from "@/service/article.queries";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/context/SessionProvider";
import { BaseDetailPage } from "@/types/common";

export default function BoardDetail({ id: articleId }: BaseDetailPage) {
  const router = useRouter();
  const { session } = useAuth();
  const { data: detail, isPending } = useGetArticle(articleId);
  const { mutate: toggleLike } = useArticleToggleLike(articleId);
  const { mutate: deleteArticle } = useArticleDelete(articleId, {
    onSuccess: () => {
      alert("게시글을 삭제했습니다.");
      router.replace("/boards");
    },
    onError: (error) => {
      console.error(error);
      alert("게시글을 삭제를 실패했어요");
    },
  });

  async function handleToggleLike() {
    if (!session?.user) {
      return alert("로그인이 필요합니다.");
    }
    toggleLike(!isLiked);
  }

  function handleModify() {
    if (!isOwner) {
      return alert("작성자만 수정이 가능합니다.");
    }

    router.push(`/modifyBoard/${articleId}`);
  }

  async function handleDelete() {
    if (!isOwner) {
      return alert("작성자만 삭제가 가능합니다.");
    }

    if (confirm("정말 삭제할까요?")) {
      deleteArticle();
    }
  }

  if (isPending) {
    return <Loading>loading...</Loading>;
  }

  if (!detail) {
    notFound();
  }

  const {
    image,
    title,
    content,
    writer: { nickname, id: ownerId },
    updatedAt,
    likeCount,
    isLiked,
  } = detail;
  const isOwner = ownerId === Number(session?.user?.id);

  return (
    <div className={styles.detail}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <More
            options={[
              { label: "수정하기", action: handleModify },
              { label: "삭제하기", action: handleDelete },
            ]}
          />
        </div>
      </header>
      <div className={styles.meta}>
        <Author nickname={nickname} updatedAt={updatedAt} />
        <div className={styles.controls}>
          <LikeButton
            count={likeCount}
            isLiked={isLiked}
            onClick={handleToggleLike}
          />
        </div>
      </div>
      <div>
        {image && (
          <div className={styles.image}>
            <Fullscreen>
              <Thumbnail src={image} alt={title} />
            </Fullscreen>
          </div>
        )}
        <div className={styles.content}>{content}</div>
      </div>
    </div>
  );
}
