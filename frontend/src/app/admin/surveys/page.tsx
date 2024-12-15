'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Select,
  Badge,
  Progress,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartBar,
  FaDownload,
  FaShareAlt,
  FaFilter,
} from 'react-icons/fa';

interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'general' | 'feedback';
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  responseCount: number;
  completionRate: number;
}

const mockSurveys: Survey[] = [
  {
    id: '1',
    title: 'Event Satisfaction Survey',
    description: 'Gather feedback about our recent summer festival',
    type: 'event',
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    responseCount: 145,
    completionRate: 78,
  },
  {
    id: '2',
    title: 'User Experience Survey',
    description: 'Help us improve our platform',
    type: 'general',
    status: 'draft',
    startDate: '2024-12-15',
    endDate: '2025-01-15',
    responseCount: 0,
    completionRate: 0,
  },
  // Add more mock surveys as needed
];

export default function SurveysPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [surveys, setSurveys] = useState<Survey[]>(mockSurveys);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSurveys = surveys.filter(survey => {
    const matchesType = filterType === 'all' || survey.type === filterType;
    const matchesStatus = filterStatus === 'all' || survey.status === filterStatus;
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const handleCreateSurvey = () => {
    setSelectedSurvey(null);
    onOpen();
  };

  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    onOpen();
  };

  const handleDeleteSurvey = (surveyId: string) => {
    setSurveys(surveys.filter(s => s.id !== surveyId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'draft':
        return 'yellow';
      case 'completed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading color="gold" size="lg">Surveys Management</Heading>
          <Text color="white-plum">Create and manage your surveys</Text>
        </Box>
        <Button
          leftIcon={<FaPlus />}
          colorScheme="gold"
          onClick={handleCreateSurvey}
        >
          Create Survey
        </Button>
      </Flex>

      {/* Filters */}
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={6}>
        <Input
          placeholder="Search surveys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="event">Event</option>
          <option value="general">General</option>
          <option value="feedback">Feedback</option>
        </Select>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
        <Button leftIcon={<FaFilter />}>More Filters</Button>
      </Grid>

      {/* Surveys Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {filteredSurveys.map((survey) => (
          <motion.div
            key={survey.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              p={6}
              bg="coffee-bean"
              borderRadius="xl"
              borderWidth={1}
              borderColor="gold.200"
            >
              <Flex justify="space-between" align="start" mb={4}>
                <Badge colorScheme={getStatusColor(survey.status)}>
                  {survey.status.toUpperCase()}
                </Badge>
                <Flex gap={2}>
                  <Tooltip label="View Analytics">
                    <IconButton
                      aria-label="View Analytics"
                      icon={<FaChartBar />}
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                  <Tooltip label="Export Responses">
                    <IconButton
                      aria-label="Export Responses"
                      icon={<FaDownload />}
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                  <Tooltip label="Share Survey">
                    <IconButton
                      aria-label="Share Survey"
                      icon={<FaShareAlt />}
                      size="sm"
                      variant="ghost"
                    />
                  </Tooltip>
                </Flex>
              </Flex>

              <Heading size="md" color="gold" mb={2}>{survey.title}</Heading>
              <Text color="white-plum" fontSize="sm" mb={4}>{survey.description}</Text>

              <Grid templateColumns="1fr 1fr" gap={4} mb={4}>
                <Box>
                  <Text fontSize="xs" color="white-plum">Start Date</Text>
                  <Text color="white">{new Date(survey.startDate).toLocaleDateString()}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="white-plum">End Date</Text>
                  <Text color="white">{new Date(survey.endDate).toLocaleDateString()}</Text>
                </Box>
              </Grid>

              <Box mb={4}>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="xs" color="white-plum">Completion Rate</Text>
                  <Text fontSize="xs" color="white">{survey.completionRate}%</Text>
                </Flex>
                <Progress
                  value={survey.completionRate}
                  colorScheme="gold"
                  size="sm"
                  borderRadius="full"
                />
              </Box>

              <Flex gap={2}>
                <Button
                  size="sm"
                  leftIcon={<FaEdit />}
                  onClick={() => handleEditSurvey(survey)}
                  flex={1}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  leftIcon={<FaTrash />}
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => handleDeleteSurvey(survey.id)}
                >
                  Delete
                </Button>
              </Flex>
            </Box>
          </motion.div>
        ))}
      </Grid>

      {/* Create/Edit Survey Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="coffee-bean">
          <ModalHeader color="gold">
            {selectedSurvey ? 'Edit Survey' : 'Create New Survey'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Add your survey form here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
