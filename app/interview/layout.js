import Script from "next/script";

export const viewport = {
  themeColor: "#4a3d78",
  viewportFit: "cover",
};

export default function InterviewLayout({ children }) {
  return (
    <>
      <Script id="interview-bg" strategy="beforeInteractive">
        {`document.documentElement.style.backgroundColor='#4a3d78';document.body.style.backgroundColor='#4a3d78';`}
      </Script>
      <div className="interview-route">{children}</div>
    </>
  );
}
