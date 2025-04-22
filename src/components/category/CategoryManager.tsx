import React, { useState } from 'react';

export default function CategoryManager() {
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('categories') || '[]');
    }
    return [];
  });
  const [newCategory, setNewCategory] = useState('');

  function saveCategories(cats: string[]) {
    setCategories(cats);
    localStorage.setItem('categories', JSON.stringify(cats));
  }

  function handleAdd() {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      saveCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  }
  function handleDelete(cat: string) {
    saveCategories(categories.filter(c => c !== cat));
  }
  function handleEdit(idx: number, value: string) {
    const updated = [...categories];
    updated[idx] = value;
    saveCategories(updated);
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="input input-bordered flex-1"
          placeholder="Add category"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
        />
        <button className="btn btn-primary" onClick={handleAdd}>Add</button>
      </div>
      <ul className="space-y-2">
        {categories.map((cat, idx) => (
          <li key={cat} className="flex gap-2 items-center">
            <input
              className="input input-bordered flex-1"
              value={cat}
              onChange={e => handleEdit(idx, e.target.value)}
            />
            <button className="btn btn-danger" onClick={() => handleDelete(cat)} aria-label="Delete">🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
