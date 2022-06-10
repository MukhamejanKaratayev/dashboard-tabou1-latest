import { Box, Icon, Link, VStack } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import React, { ReactElement } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { CodeBlock, Text } from "tw-components";

const ContractsHomepageWrapped: React.FC = () => {
  const { Track } = useTrack({
    page: "contracts",
  });

  const walletAddress = useAddress();
  const publishedContracts = usePublishedContractsQuery();

  return (
    <Track>
      <VStack p={4} alignItems="flex-start">
        <Link href="/contracts">
          <Icon size="sm" as={FiChevronLeft}>
            Import your contracts
          </Icon>
        </Link>
      </VStack>
      <Text fontSize="small">
        Run this command in your smart contract project to import
      </Text>
      <CodeBlock language="javascript" code="npx thirdweb deploy" />
      <Box p={4} />
    </Track>
  );
};

export default function ContractsHomepage() {
  return (
    <CustomSDKContext desiredChainId={ChainId.Mumbai}>
      <ContractsHomepageWrapped />
    </CustomSDKContext>
  );
}

ContractsHomepage.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);
