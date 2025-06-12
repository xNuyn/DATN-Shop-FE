import React, { useEffect, useState } from 'react';
import './CategoryModal.scss';
import { getRootCategories, Category } from '../../services/categoryService';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { parent: number | null; name: string }) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [parents, setParents] = useState<Category[]>([]);
  const [parentId, setParentId] = useState<number | null>(null);
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getRootCategories().then(setParents).catch(console.error);
      setParentId(null);
      setName('');
      setError(null);
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!name.trim()) {
      setError('Tên category không được để trống.');
      return;
    }
    onCreate({ parent: parentId, name: name.trim() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="category-modal-overlay">
      <div className="category-modal">
        <h3>Create New Category</h3>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label>Parent Category</label>
          <select
            value={parentId === null ? '' : parentId}
            onChange={e => setParentId(e.target.value === '' ? null : Number(e.target.value))}
          >
            <option value="">No parent</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter category name"
          />
        </div>
        <div className="buttons">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
