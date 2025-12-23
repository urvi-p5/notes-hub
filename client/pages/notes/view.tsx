import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { notesApi } from "@/services/notes.api";
import { useNotesStore } from "@/store/notes.store";
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, Edit2, Trash2, AlertCircle } from "lucide-react";
import { Note } from "@/types/note.types";

const ViewNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { deleteNote } = useNotesStore();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Note ID not found");
      setLoading(false);
      return;
    }
    loadNote();
  }, [id]);

  const loadNote = async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const data = await notesApi.fetchNoteById(id);
      setNote(data);
    } catch (err) {
      setError("Failed to load note. It may have been deleted.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Are you sure you want to delete this note?"))
      return;

    try {
      await notesApi.deleteNote(id);
      deleteNote(id);
      navigate("/");
    } catch (err) {
      setError("Failed to delete note.");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.button>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
            <p className="mt-4 text-slate-600">Loading note...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Note Content */}
        {!loading && note && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
              <h1 className="text-4xl font-bold text-white mb-2">
                {note.title}
              </h1>
              <p className="text-blue-100">
                Created on {formatDate(note.createdAt)}
              </p>
              {note.updatedAt !== note.createdAt && (
                <p className="text-blue-100 text-sm">
                  Last updated {formatDate(note.updatedAt)}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="px-8 py-8">
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-normal text-base">
                  {note.content}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-4 justify-end">
              <Button
                variant="outline"
                onClick={() => navigate(`/notes/edit/${note.id}`)}
                className="gap-2"
              >
                <Edit2 size={18} />
                Edit Note
              </Button>
              <Button variant="danger" onClick={handleDelete} className="gap-2">
                <Trash2 size={18} />
                Delete Note
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ViewNote;
