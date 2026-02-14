'use client';

import { useState, useEffect } from 'react';
import { categoryApi } from '@/shared/api';
import { Category } from '@/shared/types/api';

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (err) {
      setError('카테고리를 불러오는데 실패했습니다.');
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsCreating(true);
      setError(null);
      const newCategory = await categoryApi.create({ name: newCategoryName.trim() });
      setCategories((prev) => [...prev, newCategory]);
      setNewCategoryName('');
    } catch (err) {
      setError('카테고리 생성에 실패했습니다.');
      console.error('Failed to create category:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      setIsUpdating(true);
      setError(null);
      const updatedCategory = await categoryApi.update(id, { name: editingName.trim() });
      setCategories((prev) => prev.map((cat) => (cat.id === id ? updatedCategory : cat)));
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      setError('카테고리 수정에 실패했습니다.');
      console.error('Failed to update category:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      setError(null);
      await categoryApi.delete(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      setError('카테고리 삭제에 실패했습니다.');
      console.error('Failed to delete category:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="border-line border p-6">
        <p className="text-gray font-mono text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="border-line border">
      {error && (
        <div className="border-line border-b bg-red-50 p-4 dark:bg-red-900/20">
          <p className="font-mono text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 카테고리 추가 폼 */}
      <form onSubmit={handleCreate} className="border-line flex border-b">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="새 카테고리 이름"
          className="bg-background text-foreground placeholder:text-gray flex-1 px-4 py-3 text-sm outline-none"
          disabled={isCreating}
        />
        <button
          type="submit"
          disabled={isCreating || !newCategoryName.trim()}
          className="text-foreground hover:bg-gray-2 border-line border-l px-6 py-3 font-mono text-sm transition-colors disabled:opacity-40"
        >
          {isCreating ? 'ADDING...' : 'ADD'}
        </button>
      </form>

      {/* 카테고리 목록 */}
      {categories.length === 0 ? (
        <div className="p-6">
          <p className="text-gray font-mono text-sm">카테고리가 없습니다.</p>
        </div>
      ) : (
        <ul>
          {categories.map((category, index) => (
            <li
              key={category.id}
              className={`border-line flex items-center justify-between px-4 py-3 ${
                index !== categories.length - 1 ? 'border-b' : ''
              }`}
            >
              {editingId === category.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="bg-background text-foreground border-line flex-1 border px-3 py-1 font-mono text-sm outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(category.id)}
                    disabled={isUpdating || !editingName.trim()}
                    className="text-primary font-mono text-sm transition-colors hover:opacity-80 disabled:opacity-40"
                  >
                    {isUpdating ? 'SAVING...' : 'SAVE'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="text-gray font-mono text-sm transition-colors hover:opacity-80 disabled:opacity-40"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-foreground font-mono text-sm">{category.name}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="text-gray hover:text-foreground font-mono text-sm transition-colors"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deletingId === category.id}
                      className="font-mono text-sm text-red-500 transition-colors hover:text-red-600 disabled:opacity-40"
                    >
                      {deletingId === category.id ? 'DELETING...' : 'DELETE'}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
