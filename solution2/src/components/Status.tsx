const Status = ({ status }: { status: boolean }) => {
  return (
    <div
      id="status-dot"
      className={`${
        status
          ? "text-green-400 bg-green-400/10"
          : "text-rose-400 bg-rose-400/10"
      } flex-none rounded-full p-1 h-3.5 w-3.5`}
    >
      <div className="h-1.5 w-1.5 rounded-full bg-current" />
    </div>
  );
};

export default Status;
