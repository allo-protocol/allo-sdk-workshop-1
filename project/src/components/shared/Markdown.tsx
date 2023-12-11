import { useEffect, useState } from "react";
import ReactMde, { Preview } from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { getIPFSClient } from "@/services/ipfs";

const buttonStyles = `
  .mde-tabs button {
      padding-left: 5px;
      padding-right: 5px;
    }
  `;

export const MarkdownEditor = (props: {
  setText: (text: string) => void;
  value?: string;
}) => {
  const [value, setValue] = useState(props.value || "");
  const [selectedTab, setSelectedTab] = useState<
    "write" | "preview" | undefined
  >("write");

  const onChangeHandler = (value: string) => {
    setValue(value);
    props.setText(value);
  };

  useEffect(() => {
    if (!props.value) return;
    setValue(props.value);
  }, [props.value]);

  const save = async function* (file: any) {
    try {
      const blob = new Blob([file]);

      const ipfsClient = getIPFSClient();
      const result = await ipfsClient.pinFile(blob);

      await new Promise((resolve) => setTimeout(resolve, 200));

      yield `${process.env.NEXT_PUBLIC_IPFS_READ_GATEWAY}ipfs/${result.IpfsHash}`;
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  };

  return (
    <div>
      <style>{buttonStyles}</style>
      <div className="container">
        <ReactMde
          value={value}
          onChange={onChangeHandler}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
          paste={{
            saveImage: save,
          }}
        />
      </div>
    </div>
  );
};

export const MarkdownView = (props: { text: string }) => {
  return (
    <>
      <Preview
        minHeight={200}
        heightUnits="px"
        markdown=""
        generateMarkdownPreview={() =>
          Promise.resolve(<ReactMarkdown>{props.text}</ReactMarkdown>)
        }
      />
    </>
  );
};
