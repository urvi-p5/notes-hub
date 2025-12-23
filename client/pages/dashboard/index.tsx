import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useNotesStore } from '@/store/notes.store';
import { notesApi } from '@/services/notes.api';
import NoteCard from '@/components/NoteCard';
import Button from '@/components/Button';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notes, loading, error, setNotes, setLoading, setError, deleteNote } =
    useNotesStore();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notesApi.fetchNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await notesApi.deleteNote(id);
      deleteNote(id);
    } catch (err) {
      setError('Failed to delete note.');
      console.error(err);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/notes/edit/${id}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Notes
            </h1>
            <p className="text-slate-600">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} in your collection
            </p>
          </div>

          <Link to="/notes/create">
            <Button size="lg" className="gap-2">
              <Plus size={20} />
              New Note
            </Button>
          </Link>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadNotes}
              className="ml-auto text-red-600 hover:text-red-700 font-medium underline"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
            <p className="mt-4 text-slate-600">Loading your notes...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && notes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Plus size={40} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              No notes yet
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first note to get started organizing your thoughts and ideas.
            </p>
            <Link to="/notes/create">
              <Button size="lg">Create Your First Note</Button>
            </Link>
          </motion.div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isLoading={loading}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
