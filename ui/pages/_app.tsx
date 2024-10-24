// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from "react";
import { isArweave } from "@/arnext";
import { Providers } from "@/lib/providers";
import "../styles/globals.css";
export default function App({
  Component,
  pageProps,
}: {
  Component: React.ComponentType<any>;
  pageProps: any;
}) {
  const [RouterComponent, setRouterComponent] = useState(null);
  const [ArweaveRoutes, setArweaveRoutes] = useState(null);
  useEffect(() => {
    if (isArweave) {
      import("react-router-dom").then((module) => {
        setRouterComponent(() => module.BrowserRouter);
      });
      import("../components-1/ArweaveRoutes").then((module) => {
        setArweaveRoutes(() => module.default);
      });
    }
  }, [isArweave]);

  if (RouterComponent && ArweaveRoutes) {
    const getBasename = () => {
      const { pathname } = window.location;
      const pathSegments = pathname
        .split("/")
        .filter((segment) => segment !== "");
      return pathSegments.length > 0 ? `/${pathSegments[0]}` : "/";
    };

    let basename = getBasename();
    if (!/^\/[A-Za-z0-9_-]{43}$/.test(basename)) basename = "/";
    return (
      <Providers>
        <RouterComponent basename={basename}>
          <ArweaveRoutes />
        </RouterComponent>
      </Providers>
    );
  }
  return isArweave ? null : (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}
