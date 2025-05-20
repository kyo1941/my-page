import Link from 'next/link'
import styles from "../page.module.css";

export default function ProfileSection() {
  return (
    <section className={`${styles["top-section"]} ${styles["profile-section"]}`}> 
      <h3 className={styles["profile-title"]}>自己紹介</h3>
      <div className={styles["profile-flex"]}>
        <img className={styles["profile-img"]} src="/profile.jpg"/>
        <div className={styles["profile-content"]}>
          <p className={styles["profile-desc"]}>
            こんにちは、kyo1941です。<br />
            音楽を聴いたり、競技プログラミングをやったりしています。<br />
          </p>
          <div>
            <Link href="#" className={styles["profile-to-detail"]}>詳しくはこちら</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
