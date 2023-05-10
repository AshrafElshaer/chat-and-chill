import Sidebar from "./Sidebar";
type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <main>
      <Sidebar>{children}</Sidebar>
    </main>
  );
};

export default Layout;
