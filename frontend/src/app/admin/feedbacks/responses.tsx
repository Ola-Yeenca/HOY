'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Heading,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { feedbackAdminApi } from '@/services/adminApi';

interface Response {
  id: string;
  user_email: string;
  created_at: string;
  answers: {
    question: string;
    answer: string;
  }[];
}

export default function SurveyResponses({ surveyId }: { surveyId: string }) {
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadResponses();
  }, [surveyId]);

  const loadResponses = async () => {
    try {
      const data = await feedbackAdminApi.getSurveyResponses();
      // Filter responses for the current survey
      const filteredResponses = data.filter(
        (response) => response.survey_id === surveyId
      );
      setResponses(filteredResponses);
    } catch (error) {
      toast({
        title: 'Error loading responses',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      try {
        await feedbackAdminApi.deleteSurveyResponse(id);
        loadResponses();
        toast({
          title: 'Response deleted successfully',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Error deleting response',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const formatResponseData = (data: any) => {
    if (typeof data === 'object') {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }
    return data;
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Survey Responses</Heading>
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>User</Th>
            <Th>Submitted At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {responses.map((response) => (
            <Tr key={response.id}>
              <Td>{response.id}</Td>
              <Td>{response.user_email}</Td>
              <Td>{new Date(response.created_at).toLocaleDateString()}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => {
                    setSelectedResponse(response);
                    onOpen();
                  }}
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(response.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Response Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedResponse && (
              <Box>
                <Text mb={2}>
                  <strong>User:</strong> {selectedResponse.user_email}
                </Text>
                <Text mb={2}>
                  <strong>Submitted:</strong>{' '}
                  {new Date(selectedResponse.created_at).toLocaleString()}
                </Text>
                <Text mb={2}>
                  <strong>Responses:</strong>
                </Text>
                <Box
                  whiteSpace="pre-wrap"
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                >
                  {formatResponseData(selectedResponse.answers)}
                </Box>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
