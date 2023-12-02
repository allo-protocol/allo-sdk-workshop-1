export type Config = {
  jwt: string;
  readGateway: string;
  writeGateway: string;
};

export const getIPFSClient = (): IPFSClient => {

  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;
  const readGateway = process.env.NEXT_PUBLIC_IPFS_READ_GATEWAY;
  const writeGateway = process.env.NEXT_PUBLIC_IPFS_WRITE_GATEWAY;

  if (!jwt || !readGateway || !writeGateway) {
    throw new Error("Missing IPFS configuration");
  }

  return new IPFSClient({
    jwt,
    readGateway,
    writeGateway,
  });
};

export default class IPFSClient {
  private jwt: string;

  private readGateway: string;

  private writeGateway: string;

  private pinJSONToIPFSUrl: string;

  private pinFileToIPFSUrl: string;

  constructor(config: Config) {
    this.jwt = config.jwt;
    this.readGateway = config.readGateway;
    this.writeGateway = config.writeGateway;

    this.pinJSONToIPFSUrl = `${this.writeGateway}pinning/pinJSONToIPFS`;
    this.pinFileToIPFSUrl = `${this.writeGateway}pinning/pinFileToIPFS`;
  }

  fileUrl(cid: string) {
    return `${this.readGateway}ipfs/${cid}`;
  }

  async fetchText(cid: string) {
    const url = this.fileUrl(cid);
    const resp = await fetch(url);
    return await resp.text();
  }

  async fetchJson(cid: string) {
    const url = this.fileUrl(cid);
    const resp = await fetch(url);
    return await resp.json();
  }

  baseRequestData(name: string) {
    return {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name,
        keyvalues: {
          app: "micro-grants",
        },
      },
    };
  }

  async pinJSON(object: any) {
    const data = {
      ...this.baseRequestData("micro-grants"),
      pinataContent: object,
    };

    const resp = await fetch(this.pinJSONToIPFSUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.jwt}`,
      },
      body: JSON.stringify(data),
    });
    if (resp.ok) {
      return resp.json();
    }
    return await Promise.reject(resp);
  }

  async pinFile(file: Blob) {
    const fd = new FormData();
    const requestData = this.baseRequestData("project-image");

    fd.append("file", file);
    fd.append("pinataOptions", JSON.stringify(requestData.pinataOptions));
    fd.append("pinataMetadata", JSON.stringify(requestData.pinataMetadata));

    const resp = await fetch(this.pinFileToIPFSUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: fd,
    });
    if (resp.ok) {
      return resp.json();
    }
    return await Promise.reject(resp);
  }
}
