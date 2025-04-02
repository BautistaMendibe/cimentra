export default function Dashboard() {
  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col gap-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          This is your dashboard. You can manage your application settings here.
        </p>
      </div>
      <div className="flex flex-col gap-10">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your application settings here.
        </p>
      </div>
    </div>
  );
}