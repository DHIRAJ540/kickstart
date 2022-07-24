import React, { useEffect, useState } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import { Link } from "../routes";
import Layout from "../components/Layout";

const CampaignIndex = () => {
  const [campaigns, setCampaigns] = useState([]);

  const getInitialProps = async () => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    setCampaigns(campaigns);
  };

  const renderCampaigns = () => {
    const items = campaigns.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  };

  useEffect(() => {
    getInitialProps();
  });

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create Campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

export default CampaignIndex;
