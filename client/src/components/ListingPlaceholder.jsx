import { G, CATEGORIES } from '../constants';
import { hashId } from '../utils';

export default function ListingPlaceholder({ id, category }) {
  const palettes = {
    electronics: ["#1A1A2E", "#16213E", "#0F3460"],
    fashion: ["#2D1B2E", "#3D1A3D", "#4A235A"],
    cars: ["#1A2E1A", "#163016", "#0F3D0F"],
    property: ["#2E2A1A", "#302816", "#3D3010"],
    home: ["#2E1A1A", "#301616", "#3D1010"],
    hobbies: ["#1A2A2E", "#162830", "#0F303D"],
    sports: ["#1A1E2E", "#161C30", "#0F1C3D"],
    books: ["#2A1A2E", "#281630", "#301040"],
  };
  const colors = palettes[category] || palettes.electronics;
  const idx = hashId(id);
  const shapes = [
    <rect key="r" x="30%" y="25%" width="40%" height="50%" rx="8" fill={G.gold} opacity="0.15" />,
    <circle key="c" cx="50%" cy="50%" r="22%" fill={G.gold} opacity="0.12" />,
    <polygon key="p" points="50,20 80,70 20,70" fill={G.gold} opacity="0.12" transform="translate(25,15) scale(1.8)" />,
  ];
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 160" style={{ background: colors[idx % colors.length] }}>
      {shapes[idx % shapes.length]}
      <text x="50%" y="85%" textAnchor="middle" fill={G.gold} opacity="0.4" fontSize="11" fontFamily="DM Sans,sans-serif">
        {CATEGORIES.find((c) => c.id === category)?.label || "Item"}
      </text>
    </svg>
  );
}
