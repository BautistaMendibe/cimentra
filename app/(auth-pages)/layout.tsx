export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-12 items-center">
        {children}
      </div>
    </div>
  );
}
