'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  VStack,
  HStack,
  Box,
  Image,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { eventAdminApi } from '@/services/adminApi';
import { FaUpload, FaSave, FaTimes } from 'react-icons/fa';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  capacity: number;
  ageRestriction: string;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
  }[];
  image: FileList;
  status: 'draft' | 'published' | 'cancelled';
}

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any;
  onSuccess: () => void;
}

export default function EventFormModal({
  isOpen,
  onClose,
  event,
  onSuccess,
}: EventFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm<EventFormData>({
    defaultValues: event || {
      ticketTypes: [{ name: '', price: 0, quantity: 0 }],
    },
  });

  useEffect(() => {
    if (event) {
      reset(event);
      setImagePreview(event.imageUrl);
    }
  }, [event, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTicketType = () => {
    const ticketTypes = watch('ticketTypes') || [];
    setValue('ticketTypes', [
      ...ticketTypes,
      { name: '', price: 0, quantity: 0 },
    ]);
  };

  const removeTicketType = (index: number) => {
    const ticketTypes = watch('ticketTypes') || [];
    setValue(
      'ticketTypes',
      ticketTypes.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value[0]) {
          formData.append('image', value[0]);
        } else if (key === 'location' || key === 'ticketTypes') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (event?.id) {
        await eventAdminApi.updateEvent(event.id, formData);
        toast({
          title: 'Event updated',
          description: 'The event has been successfully updated',
          status: 'success',
        });
      } else {
        await eventAdminApi.createEvent(formData);
        toast({
          title: 'Event created',
          description: 'The event has been successfully created',
          status: 'success',
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save event',
        status: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="coffee-bean">
        <ModalHeader color="gold">
          {event ? 'Edit Event' : 'Create New Event'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              {/* Image Upload */}
              <FormControl isInvalid={!!errors.image}>
                <FormLabel>Event Image</FormLabel>
                <Box
                  borderWidth={2}
                  borderStyle="dashed"
                  borderColor="gold.200"
                  borderRadius="md"
                  p={4}
                  textAlign="center"
                >
                  {imagePreview ? (
                    <Box position="relative">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        maxH="200px"
                        mx="auto"
                      />
                      <Button
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        onClick={() => {
                          setImagePreview('');
                          setValue('image', undefined as any);
                        }}
                      >
                        <FaTimes />
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      as="label"
                      htmlFor="image-upload"
                      cursor="pointer"
                      leftIcon={<FaUpload />}
                    >
                      Upload Image
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        {...register('image')}
                        onChange={handleImageChange}
                      />
                    </Button>
                  )}
                </Box>
                <FormErrorMessage>
                  {errors.image && errors.image.message}
                </FormErrorMessage>
              </FormControl>

              {/* Basic Information */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Event title"
                />
                <FormErrorMessage>
                  {errors.title && errors.title.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register('description', {
                    required: 'Description is required',
                  })}
                  placeholder="Event description"
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>

              {/* Date and Time */}
              <HStack w="full">
                <FormControl isInvalid={!!errors.date}>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                  />
                  <FormErrorMessage>
                    {errors.date && errors.date.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.startTime}>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    {...register('startTime', {
                      required: 'Start time is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.startTime && errors.startTime.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.endTime}>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    {...register('endTime', { required: 'End time is required' })}
                  />
                  <FormErrorMessage>
                    {errors.endTime && errors.endTime.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Location */}
              <FormControl isInvalid={!!errors.location?.name}>
                <FormLabel>Venue Name</FormLabel>
                <Input
                  {...register('location.name', {
                    required: 'Venue name is required',
                  })}
                  placeholder="Venue name"
                />
                <FormErrorMessage>
                  {errors.location?.name && errors.location.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.location?.address}>
                <FormLabel>Address</FormLabel>
                <Input
                  {...register('location.address', {
                    required: 'Address is required',
                  })}
                  placeholder="Event address"
                />
                <FormErrorMessage>
                  {errors.location?.address && errors.location.address.message}
                </FormErrorMessage>
              </FormControl>

              {/* Capacity and Age Restriction */}
              <HStack w="full">
                <FormControl isInvalid={!!errors.capacity}>
                  <FormLabel>Capacity</FormLabel>
                  <Input
                    type="number"
                    {...register('capacity', {
                      required: 'Capacity is required',
                      min: { value: 1, message: 'Minimum capacity is 1' },
                    })}
                  />
                  <FormErrorMessage>
                    {errors.capacity && errors.capacity.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.ageRestriction}>
                  <FormLabel>Age Restriction</FormLabel>
                  <Select
                    {...register('ageRestriction')}
                    placeholder="Select age restriction"
                  >
                    <option value="none">None</option>
                    <option value="18+">18+</option>
                    <option value="21+">21+</option>
                  </Select>
                  <FormErrorMessage>
                    {errors.ageRestriction && errors.ageRestriction.message}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Ticket Types */}
              <Box w="full">
                <FormLabel>Ticket Types</FormLabel>
                {watch('ticketTypes')?.map((_, index) => (
                  <HStack key={index} mb={2}>
                    <FormControl>
                      <Input
                        {...register(`ticketTypes.${index}.name`)}
                        placeholder="Ticket name"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        {...register(`ticketTypes.${index}.price`)}
                        placeholder="Price"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="number"
                        {...register(`ticketTypes.${index}.quantity`)}
                        placeholder="Quantity"
                      />
                    </FormControl>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => removeTicketType(index)}
                    >
                      <FaTimes />
                    </Button>
                  </HStack>
                ))}
                <Button size="sm" onClick={addTicketType}>
                  Add Ticket Type
                </Button>
              </Box>

              {/* Status */}
              <FormControl isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  {...register('status', { required: 'Status is required' })}
                  placeholder="Select status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
                <FormErrorMessage>
                  {errors.status && errors.status.message}
                </FormErrorMessage>
              </FormControl>

              {/* Submit Button */}
              <Button
                colorScheme="gold"
                isLoading={isSubmitting}
                type="submit"
                leftIcon={<FaSave />}
                w="full"
              >
                {event ? 'Update Event' : 'Create Event'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
