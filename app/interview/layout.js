import Script from "next/script";

export const viewport = {
  themeColor: "#302651",
  viewportFit: "cover",
};

export default function InterviewLayout({ children }) {
  return (
    <>
      <Script id="interview-bg" strategy="beforeInteractive">
        {`document.documentElement.style.backgroundColor='#4a3d78';document.body.style.backgroundColor='#4a3d78';var m=document.querySelector('meta[name="theme-color"]');if(m)m.content='#302651';`}
      </Script>
      <div className="interview-route">{children}</div>
    </>
  );
}
