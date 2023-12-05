"use client";

import {
  TApplicationData,
  TApplicationMetadata,
  TNewApplication,
  TPoolData,
  TProfilesByOwnerResponse,
} from "@/app/types";
import Error from "@/components/shared/Error";
import { ApplicationContext } from "@/context/ApplicationContext";
import { humanReadableAmount } from "@/utils/common";
import getProfilesByOwner, { getApplicationData } from "@/utils/request";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formatUnits, parseUnits } from "viem";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import * as yup from "yup";
import ImageUpload from "../shared/ImageUpload";
import { MarkdownEditor } from "../shared/Markdown";
import Modal from "../shared/Modal";
import ApplicationDetail from "./ApplicationDetail";

type ApplicationFormData = {
  name: string;
  website: string;
  description: string;
  email: string;
  requestedAmount: string;
  recipientAddress: string;
  profileId: string;
};

export default function ApplicationForm(props: { microGrant: TPoolData }) {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const maxRequestedAmount = Number(
    humanReadableAmount(
      props.microGrant.maxRequestedAmount,
      props.microGrant.pool.tokenMetadata.decimals || 18,
    ),
  );

  const schema = yup.object({
    name: yup.string().required().min(6, "Must be at least 6 characters"),
    website: yup.string().required().url("Must be a valid website address"),
    description: yup.string().required().min(10, "Must be at least 150 words"),
    email: yup
      .string()
      .required()
      .min(3)
      .email("Must be a valid email address"),
    requestedAmount: yup
      .string()
      .test(
        "is-number",
        "Requested amount is required",
        (value) => !isNaN(Number(value)),
      )
      .test(
        "max-amount",
        `Amount must be less than ${maxRequestedAmount}`,
        (value) => Number(value) <= maxRequestedAmount,
      ),
    recipientAddress: yup
      .string()
      .required("Recipient address is required")
      .test("address-check", "Must start with 0x", (value) =>
        value?.toLowerCase()?.startsWith("0x"),
      ),
    profilename: yup.string().when("profileId", {
      is: (profileId: string) => profileId.trim() === "0x0",
      then: () => yup.string().required("Profile name is required"),
      otherwise: () => yup.string().notRequired(),
    }),
    profileId: yup.string().notRequired(),
  });

  const { steps, createApplication } = useContext(ApplicationContext);
  const [base64Image, setBase64Image] = useState<string>("");
  const [profiles, setProfiles] = useState<TProfilesByOwnerResponse[]>([]);
  const [createNewProfile, setCreateNewProfile] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [newApplicationData, setNewApplicationData] = useState<
    TNewApplication | undefined
  >(undefined);
  const { address } = useAccount();
  const router = useRouter();
  const params = useParams();
  const chainId = params["chainId"];
  const poolId = params["poolId"];
  const applicationId: string | string[] | undefined = params["applicationId"];

  const [isOpen, setIsOpen] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    name: "",
    website: "",
    description: "",
    email: "",
    requestedAmount: "",
    recipientAddress: "",
    profileId: "",
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const isUsingRegistryAnchor = props.microGrant.useRegistryAnchor;

  const handleSwitchNetwork = async () => {
    switchNetwork?.(5);

    // todo: update steps...
  };

  const handleCancel = () => {
    if (isPreview) {
      setIsPreview(false);
      return;
    } else {
      setIsOpen(false);
      window.location.assign(`/${chainId}/${poolId}`);
    }
  };

  const onHandlePreview = async (data: any) => {
    if (Number(chain!.id) !== 5) {
      setIsPreview(false);
      await handleSwitchNetwork();

      // return;
    }

    const newProfileName = !createNewProfile
      ? undefined
      : data.profilename
      ? data.profilename
      : data.name;

    const _newApplicationData: TNewApplication = {
      name: data.name,
      website: data.website,
      description: data.description,
      email: data.email,
      requestedAmount: parseUnits(
        data.requestedAmount,
        props.microGrant.pool.tokenMetadata.decimals || 18,
      ),
      recipientAddress: data.recipientAddress,
      base64Image: base64Image,
      profileName: newProfileName,
      profileId: data.profileId,
    };

    setNewApplicationData(_newApplicationData);
    setIsPreview(true);
  };

  const onHandleSubmit = async () => {
    if (!newApplicationData) return;

    setIsOpen(true);
    const recipientId = await createApplication(
      newApplicationData,
      Number(chainId),
      Number(poolId),
    );

    setTimeout(() => {
      setIsOpen(false);
      router.push(`/${chainId}/${poolId}/${recipientId}`);
      router.refresh();
    }, 1000);
  };

  const setText = (text: string) => {
    setValue("description", text);
  };

  const createApplicationData = (): TApplicationData => {
    return {
      microGrant: {
        chainId: chainId.toString(),
        poolId: poolId.toString(),
        allocationStartTime: props.microGrant.allocationStartTime,
        allocationEndTime: props.microGrant.allocationEndTime,
        maxRequestedAmount: props.microGrant.maxRequestedAmount,
        blockTimestamp: props.microGrant.blockTimestamp,
        pool: {
          strategy: props.microGrant.pool.strategy,
          tokenMetadata: {
            name: props.microGrant.pool.tokenMetadata.name,
            symbol: props.microGrant.pool.tokenMetadata.symbol,
            decimals: props.microGrant.pool.tokenMetadata.decimals,
          },
          token: props.microGrant.pool.token,
          amount: props.microGrant.pool.amount,
        },
        allocateds: props.microGrant.allocateds || [],
        distributeds: props.microGrant.distributeds || [],
      },
      sender: address as string,
      recipientId: newApplicationData!.recipientAddress,
      recipientAddress: newApplicationData!.recipientAddress,
      requestedAmount: newApplicationData!.requestedAmount.toString(),
      metadataPointer: "pointer",
      blockTimestamp: new Date().toISOString(),
      isUsingRegistryAnchor: isUsingRegistryAnchor,
      status: "Pending",
    };
  };

  const createApplicationMetadata = (): TApplicationMetadata => {
    return {
      name: newApplicationData!.name,
      website: newApplicationData!.website,
      description: newApplicationData!.description,
      email: newApplicationData!.email,
      base64Image: newApplicationData!.base64Image,
    };
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      if (chainId && address) {
        const customProfile: TProfilesByOwnerResponse = {
          name: "New Profile",
          profileId: "0x0",
          owner: address.toLocaleLowerCase(),
          createdAt: "0",
          anchor: "0x",
        };

        let profiles: TProfilesByOwnerResponse[] = await getProfilesByOwner({
          chainId: chainId.toString(),
          account: address.toLocaleLowerCase(),
        });

        if (applicationId) {
          // filter where profiles.anchor == applicationId
          profiles = profiles.filter(
            (profile) => profile.anchor === applicationId,
          );

          setDefaultValues({
            ...defaultValues,
            profileId: profiles[0].profileId,
          });
        } else {
          if (profiles.length === 0) setCreateNewProfile(true);
          profiles.push(customProfile);
        }

        setProfiles(profiles);
      }
    };

    fetchProfiles();
  }, [address, chainId]);

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (applicationId) {
        try {
          const applicationData = await getApplicationData(
            chainId as string,
            poolId as string,
            applicationId as string,
          );

          if (!applicationData.application || !applicationData.metadata) return;

          const app = applicationData.application;
          const md = applicationData.metadata;

          const previousValues: ApplicationFormData = {
            name: md.name,
            website: md.website,
            description: md.description,
            email: md.email,
            requestedAmount: formatUnits(
              BigInt(app.requestedAmount),
              props.microGrant.pool.tokenMetadata.decimals || 18,
            ).toString(),
            recipientAddress: app.recipientAddress,
            profileId: profiles.length > 0 ? profiles[0].profileId : "0x0",
          };

          // for each key in previousValues, set the value
          Object.keys(previousValues).forEach((key) => {
            setValue(
              key as keyof ApplicationFormData,
              previousValues[key as keyof ApplicationFormData],
            );
          });

          setDefaultValues(previousValues);
          setBase64Image(applicationData.bannerImage);
        } catch (error) {
          console.error("Error fetching application data:", error);
        }
      }
    };

    if (chainId && poolId && applicationId) fetchApplicationData();
  }, [applicationId, chainId, poolId, profiles]);

  return (
    <form onSubmit={handleSubmit(onHandlePreview)}>
      {!isPreview ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {applicationId ? "Edit" : "New"} Application
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                This information will be stored on IPFS and will be reviewed by
                the pool managers
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      {...register("name")}
                      type="text"
                      name="name"
                      id="name"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="Allo Protocol"
                    />
                  </div>
                </div>
                <div>
                  {errors.name && <Error message={errors.name?.message!} />}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Website
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                    <input
                      {...register("website")}
                      type="text"
                      name="website"
                      id="website"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="https://www.example.com"
                      defaultValue={defaultValues.website}
                    />
                  </div>
                </div>
                <div>
                  {errors.website && (
                    <Error message={errors.website?.message!} />
                  )}
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Description
                </label>
                <MarkdownEditor
                  setText={setText}
                  value={
                    defaultValues.description ||
                    newApplicationData?.description ||
                    ""
                  }
                />
                {/* Register the "description" field */}
                <input
                  {...register("description")}
                  type="hidden" // Hidden because MarkdownEditor handles the input
                />
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  Write a brief description about the project and why it&apos;s
                  applying to the round
                </p>
                <div>
                  {errors.description && (
                    <Error message={errors.description?.message!} />
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    {...register("email")}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={defaultValues.email}
                  />
                </div>
                <div>
                  {errors.email && <Error message={errors.email?.message!} />}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="requestedAmount"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Requested Amount
                </label>
                <div className="mt-2">
                  <input
                    {...register("requestedAmount")}
                    id="requestedAmount"
                    name="requestedAmount"
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={defaultValues.requestedAmount}
                  />
                </div>
                <p className="text-xs leading-5 text-gray-600 mt-2">
                  {`max ${maxRequestedAmount} ${
                    props.microGrant.pool.tokenMetadata.symbol ?? "ETH"
                  }`}
                </p>
                <div>
                  {errors.requestedAmount && (
                    <Error message={errors.requestedAmount?.message!} />
                  )}
                </div>
              </div>

              <div className="sm:col-span-full">
                <label
                  htmlFor="recipientAddress"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Recipient Address
                </label>
                <div className="mt-2">
                  <input
                    {...register("recipientAddress")}
                    type="text"
                    name="recipientAddress"
                    id="recipientAddress"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={defaultValues.recipientAddress}
                  />
                  <div>
                    {errors.recipientAddress && (
                      <Error message={errors.recipientAddress?.message!} />
                    )}
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">
                    The wallet to which the funds would be sent to.
                  </p>
                </div>
              </div>

              <ImageUpload
                setBase64Image={setBase64Image}
                previewImage={
                  base64Image || newApplicationData?.base64Image || undefined
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Profile Information
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                A registry profile is created to manage your project.
                Optionally, you can use an existing profile. An anchor wallet,
                controlled by the profile and requiring a unique owner nonce, is
                generated. Utilize the anchor wallet to receive funds, gather
                attestations, and build project reputation.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-full">
                <label
                  htmlFor="profileId"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Registry Profile ID
                </label>
                <div className="mt-2">
                  <div className="sm:col-span-4">
                    {profiles.length > 0 && (
                      <select
                        {...register("profileId")}
                        id="profileId"
                        name="profileId"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={defaultValues.profileId}
                        disabled={applicationId ? true : false}
                        onChange={(e) => {
                          setCreateNewProfile(e.target.value === "0x0");
                        }}
                      >
                        {profiles.map((profile, index) => (
                          <option
                            key={profile.profileId}
                            value={profile.profileId}
                            selected={index === 0}
                          >
                            {`${profile.name} ${
                              profile.profileId === "0x0"
                                ? ""
                                : profile.profileId
                            }`}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <p className="text-xs leading-5 text-gray-600 mt-2">
                    The registry profile ID for your organization, linked to
                    your pool.
                  </p>
                  <div>
                    {errors.profileId && (
                      <Error message={errors.profileId?.message!} />
                    )}
                  </div>
                </div>
              </div>
              {createNewProfile && (
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Profile Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                      <input
                        {...register("profilename")}
                        type="text"
                        name="profilename"
                        id="profilename"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Allo Protocol"
                      />
                    </div>
                  </div>
                  <div>
                    {errors.profilename && (
                      <Error message={errors.profilename?.message!} />
                    )}
                  </div>
                </div>
              )}{" "}
            </div>
          </div>
        </div>
      ) : (
        <>
          <ApplicationDetail
            application={createApplicationData()}
            metadata={createApplicationMetadata()}
            bannerImage={newApplicationData?.base64Image!}
            isError={false}
          />
        </>
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="bg-red-700 hover:bg-red-500 text-sm font-semibold leading-6 text-white rounded-md px-3 py-2"
          onClick={handleCancel}
        >
          {!isPreview ? "Cancel" : "Back"}
        </button>
        {!isPreview ? (
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Preview
          </button>
        ) : (
          <button
            onClick={onHandleSubmit}
            className="bg-green-700 hover:bg-green-500 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Submit
          </button>
        )}

        <Modal isOpen={isOpen} setIsOpen={setIsOpen} steps={steps} />
      </div>
    </form>
  );
}
