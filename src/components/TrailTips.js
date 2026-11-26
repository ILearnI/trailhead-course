const tips = {
  Easy: "Good for families. Bring water and a hat.",
  Moderate: "Wear proper shoes, and start early.",
  Hard: "Check the weather, and bring layers and a map.",
};

export default function TrailTips({ level }) {
  return <p className="text-sm">{tips[level]}</p>;
}
