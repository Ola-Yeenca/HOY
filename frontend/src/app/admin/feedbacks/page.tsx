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
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import { feedbackAdminApi } from '@/services/adminApi';

interface Feedback {
  id: string;
  user_email: string;
  content: string;
  status: string;
  created_at: string;
}

interface Survey {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
}

export default function FeedbackAdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [response, setResponse] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadFeedbacks();
    loadSurveys();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const data = await feedbackAdminApi.getFeedbacks();
      setFeedbacks(data);
    } catch (error) {
      toast({
        title: 'Error loading feedbacks',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const loadSurveys = async () => {
    try {
      const data = await feedbackAdminApi.getSurveys();
      setSurveys(data);
    } catch (error) {
      toast({
        title: 'Error loading surveys',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await feedbackAdminApi.updateFeedbackStatus(id, status);
      loadFeedbacks();
      toast({
        title: 'Status updated successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleResponse = async () => {
    try {
      if (!selectedFeedback) {
        toast({
          title: 'No feedback selected',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      await feedbackAdminApi.respondToFeedback(selectedFeedback.id, response);
      loadFeedbacks();
      onClose();
      setResponse('');
      toast({
        title: 'Response sent successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error sending response',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAdminApi.deleteFeedback(id);
        loadFeedbacks();
        toast({
          title: 'Feedback deleted successfully',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Error deleting feedback',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Feedback Administration</Heading>
      
      <Tabs>
        <TabList>
          <Tab>Feedbacks</Tab>
          <Tab>Surveys</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>User</Th>
                  <Th>Content</Th>
                  <Th>Status</Th>
                  <Th>Created At</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {feedbacks.map((feedback) => (
                  <Tr key={feedback.id}>
                    <Td>{feedback.id}</Td>
                    <Td>{feedback.user_email}</Td>
                    <Td>{feedback.content}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          feedback.status === 'PENDING'
                            ? 'yellow'
                            : feedback.status === 'IN_PROGRESS'
                            ? 'blue'
                            : 'green'
                        }
                      >
                        {feedback.status}
                      </Badge>
                    </Td>
                    <Td>{new Date(feedback.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            onOpen();
                          }}
                        >
                          Respond
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(feedback.id)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Flex justify="space-between" mb={4}>
              <Heading size="md">Surveys</Heading>
              <Button colorScheme="blue" onClick={() => {}}>
                Create Survey
              </Button>
            </Flex>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Created At</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {surveys.map((survey) => (
                  <Tr key={survey.id}>
                    <Td>{survey.id}</Td>
                    <Td>{survey.title}</Td>
                    <Td>
                      <Badge
                        colorScheme={survey.is_active ? 'green' : 'red'}
                      >
                        {survey.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>{new Date(survey.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <Flex gap={2}>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {}}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => {}}
                        >
                          View Responses
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => {}}
                        >
                          Delete
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Respond to Feedback</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box mb={4}>
              <strong>Feedback:</strong> {selectedFeedback?.content}
            </Box>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your response here..."
            />
            <Button mt={4} colorScheme="blue" onClick={handleResponse}>
              Send Response
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
