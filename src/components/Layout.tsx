import Sidebar from "./Sidebar";
type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main className="flex">
      <Sidebar>{children}</Sidebar>
    </main>
  );
};

export default Layout;
