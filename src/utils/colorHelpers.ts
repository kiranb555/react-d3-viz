// Helper for calculating luminance and determining readable text color

export const getLuminance = (hex: string): number => {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb) return 0.5;
  const [r, g, b] = [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

export const getContrastingTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.6 ? '#000000' : '#ffffff';
};
