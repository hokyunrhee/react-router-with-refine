import { lazy, Suspense } from "react";

import type { InferencerComponentProps } from "@refinedev/inferencer/antd";
import { ClientOnly } from "remix-utils/client-only";

const AntdInferencer = lazy(() => {
  return import("@refinedev/inferencer/antd").then((module) => ({
    default: module.AntdInferencer,
  }));
});

export const Inferencer = (props: InferencerComponentProps) => {
  return (
    <ClientOnly fallback={null}>
      {() => (
        <Suspense fallback={null}>
          <AntdInferencer {...props} />
        </Suspense>
      )}
    </ClientOnly>
  );
};
