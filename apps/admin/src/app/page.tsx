import { client } from "@repo/db/client";
import { isLoggedIn } from "../utils/auth";
import { ActiveStatusButton } from "../components/ActiveStatusButton";
import { LogoutButton } from "../components/LogoutButton";
import styles from "./page.module.css";
import Image from "next/image";


type AdminSearchParams = {
  error?: string;
  q?: string;
  visibility?: string;
  sortName?: string;
  sortDate?: string;
  page?: string;
};

const POSTS_PER_PAGE = 6;

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<AdminSearchParams>;
}) {
  const params = searchParams ? await searchParams : {};
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Login Form</h2>

          {params.error ? <p className={styles.error}>{params.error}</p> : null}

          <form action="/api/auth/login" method="post" className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="uname" className={styles.label}>
                <b>Username</b>
              </label>
              <input
                id="uname"
                type="text"
                placeholder="Enter Username"
                name="uname"
                className={styles.input}
                required
              />

              <label htmlFor="psw" className={styles.label}>
                <b>Password</b>
              </label>
              <input
                id="psw"
                type="password"
                placeholder="Enter Password"
                name="psw"
                className={styles.input}
                required
              />

              <button type="submit" className={styles.loginButton}>
                Login
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  const posts = await client.db.post.findMany();

  const query = params.q?.trim().toLowerCase() ?? "";
  const visibility = params.visibility ?? "all";
  const sortName = params.sortName === "asc" || params.sortName === "desc" ? params.sortName : "";
  const sortDate = params.sortDate === "asc" || params.sortDate === "desc" ? params.sortDate : "";

  const filteredPosts = posts
    .filter((post) => {
      return (
        (!query || post.title.toLowerCase().includes(query)) &&
        (visibility === "all" || (visibility === "active" ? post.active : !post.active))
      );
    })
    .sort((firstPost, secondPost) => {
      if (sortDate) {
        const dateResult = firstPost.date.getTime() - secondPost.date.getTime();
        if (dateResult !== 0) {
          return sortDate === "desc" ? -dateResult : dateResult;
        }
      }

      if (sortName) {
        const nameResult = firstPost.title.localeCompare(secondPost.title);
        return sortName === "desc" ? -nameResult : nameResult;
      }

      return 0;
    });

  const requestedPage = Number.parseInt(params.page ?? "1", 10);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(Math.max(Number.isNaN(requestedPage) ? 1 : requestedPage, 1), totalPages);
  const pagePosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const pageUrl = (page: number) => {
    const queryParams = new URLSearchParams();
    if (query) queryParams.set("q", query);
    if (visibility !== "all") queryParams.set("visibility", visibility);
    if (sortName) queryParams.set("sortName", sortName);
    if (sortDate) queryParams.set("sortDate", sortDate);
    queryParams.set("page", String(page));
    return `/?${queryParams.toString()}`;
  };

  return (
    <main className={styles.dashboardPage}>
      <header className={styles.topBar}>
        <div className={styles.headerTitleWrap}>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
        </div>

        <div className={styles.headerActions}>
          <a href="/create" className={styles.createButton} style={{ textDecoration: "none" }}>
            + Create new post
          </a>

          <LogoutButton className={styles.logoutButton} />
        </div>
      </header>

      <div className={styles.dashboardBody}>
        <aside className={styles.filterSidebar}>
          <span className={styles.filterEyebrow}>Sort</span>
          <form className={styles.filterPanel} action="/" method="get">
            <label>
              Search Post
              <input name="q" defaultValue={params.q} placeholder="Search by title" />
            </label>
            <label>
              Status
              <select name="visibility" defaultValue={visibility}>
                <option value="all">All posts</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </label>
            <label>
              Sort by Name
              <select name="sortName" defaultValue={sortName}>
                <option value="">None</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>

            <label>
              Sort by Date
              <select name="sortDate" defaultValue={sortDate}>
                <option value="">None</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <button type="submit" className={styles.filterButton}>Apply filters</button>
          </form>
        </aside>
        <section className={styles.contentArea}>
        <div className={styles.sectionHead}>
            <div><span className={styles.sectionLabel}>Library</span><h2>Manage Posts</h2></div>
  
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statCard}><span>All Posts</span><strong>{posts.length}</strong><small>Across your Blog</small></div>
            <div className={styles.statCard}><span>Active</span><strong>{posts.filter((post) => post.active).length}</strong><small>Visible to users</small></div>
            <div className={styles.statCard}><span>Inactive</span><strong>{posts.filter((post) => !post.active).length}</strong><small>Not visible to users</small></div>
            <div className={styles.statCard}><span>Total Views</span><strong>{posts.reduce((total, post) => total + post.views, 0).toLocaleString()}</strong><small>Total views across all posts</small></div>
          </div>

          <div className={styles.cardGrid}>
            {pagePosts.map((post) => (
              <article key={post.id} className={styles.postCard}>
                <div className={styles.cardImage} aria-hidden="true">
                  <Image src={post.imageUrl} alt={post.title} width={280} height={180} />
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.cardTag}>{post.category}</span>
                    <ActiveStatusButton
                      postId={post.id}
                      active={post.active}
                      activeClassName={styles.statusButtonActive}
                      inactiveClassName={styles.statusButtonInactive}
                    />
                  </div>

                  <h3>
                    <a href={`/modify/${post.urlId}`} className={styles.postTitleLink}>
                      {post.title}
                    </a>
                  </h3>
                  <p>{post.description}</p>

                  <div className={styles.metaRow}>
                    <div className={styles.metaInfo}>
                      {post.tags.split(",").map((tag) => (
                        <span key={`${post.id}-${tag}`} className={styles.metaTag}>
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>

                    <div className={styles.metaRight}>
                      <span className={styles.metaDate}>{new Date(post.date).toLocaleDateString()}</span>
                      <span className={styles.metaViews}>{post.views} views</span>
                      <span className={styles.metaViews}> Likes: {post.likes.toLocaleString()}</span>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>

          <nav className={styles.pagination} aria-label="Admin post pages">
            {currentPage > 1 ? (
              <a href={pageUrl(currentPage - 1)} className={styles.paginationLink}>Previous</a>
            ) : <span className={`${styles.paginationLink} ${styles.paginationLinkDisabled}`}>Previous</span>}
            <span className={styles.paginationStatus}>Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages ? (
              <a href={pageUrl(currentPage + 1)} className={styles.paginationLink}>Next</a>
            ) : <span className={`${styles.paginationLink} ${styles.paginationLinkDisabled}`}>Next</span>}
          </nav>
        </section>
      </div>
    </main>
  );
}
