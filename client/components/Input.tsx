import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, className = '', ...props },
    ref
  ) => {
    return (
      <motion.div
        className="w-full flex flex-col gap-1.5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <label className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <motion.input
          ref={ref}
          className={`
            px-4 py-2.5 border-2 border-slate-200 rounded-lg
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition-all duration-200 bg-white text-slate-900
            placeholder-slate-400 text-base
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />

        {error && (
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.span>
        )}

        {helperText && !error && (
          <span className="text-sm text-slate-500">
            {helperText}
          </span>
        )}
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
