// API Response Types (from Swagger definitions)

export interface Category {
  id: string;
  name: string;
}

export interface PostBlock {
  id: string;
  content: string;
  rank_order: string;
}

export interface Post {
  id: string;
  title: string;
  author: string;
  category: string;
  thumbnail: string;
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

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  category_id?: string;
  thumbnail?: string;
  status?: string;
}

export interface UpdateBlockRequest {
  id?: string;
  content?: string;
  rank_order?: string;
  type?: string;
}

export interface UpdatePostRequest {
  title: string;
  blocks: UpdateBlockRequest[];
  category_id?: string;
  thumbnail?: string;
  status?: string;
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

// Error Types

export type ErrorCode =
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
