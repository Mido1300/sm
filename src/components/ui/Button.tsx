import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-indigo-600',
  secondary: 'bg-secondary text-white hover:bg-pink-500',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', loading, className, children, ...props }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'px-4 py-2 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50',
        variants[variant],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2 inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : null}
      {children}
    </motion.button>
  ),
);
Button.displayName = 'Button';
