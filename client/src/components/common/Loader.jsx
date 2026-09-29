import HireHubLogo from "./HireHubLogo";

const Loader = ({ inline = false }) => {
  const content = (
    <div className="w-full max-w-6xl space-y-5">
      {!inline && (
        <div className="flex items-center justify-between gap-4">
          <HireHubLogo compact />
          <span className="shimmer-block h-10 w-32 rounded-xl" />
        </div>
      )}
      <div className="space-y-3">
        <span className="shimmer-block block h-4 w-1/3 rounded-md" />
        <span className="shimmer-block block h-9 w-3/4 rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="space-y-4 rounded-2xl border border-[#e2e7e1] bg-white p-5">
            <span className="shimmer-block block h-32 w-full rounded-xl" />
            <span className="shimmer-block block h-5 w-3/4 rounded-md" />
            <span className="shimmer-block block h-4 w-full rounded-md" />
            <span className="shimmer-block block h-4 w-1/2 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="w-full px-5 py-5" role="status" aria-live="polite" aria-label="Loading">
        {content}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f1f5ed] px-5 py-10" role="status" aria-live="polite" aria-label="Loading HireHub">
      {content}
    </main>
  );
};

export default Loader;
