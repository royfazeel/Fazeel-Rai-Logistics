'use client';

import { forwardRef, Ref } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'call' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-primary-600 text-white
    hover:bg-primary-700 active:bg-primary-800
    shadow-soft
    focus:ring-primary-500
  `,
  secondary: `
    bg-white text-navy-900 border border-surface-300
    hover:border-navy-400 hover:bg-surface-50
    focus:ring-navy-500
  `,
  call: `
    bg-primary-600 text-white font-bold
    hover:bg-primary-700 active:bg-primary-800
    shadow-medium
    focus:ring-primary-500
  `,
  ghost: `
    bg-transparent text-navy-700
    hover:bg-surface-100
    focus:ring-surface-400
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-md gap-1.5',
  md: 'px-6 py-3 text-base rounded-md gap-2',
  lg: 'px-8 py-4 text-lg rounded-md gap-2',
  xl: 'px-10 py-5 text-xl rounded-md gap-3',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-semibold
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-60 disabled:cursor-not-allowed
    `;

    const combinedStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : leftIcon ? (
          <span className="flex-shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
      </>
    );

    if (href) {
      const isDisabled = disabled || isLoading;
      return (
        <motion.a
          {...(props as unknown as HTMLMotionProps<'a'>)}
          ref={ref as unknown as Ref<HTMLAnchorElement>}
          href={href}
          aria-disabled={isDisabled || undefined}
          className={`${combinedStyles} ${
            isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedStyles}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
