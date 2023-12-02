import { stringToColor } from "@/utils/common";
import { aspectRatio } from "@/utils/config";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const Banner = (props: { image: string | undefined | null; alt: string; minHeight?: string }) => {
  const bannerRef = useRef<any>(null);
  const [bannerSize, setBannerSize] = useState({
    width: 0,
    height: 0,
  });

useEffect(() => {
  const updateBannerSize = () => {
    if (bannerRef.current) {
      setBannerSize({
        width: bannerRef.current.offsetWidth,
        height: Math.ceil(bannerRef.current.offsetWidth / aspectRatio),
      });
    }
  };

  window.addEventListener("resize", updateBannerSize);
  updateBannerSize();

  return () => {
    window.removeEventListener("resize", updateBannerSize);
  };
}, [bannerRef.current, props.image]);

return (
  <>
    {props.image && props.image !== "" ? (
      <Image
        ref={bannerRef}
        src={props.image}
        alt={props.alt}
        className="h-full w-full object-cover object-center"
        style={{
          minHeight: props.minHeight,
        }}
        width={bannerSize.width}
        height={bannerSize.height}
        onLoad={() =>
          setBannerSize({
            width: bannerRef.current.offsetWidth,
            height: Math.ceil(bannerRef.current.offsetWidth / aspectRatio),
          })
        }
      />
    ) : (
      <div
        ref={bannerRef}
        className="flex items-center justify-center"
        style={{
          width: `100%`,
          height: `${bannerSize.height}px`,
          minHeight: props.minHeight,
          backgroundColor: stringToColor(
            props.alt ?? (Math.random() * 10000).toString(),
          ),
        }}
      >
        <span className="text-gray-400 text-3xl">{props.alt}</span>
      </div>
    )}
  </>
);
};

export default Banner;
