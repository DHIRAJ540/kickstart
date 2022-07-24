import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import getCampaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

const CampaignShow = (props) => {
  const router = useRouter();

  const [minimumContribution, setMinimumContribution] = useState("");
  const [balance, setBalance] = useState("");
  const [requestsCount, setRequestsCount] = useState("");
  const [approversCount, setApproversCount] = useState("");
  const [manager, setManager] = useState("");
  const [address, setAddress] = useState("");

  const getInitialProps = async () => {
    setAddress(router.query.address);
    const campaign = getCampaign(router.query.address);

    const summary = await campaign.methods.getSummary().call();

    setMinimumContribution(summary[0]);
    setBalance(summary[1]);
    setRequestsCount(summary[2]);
    setApproversCount(summary[3]);
    setManager(summary[4]);
  };

  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "The manager created this campaign and can request to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least his much wei to become a approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdarw money from the contract, Request must be approved by approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description: "The number of approvers tat donated to this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "How much money this campaign has left to spent",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} />;
  };

  useEffect(() => {
    getInitialProps();
  });

  return (
    <Layout>
      <h3>Campaign show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

export default CampaignShow;
