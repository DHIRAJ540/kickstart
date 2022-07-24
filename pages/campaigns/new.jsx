import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods.createCampaign(minimumContribution).send({
        from: accounts[0],
      });

      Router.pushRoute("/");
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <h3>Create a campaign</h3>

      <Form onSubmit={(e) => onSubmit(e)} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={isLoading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
