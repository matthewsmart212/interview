export const viewport = {
  themeColor: "#302651",
  viewportFit: "cover",
};

export default function MockLayout({ children }) {
  return <div className="mock-route">{children}</div>;
}
