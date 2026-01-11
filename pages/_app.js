import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();

  useEffect(() => {
    const handleStart = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setLoading(true);
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    const handleDone = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleDone);
    router.events.on("routeChangeError", handleDone);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleDone);
      router.events.off("routeChangeError", handleDone);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [router.events]);

  return (
    <>
      {loading && (
        <div className="route-loader" role="status" aria-live="polite">
          <div className="loader-ring loader-ring-one" />
          <div className="loader-ring loader-ring-two" />
          <div className="loader-ring loader-ring-three" />
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
}
