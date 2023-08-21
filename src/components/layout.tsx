import { TopPanel } from "./layout/top-panel";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" min-h-screen pb-10">
      <TopPanel />
      {children}
    </div>
  );
}
