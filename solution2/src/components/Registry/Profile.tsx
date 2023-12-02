"use client";

import Link from "next/link";
import { Address, truncatedString } from "../Address";
import Table from "../Table";
import { TTableData } from "@/types/types";
import { convertChainIdToNetworkName } from "@/utils/utils";
import { TProfileDetail } from "./types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Profile = ({ data }: { data: TProfileDetail[] }) => {
  const tableData: TTableData = {
    headers: ["ID", "Anchor", "Name", "Updated At", "Sender", "Network"],
    rows: Object.values(data).map((profile: TProfileDetail) => {
      return [
        // eslint-disable-next-line react/jsx-key
        <Link href={`/profile/${profile.chainId}/${profile.profileId}`}>
          <span className="text-green-800">
            {truncatedString(profile.profileId)}
          </span>
        </Link>,
        // eslint-disable-next-line react/jsx-key
        <Address address={profile.anchor} chainId={profile.chainId} />,
        profile.name,
        (new Date(profile.updatedAt)).toLocaleString(),
        // eslint-disable-next-line react/jsx-key
        <Address address={profile.creator} chainId={profile.chainId} />,
        convertChainIdToNetworkName(profile.chainId),
      ];
    }),
  };

  const isMobile = useMediaQuery(768);

  return (
    <Table
      data={tableData}
      header={"Profiles"}
      description={
        "A list of all the profiles in the registry on all supported networks"
      }
      showPagination={true}
      rowsPerPage={isMobile ? 5 : 10}
    />
  );
};

export default Profile;
