import React, { useRef, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathFormulaProps {
  /** LaTeX string to render */
  tex: string;
  /** Display mode (block) vs inline */
  display?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Renders a LaTeX math formula using KaTeX.
 * - `display` mode centers the formula in a block element
 * - inline mode flows within text
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  tex,
  display = false,
  className,
  style,
}) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(tex, ref.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
        });
      } catch {
        // Fallback: show raw TeX string
        ref.current.textContent = tex;
      }
    }
  }, [tex, display]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: display ? 'block' : 'inline',
        textAlign: display ? 'center' : undefined,
        ...style,
      }}
    />
  );
};
