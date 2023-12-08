import PoolAllocatorForm from "./PoolAllocatorForm";

const PoolManagement = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-10">
      <div className="lg:col-span-2 lg:pr-8">
        <PoolAllocatorForm />
      </div>
    </div>
  );
};

export default PoolManagement;
