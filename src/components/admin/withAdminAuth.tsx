import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const withAdminAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      if (!auth) {
        router.replace("/admin/login");
        setChecking(false);
        return () => {};
      }

      const unsub = onAuthStateChanged(auth, (user) => {
        if (!user) {
          router.replace("/admin/login");
        }
        setChecking(false);
      });

      return () => unsub();
    }, [router]);

    if (checking) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
          <div className="animate-pulse text-lg font-semibold">Checking credentials...</div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return ComponentWithAuth;
};

export default withAdminAuth;
