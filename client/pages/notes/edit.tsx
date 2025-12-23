import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { notesApi } from "@/services/notes.api";
import { useNotesStore } from "@/store/notes.store";
import { UpdateNoteSchema } from "@/schemas/note.schema";
import { ZodError } from "zod";
import { Note } from "@/types/note.types";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface FormErrors {
  title?: string;
  content?: string;
}

const EditNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { updateNote } = useNotesStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoadError("Note ID not found");
      setIsLoading(false);
      return;
    }
    loadNote();
  }, [id]);

  const loadNote = async () => {
    if (!id) return;
    setIsLoading(true);
    setLoadError("");
    try {
      const note = await notesApi.fetchNoteById(id);
      setFormData({
        title: note.title,
        content: note.content,
      });
    } catch (err) {
      setLoadError("Failed to load note. It may have been deleted.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitError("");
    setErrors({});

    // Validate form
    try {
      UpdateNoteSchema.parse(formData);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: FormErrors = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as string;
          fieldErrors[field as keyof FormErrors] = error.message;
        });
        setErrors(fieldErrors);
      }
      return;
    }

    // Submit
    setIsSubmitting(true);
    try {
      const updatedNote = await notesApi.updateNote(id, formData);
      updateNote(id, updatedNote);
      navigate(`/notes/${id}`);
    } catch (err) {
      setSubmitError("Failed to update note. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        {/* Load Error */}
        {loadError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-red-700">{loadError}</p>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Edit Note</h1>
          <p className="text-slate-600">Update your note details</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {/* Submit Error Alert */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700">{submitError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <Input
              label="Note Title"
              name="title"
              placeholder="Note title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
            />

            {/* Content Textarea */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-1.5"
            >
              <label className="text-sm font-medium text-slate-700">
                Note Content
              </label>
              <motion.textarea
                name="content"
                placeholder="Write your note here..."
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className={`
                  px-4 py-3 border-2 border-slate-200 rounded-lg
                  focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                  transition-all duration-200 bg-white text-slate-900
                  placeholder-slate-400 text-base font-sans resize-none
                  ${errors.content ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""}
                `}
                whileFocus={{ scale: 1.01 }}
              />
              {errors.content && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {errors.content}
                </motion.span>
              )}
            </motion.div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default EditNote;
