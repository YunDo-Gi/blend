import { useState, useCallback } from 'react';
import { commentApi } from '@/shared/api';
import { Comment } from '@/shared/types/api';

interface UseCommentsOptions {
  postId: string;
}

interface AddCommentParams {
  content: string;
  blockId?: string | null;
  guestNickname: string;
  guestPassword?: string;
}

export function useComments({ postId }: UseCommentsOptions) {
  const [commentsByBlock, setCommentsByBlock] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const comments = await commentApi.getAll({ post_id: postId });
      const grouped = comments.reduce<Record<string, Comment[]>>((acc, comment) => {
        const blockId = comment.block_id || 'general';
        if (!acc[blockId]) acc[blockId] = [];
        acc[blockId].push(comment);
        return acc;
      }, {});
      setCommentsByBlock(grouped);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  }, [postId]);

  const addComment = useCallback(
    async ({ content, blockId, guestNickname, guestPassword }: AddCommentParams) => {
      if (!content.trim() || !guestNickname.trim()) return false;

      setLoading(true);
      try {
        await commentApi.create({
          content: content.trim(),
          post_id: postId,
          block_id: blockId || undefined,
          guest_nickname: guestNickname.trim(),
          guest_password: guestPassword || undefined,
        });

        await fetchComments();
        return true;
      } catch (error) {
        console.error('Failed to create comment:', error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [postId, fetchComments]
  );

  const deleteComment = useCallback(
    async (commentId: string, password: string) => {
      try {
        await commentApi.delete(commentId, { guest_password: password });
        await fetchComments();
        return true;
      } catch (error) {
        console.error('Failed to delete comment:', error);
        return false;
      }
    },
    [fetchComments]
  );

  const getTotalCount = useCallback(() => {
    return Object.values(commentsByBlock).reduce((total, comments) => total + comments.length, 0);
  }, [commentsByBlock]);

  return {
    commentsByBlock,
    loading,
    fetchComments,
    addComment,
    deleteComment,
    getTotalCount,
  };
}
