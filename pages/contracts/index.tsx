import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  Link,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { ChainId, KNOWN_CONTRACTS_MAP } from "@thirdweb-dev/sdk";
import { AppLayout } from "components/app-layouts/app";
import { DeployableContractTable } from "components/contract-components/contract-table";
import { usePublishedContractsQuery } from "components/contract-components/hooks";
import { CustomSDKContext } from "contexts/custom-sdk-context";
import { useTrack } from "hooks/analytics/useTrack";
import React, { ReactElement, useState } from "react";
import { IoRefreshSharp } from "react-icons/io5";
import { Button, Heading, Text } from "tw-components";

const ContractsHomepageWrapped: React.FC = () => {
  const { Track } = useTrack({
    page: "contracts",
  });

  const [isOpen, setIsOpen] = useState(false);

  const walletAddress = useAddress();
  const publishedContracts = usePublishedContractsQuery();

  return (
    <Track>
      <VStack alignItems="flex-end">
        <Link href="/contracts/import">
          <Button size="sm">Import your contracts</Button>
        </Link>
      </VStack>
      {!publishedContracts.isSuccess ||
        (publishedContracts.data.length > 0 ? (
          <Flex gap={8} direction="column">
            <Flex gap={2} direction="column">
              <Heading size="title.md">Published contracts </Heading>
              <Text fontStyle="italic">
                Contracts that you have published via the thirdweb cli
              </Text>
            </Flex>

            <DeployableContractTable
              isFetching={publishedContracts.isFetching}
              contractIds={(publishedContracts.data || [])?.map((d) =>
                d.metadataUri.replace("ipfs://", ""),
              )}
            >
              {publishedContracts.isLoading && (
                <Center>
                  <Flex mt={4} py={4} direction="row" gap={4} align="center">
                    {walletAddress && <Spinner size="sm" />}
                    <Text>
                      {walletAddress
                        ? "Loading your contracts"
                        : "No wallet connected"}
                    </Text>
                  </Flex>
                </Center>
              )}
              {publishedContracts.isError && (
                <Center>
                  <Flex mt={4} py={4} direction="column" gap={4} align="center">
                    <Alert status="error" borderRadius="md">
                      <AlertIcon />
                      <AlertTitle mr={2}>
                        Failed to fetch published contracts
                      </AlertTitle>
                      <Button
                        onClick={() => publishedContracts.refetch()}
                        leftIcon={<IoRefreshSharp />}
                        ml="auto"
                        size="sm"
                        colorScheme="red"
                      >
                        Retry
                      </Button>
                    </Alert>
                  </Flex>
                </Center>
              )}
            </DeployableContractTable>
          </Flex>
        ) : (
          ""
        ))}
      <Flex mt={4} pb={4} gap={2} direction="column">
        <Heading size="title.md">Pre-built contracts</Heading>
        <Text fontStyle="italic">
          Contracts created by the thirdweb team that you can deploy
        </Text>
      </Flex>
      <DeployableContractTable
        hasDescription
        contractIds={Object.keys(KNOWN_CONTRACTS_MAP)}
      />
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
