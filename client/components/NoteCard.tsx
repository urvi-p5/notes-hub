import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Eye } from 'lucide-react';
import { Note } from '@/types/note.types';
import { Link } from 'react-router-dom';

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  isLoading?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onDelete,
  onEdit,
  isLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl border-2 border-slate-200 hover:border-blue-300 overflow-hidden transition-all duration-300"
    >
      {/* Card Content */}
      <div className="p-5 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
          {note.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">
          {truncateContent(note.content)}
        </p>

        {/* Date */}
        <p className="text-xs text-slate-400 mb-4">
          {formatDate(note.updatedAt)}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-slate-100">
          <Link
            to={`/notes/${note.id}`}
            className="flex-1"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              className="w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-60"
            >
              <Eye size={16} />
              View
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit?.(note.id)}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-60"
          >
            <Edit2 size={16} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete?.(note.id)}
            disabled={isLoading}
            className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-60"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
