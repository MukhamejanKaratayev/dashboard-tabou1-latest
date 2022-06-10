import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
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
import {
  Badge,
  Button,
  Card,
  CodeBlock,
  Heading,
  LinkButton,
  Text,
} from "tw-components";

const DeployUpsell: React.FC = () => {
  return <>Deploy Upsell</>;
};

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
        <Button size="sm" onClick={() => setIsOpen(true)}>
          Import your contracts
        </Button>
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
      <Box p={4} />
      <Flex pb={4} gap={2} direction="column">
        <Heading size="title.md">Pre-built contracts</Heading>
        <Text fontStyle="italic">
          Contracts created by the thirdweb team that you can deploy
        </Text>
      </Flex>
      <DeployableContractTable
        hasDescription
        contractIds={Object.keys(KNOWN_CONTRACTS_MAP)}
      />
      <Modal isCentered isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent mx={{ base: 4, md: 0 }}>
          <ModalHeader size="title.md" as={Heading}>
            Import Contracts
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="small">
              Run this command in your smart contract project to import
            </Text>
            <CodeBlock language="javascript" code="npx thirdweb deploy" />
          </ModalBody>
        </ModalContent>
      </Modal>
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
