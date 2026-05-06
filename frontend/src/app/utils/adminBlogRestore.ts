export type AdminBlogRestorePayload = {
  title: string;
  description: string;
  content: string;
  tags: string[];
  date: string;
  isDraft: boolean;
};

export type AdminBlogRestoreData = {
  kind: "blog:create" | "blog:edit";
  slug?: string;
  redirectPath: string;
  savedAt: number;
  payload: AdminBlogRestorePayload;
};

const BLOG_RESTORE_KEY = "admin:blog:restore";
const BLOG_RESTORE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

function canUseSessionStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.sessionStorage !== "undefined"
  );
}

export function saveBlogRestore(data: AdminBlogRestoreData) {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.setItem(BLOG_RESTORE_KEY, JSON.stringify(data));
}

export function readBlogRestore(): AdminBlogRestoreData | null {
  if (!canUseSessionStorage()) return null;

  const raw = window.sessionStorage.getItem(BLOG_RESTORE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminBlogRestoreData;
  } catch {
    clearBlogRestore();
    return null;
  }
}

export function clearBlogRestore() {
  if (!canUseSessionStorage()) return;
  window.sessionStorage.removeItem(BLOG_RESTORE_KEY);
}

export function isFreshBlogRestore(data: AdminBlogRestoreData) {
  return Date.now() - data.savedAt <= BLOG_RESTORE_MAX_AGE_MS;
}

export function getSafeAdminRedirect(value: string | null) {
  if (!value?.startsWith("/admin")) return "/admin";
  if (value.startsWith("//")) return "/admin";
  return value;
}
