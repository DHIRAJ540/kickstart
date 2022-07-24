import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x82eC2181b607f4829B51b9cF33957482213f108B"
);

export default instance;
