import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import getCampaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const ContributeForm = ({ address }) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const campaign = getCampaign(address);

    try {
      setLoading(true);

      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });

      Router.replaceRoute(`/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
    setValue("");
  };

  return (
    <Form onSubmit={(e) => onSubmit(e)} error={!!errorMessage}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Message error header="Oops!!" content={errorMessage} />
      <Button primary loading={loading}>
        Contribute
      </Button>
    </Form>
  );
};

export default ContributeForm;
