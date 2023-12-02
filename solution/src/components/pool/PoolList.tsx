import PoolCard from "./PoolCard";
import Container from "../shared/Container";
import { TFlyoutOptions, TPoolData } from "@/app/types";
import Flyout from "../shared/Flyout";

const PoolList = (props: {
  pools: TPoolData[];
  title: string;
  flyoutOptions: TFlyoutOptions;
}) => {
  const { pools, title, flyoutOptions } = props;

  const renderPools = (_pools: TPoolData[]) => {
    const cols = _pools.length === 1 ? "6" : "3";
    return (
      <div
        // role="list"
        className={`grid gap-x-6 gap-y-8 md:grid-cols-2 md:gap-x-8 w-full`}
      >
        {_pools.map((pool) => (
          <div
            key={`${pool.chainId}-${pool.poolId}`}
            className={`overflow-hidden rounded-xl border border-gray-200 col-span-${cols}`}
          >
            <PoolCard key={`${pool.chainId}-${pool.poolId}`} pool={pool} />
          </div>
        ))}
      </div>
    );
  };

  const renderTitle = () => {
    return (
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl py-4 px-2 mb-3">
        {title}
      </h2>
    );
  };

  if (!pools || pools.length === 0) return <></>;

  if (!flyoutOptions.useFlyout || pools.length <= flyoutOptions.startIndex)
    return (
      <Container>
        {renderTitle()}
        {renderPools(pools)}
      </Container>
    );

  const shownPools: TPoolData[] = pools.slice(0, flyoutOptions.startIndex);
  const hiddenPools: TPoolData[] = pools.slice(flyoutOptions.startIndex);

  return (
    <Container>
      {renderTitle()}
      {renderPools(shownPools)}
      <Flyout label={flyoutOptions.label}>{renderPools(hiddenPools)}</Flyout>
    </Container>
  );
};

export default PoolList;
