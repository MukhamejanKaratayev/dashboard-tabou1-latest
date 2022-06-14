import { ClaimPhases } from "./components";
import { ButtonGroup, Divider, Flex } from "@chakra-ui/react";
import { useContract } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import React from "react";
import { Card, Heading, LinkButton, Text } from "tw-components";

interface ContractClaimPhasesPageProps {
  contractAddress?: string;
}

export const ContractClaimPhasesPage: React.FC<
  ContractClaimPhasesPageProps
> = ({ contractAddress }) => {
  const contract = useContract(contractAddress);

  const detectedFeature = detectClaimPhases(contract.contract as SmartContract);

  if (contract.isLoading) {
    // TODO build a skeleton for this
    return <div>Loading...</div>;
  }

  if (!detectedFeature) {
    return (
      <Card as={Flex} flexDir="column" gap={3}>
        {/* TODO  extract this out into it's own component and make it better */}
        <Heading size="subtitle.md">No ClaimPhases enabled</Heading>
        <Text>
          To enable ClaimPhases features you will have to extend the required
          interfaces in your contract.
        </Text>

        <Divider my={1} borderColor="borderColor" />
        <Flex gap={4} align="center">
          <Heading size="label.md">Learn more: </Heading>
          <ButtonGroup colorScheme="purple" size="sm" variant="solid">
            <LinkButton
              isExternal
              href="https://portal.thirdweb.com/thirdweb-deploy/contract-extensions/"
            >
              Claim Phases
            </LinkButton>
          </ButtonGroup>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap={6}>
      <ClaimPhases contract={contract.contract as SmartContract} />
    </Flex>
  );
};

export function detectClaimPhases(contract: SmartContract) {
  if (!contract) {
    return undefined;
  }
  if ("nft" in contract) {
    return contract.nft?.drop?.claimConditions;
  }
  return undefined;
}
