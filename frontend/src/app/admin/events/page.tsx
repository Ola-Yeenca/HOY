'use client';

import React, { useState, useEffect } from 'react';
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
  Flex,
  Input,
  Select,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import { eventAdminApi } from '@/services/adminApi';

interface Event {
  id: string;
  title: string;
  date: string;
  location: {
    name: string;
    address: string;
  };
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees: number;
  imageUrl: string;
  description: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await eventAdminApi.getEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAdminApi.deleteEvent(id);
        loadEvents();
        toast({
          title: 'Event deleted successfully',
          status: 'success',
          duration: 3000,
        });
      } catch (err) {
        toast({
          title: 'Failed to delete event',
          status: 'error',
          duration: 3000,
        });
      }
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const colorScheme = {
      upcoming: 'green',
      ongoing: 'blue',
      completed: 'gray',
    }[status] || 'gray';

    return (
      <Badge colorScheme={colorScheme}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>Events</Heading>
          <Text color="gray.500">Manage your events and track their performance</Text>
        </Box>
        <Link href="/admin/events/create" passHref>
          <Button as="a" colorScheme="blue" leftIcon={<FaPlus />}>
            Create Event
          </Button>
        </Link>
      </Flex>

      <Flex gap={4} mb={6}>
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          maxW="300px"
        />
        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          maxW="200px"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </Select>
      </Flex>

      {loading ? (
        <Text>Loading events...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Date</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Attendees</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEvents.map((event) => (
              <Tr key={event.id}>
                <Td>{event.title}</Td>
                <Td>{new Date(event.date).toLocaleDateString()}</Td>
                <Td>{event.location.name}</Td>
                <Td>{getStatusBadge(event.status)}</Td>
                <Td>{event.attendees}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<FaEye />}
                      onClick={() => {
                        setSelectedEvent(event);
                        onOpen();
                      }}
                    >
                      View
                    </Button>
                    <Link href={`/admin/events/${event.id}/edit`} passHref>
                      <Button
                        as="a"
                        size="sm"
                        colorScheme="green"
                        leftIcon={<FaEdit />}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      colorScheme="red"
                      leftIcon={<FaTrash />}
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {filteredEvents.length === 0 && !loading && !error && (
        <Text textAlign="center" mt={6}>
          No events found matching your criteria.
        </Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedEvent && (
              <Box>
                {selectedEvent.imageUrl && (
                  <Box position="relative" h="200px" mb={4}>
                    <Image
                      width={500}
                      height={500}
                      src={selectedEvent.imageUrl}
                      alt={selectedEvent.title}
                      objectFit="cover"
                    />
                  </Box>
                )}
                <Text mb={2}>
                  <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}
                </Text>
                <Text mb={2}>
                  <strong>Location:</strong> {selectedEvent.location.name} ({selectedEvent.location.address})
                </Text>
                <Text mb={2}>
                  <strong>Status:</strong> {getStatusBadge(selectedEvent.status)}
                </Text>
                <Text mb={2}>
                  <strong>Attendees:</strong> {selectedEvent.attendees}
                </Text>
                <Text mb={2}>
                  <strong>Description:</strong>
                </Text>
                <Text>{selectedEvent.description}</Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
