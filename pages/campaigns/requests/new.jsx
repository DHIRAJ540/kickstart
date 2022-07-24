import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import getCampaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Form, Button, Message, Input } from "semantic-ui-react";
import { Link, Router } from "../../../routes";
import { useRouter } from "next/router";

const RequestNew = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getInitialProps = async () => {
    setAddress(router.query.address);
  };

  useEffect(() => {
    getInitialProps();
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const campaign = getCampaign(router.query.address);

    try {
      const accounts = await await web3.eth.getAccounts();

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
        });

      Router.pushRoute(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
        <a>Back</a>
      </Link>
      <h3>Create a request</h3>
      <Form onSubmit={(e) => onSubmit(e)} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in ether</label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button primary loading={loading}>
          Create
        </Button>
      </Form>
    </Layout>
  );
};

export default RequestNew;
