export const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
export const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || "https://alsell-dash.vercel.app";

export const G = {
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldDark: "#A07830",
  goldBg: "#F7F3E3",
  goldBgDark: "rgba(201,168,76,0.10)",
  black: "#0D0D0D",
  surface: "#1A1A1A",
  surface2: "#242424",
  cream: "#F7F5EE",
  ink: "#111111",
  ink2: "#555555",
  ink3: "#999999",
  border: "#EDEDED",
  borderDark: "rgba(255,255,255,0.07)",
  green: "#1A6B1A",
  greenBg: "#E8F4E8",
  red: "#B03030",
  redBg: "#FFF0F0",
};

export const CATEGORIES = [
  { id: "all", label: "All", icon: "◈" },
  { id: "electronics", label: "Electronics", icon: "⌁" },
  { id: "fashion", label: "Fashion", icon: "◎" },
  { id: "cars", label: "Cars", icon: "◉" },
  { id: "property", label: "Property", icon: "⬡" },
  { id: "home", label: "Home & Furniture", icon: "⬢" },
  { id: "hobbies", label: "Hobbies", icon: "◆" },
  { id: "books", label: "Books", icon: "▣" },
  { id: "sports", label: "Sports & Outdoors", icon: "◐" },
  { id: "other", label: "Other", icon: "▪" },
];

export const TRENDING = [
  "iPhone 14",
  "Toyota Vitz",
  "PS5",
  "MacBook",
  "Sofa Set",
  "Nike Shoes",
];
