// React
import { useMemo } from 'react';

/**
 * @description Define the props interface
 */
export interface IProps {
  prefix?: string;
  name: string;
  color?: string;
}

/**
 * @description Renders one symbol from the generated SVG sprite by its stable icon name.
 */
export const AppBaseSvg = ({ color, name, prefix = 'icon' }: IProps) => {
  // Memoize the symbolId to avoid recalculating on every render
  const symbolId = useMemo(() => `#${prefix}-${name}`, [prefix, name]);

  return (
    <svg className="svg-icon" aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
  );
};
