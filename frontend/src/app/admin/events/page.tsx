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
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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

  const handleBulkAction = (action: string) => {
    if (selectedEvents.length === 0) {
      toast({
        title: 'No events selected',
        description: 'Please select events to perform this action',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    switch (action) {
      case 'delete':
        // Implement bulk delete
        break;
      case 'export':
        // Implement export functionality
        break;
      default:
        break;
    }
  };

  const eventStats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
  };

  const filteredEvents = events
    .filter(event => {
      if (filterStatus === 'all') return true;
      return event.status === filterStatus;
    })
    .filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'title':
          return order * a.title.localeCompare(b.title);
        case 'date':
          return order * (new Date(a.date).getTime() - new Date(b.date).getTime());
        case 'attendees':
          return order * (a.attendees - b.attendees);
        default:
          return 0;
      }
    });

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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          maxW="200px"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </Select>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          maxW="200px"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
          <option value="attendees">Sort by Attendees</option>
        </Select>
      </Flex>

      <Flex gap={4} mb={6} flexWrap="wrap">
        <Box p={4} bg="coffee-bean" borderRadius="xl" borderWidth={1} borderColor="gold.200">
          <Text fontSize="sm" color="white-plum">Total Events</Text>
          <Heading size="lg" color="gold">{eventStats.total}</Heading>
        </Box>
        <Box p={4} bg="coffee-bean" borderRadius="xl" borderWidth={1} borderColor="gold.200">
          <Text fontSize="sm" color="white-plum">Upcoming</Text>
          <Heading size="lg" color="gold">{eventStats.upcoming}</Heading>
        </Box>
        <Box p={4} bg="coffee-bean" borderRadius="xl" borderWidth={1} borderColor="gold.200">
          <Text fontSize="sm" color="white-plum">Ongoing</Text>
          <Heading size="lg" color="gold">{eventStats.ongoing}</Heading>
        </Box>
        <Box p={4} bg="coffee-bean" borderRadius="xl" borderWidth={1} borderColor="gold.200">
          <Text fontSize="sm" color="white-plum">Completed</Text>
          <Heading size="lg" color="gold">{eventStats.completed}</Heading>
        </Box>
      </Flex>

      {selectedEvents.length > 0 && (
        <Flex gap={4} mb={6}>
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => handleBulkAction('delete')}
          >
            Delete Selected
          </Button>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => handleBulkAction('export')}
          >
            Export Selected
          </Button>
        </Flex>
      )}

      {loading ? (
        <Text>Loading events...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedEvents(events.map(event => event.id));
                    } else {
                      setSelectedEvents([]);
                    }
                  }}
                />
              </Th>
              <Th>Image</Th>
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
                <Td>
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedEvents([...selectedEvents, event.id]);
                      } else {
                        setSelectedEvents(selectedEvents.filter(id => id !== event.id));
                      }
                    }}
                  />
                </Td>
                <Td>
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Td>
                <Td>{event.title}</Td>
                <Td>{new Date(event.date).toLocaleDateString()}</Td>
                <Td>{event.location.name}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      event.status === 'upcoming'
                        ? 'green'
                        : event.status === 'ongoing'
                        ? 'blue'
                        : 'gray'
                    }
                  >
                    {event.status}
                  </Badge>
                </Td>
                <Td>{event.attendees}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
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
                        leftIcon={<FaEdit />}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      leftIcon={<FaTrash />}
                      colorScheme="red"
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
        <ModalContent bg="coffee-bean">
          <ModalHeader color="gold">
            {selectedEvent ? 'Edit Event' : 'Create New Event'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {/* Add your event form here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
