export const fmt = (n) => "UGX " + Number(n).toLocaleString();

export const conditionColor = (c) => {
  if (c === "Brand new") return { bg: "#FBF5E0", color: "#8A6010" };
  if (c === "Like new") return { bg: "#E8F4E8", color: "#1A6B1A" };
  if (c === "Used") return { bg: "#F2F2F2", color: "#555" };
  return { bg: "#F2F2F2", color: "#888" };
};

export const hashId = (id) => {
  if (typeof id === "number") return id;
  return Math.abs(String(id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0));
};

export const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const authHeaders = () => {
  const token = localStorage.getItem("alsel_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
