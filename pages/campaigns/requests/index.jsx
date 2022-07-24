import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import { useRouter } from "next/router";
import getCampaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const RequestIndex = () => {
  const route = useRouter();
  const [address, setAddress] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsCount, setRequestsCount] = useState(0);
  const [approversCount, setApproversCount] = useState(0);
  const { Header, Row, HeaderCell, Body } = Table;

  const getInitialProps = async () => {
    setAddress(route.query.address);

    const campaign = getCampaign(route.query.address);

    const requestsCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();

    setApproversCount(approversCount);

    setRequestsCount(parseInt(requestsCount));

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return campaign.methods.requests(index).call();
        })
    );

    console.log(requests);
    setRequests(requests);
  };

  const renderRow = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          address={address}
          request={request}
          approversCount={approversCount}
        />
      );
    });
  };

  useEffect(() => {
    getInitialProps();
  });

  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${route.query.address}/requests/new`}>
        <a>
          <Button floated="right" style={{ marginBottom: 10 }} primary>
            Add request
          </Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRow()}</Body>
      </Table>

      <div>Found {requestsCount} requests</div>
    </Layout>
  );
};

export default RequestIndex;
