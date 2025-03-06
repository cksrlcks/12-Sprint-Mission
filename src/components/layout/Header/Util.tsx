"use client";

import { Button } from "@components/ui";
import { Profile } from "@/components/layout/Header";
import styles from "./Util.module.scss";
import { useQuery } from "@tanstack/react-query";
import { getUserOptions } from "@/service/user.queries";
import { useAuth } from "@/context/SessionProvider";

export function Util() {
  const { session } = useAuth();
  const { data } = useQuery({
    ...getUserOptions,
    enabled: !!session,
  });

  if (!session) {
    return (
      <div className={styles.util}>
        <Button href="/login" size="sm-48" className={styles["login-btn"]}>
          로그인
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.util}>
      {data && <Profile nickname={data.nickname} image={data.image || ""} />}
    </div>
  );
}
