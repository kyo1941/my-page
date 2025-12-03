import { TAGS } from '@/app/data/tagData';
import { useBlogSearchContext } from './useBlogSearchContext';

export function useTagSearch() {
  const { selectedTags, toggleTag } = useBlogSearchContext();

  return {
    tags: TAGS,
    selectedTags,
    toggleTag,
  };
}
