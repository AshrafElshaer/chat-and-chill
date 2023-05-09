import Sidebar from "./Sidebar";
type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main className="flex">
      <Sidebar />
      {children}
    </main>
  );
};

export default Layout;
