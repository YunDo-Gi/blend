// API Response Types (from Swagger definitions)
import type { JSONContent } from '@tiptap/react';

export interface UserResponse {
  id: string;
  email: string;
  nickname: string;
  is_admin: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

/** 블록 응답 타입 (서버에서 반환) */
export interface PostBlock {
  id: string;
  content: JSONContent;
  rank_order: string;
}

/** 블록 요청 타입 (클라이언트에서 전송) */
export interface PostBlockRequest {
  id?: string; // 기존 블록은 ID 있음, 새 블록은 생략
  content: JSONContent;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED';

export interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  thumbnail: string;
  status: PostStatus;
  created_at: string;
  blocks: PostBlock[];
}

export interface Comment {
  id: string;
  content: string;
  block_id: string;
  parent_id: string;
  author_id: string;
  guest_nickname: string;
  created_at: string;
}

export interface Pagination {
  total: number;
  count: number;
  limit: number;
  next_cursor: string;
}

export interface PostListResponse {
  data: Post[];
  pagination: Pagination;
}

// Request Types

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface CreatePostRequest {
  title: string;
  content: JSONContent;
  category_id?: string;
  thumbnail?: string;
  status?: PostStatus;
}

/** 내 포스트 조회 파라미터 */
export interface MyPostsParams {
  status?: PostStatus;
  category_id?: string;
  cursor?: string;
  limit?: number;
}

/** 포스트 메타데이터 수정 요청 (PATCH /post/{id}) */
export interface UpdatePostRequest {
  title?: string;
  category_id?: string;
  thumbnail?: string;
  status?: PostStatus;
}

/** 포스트 본문 수정 요청 (PUT /post/{id}/content) */
export interface UpdatePostContentRequest {
  blocks: PostBlockRequest[];
}

export interface CreateCommentRequest {
  content: string;
  post_id?: string;
  block_id?: string;
  parent_id?: string;
  guest_nickname?: string;
  guest_password?: string;
}

export interface UpdateCommentRequest {
  content: string;
  guest_password?: string;
}

export interface DeleteCommentRequest {
  guest_password?: string;
}

export interface FileUploadResponse {
  url: string;
}

// Error Types

export type ErrorCode =
  | 100 // PasswordMismatch
  | 101 // UserNotFound
  | 1001 // PostNotFound
  | 1002 // PostAlreadyExists
  | 1501 // PostBlockNotFound
  | 1502 // PostBlockAlreadyExists
  | 2001 // CategoryNotFound
  | 2002 // CategoryAlreadyExists
  | 3001 // CommentNotFound
  | 3002 // CommentAlreadyExists
  | 4001 // InvalidStatus
  | 5000 // InternalServerError
  | 5001 // ShouldBindJsonError
  | 5002 // WrongUUIDFormat
  | 5003 // UnAuthorized
  | 9999; // DBError

export interface ApiError {
  code: ErrorCode;
  message: string;
}
