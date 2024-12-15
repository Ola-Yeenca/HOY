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
  Box,
  useToast,
  FormErrorMessage,
  IconButton,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { feedbackAdminApi } from '@/services/adminApi';
import { FaSave, FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Question {
  type: 'text' | 'choice' | 'rating' | 'boolean';
  text: string;
  required: boolean;
  options?: string[];
}

interface SurveyFormData {
  title: string;
  description: string;
  type: 'event' | 'general' | 'feedback';
  startDate: string;
  endDate: string;
  questions: Question[];
  status: 'draft' | 'active' | 'completed';
}

interface SurveyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey?: any;
  onSuccess: () => void;
}

export default function SurveyFormModal({
  isOpen,
  onClose,
  survey,
  onSuccess,
}: SurveyFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<SurveyFormData>({
    defaultValues: survey || {
      questions: [
        {
          type: 'text',
          text: '',
          required: true,
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  });

  useEffect(() => {
    if (survey) {
      reset(survey);
    }
  }, [survey, reset]);

  const onSubmit = async (data: SurveyFormData) => {
    try {
      setIsSubmitting(true);
      if (survey?.id) {
        await feedbackAdminApi.updateSurvey(survey.id, data);
        toast({
          title: 'Survey updated',
          description: 'The survey has been successfully updated',
          status: 'success',
        });
      } else {
        await feedbackAdminApi.createSurvey(data);
        toast({
          title: 'Survey created',
          description: 'The survey has been successfully created',
          status: 'success',
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save survey',
        status: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    append({
      type: 'text',
      text: '',
      required: true,
      options: [],
    });
  };

  const addOption = (questionIndex: number) => {
    const questions = watch('questions');
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = [
      ...(updatedQuestions[questionIndex].options || []),
      '',
    ];
    reset({ ...watch(), questions: updatedQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const questions = watch('questions');
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options?.splice(optionIndex, 1);
    reset({ ...watch(), questions: updatedQuestions });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="coffee-bean">
        <ModalHeader color="gold">
          {survey ? 'Edit Survey' : 'Create New Survey'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              {/* Basic Information */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Title</FormLabel>
                <Input
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Survey title"
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
                  placeholder="Survey description"
                />
                <FormErrorMessage>
                  {errors.description && errors.description.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.type}>
                <FormLabel>Type</FormLabel>
                <Select
                  {...register('type', { required: 'Type is required' })}
                  placeholder="Select survey type"
                >
                  <option value="event">Event</option>
                  <option value="general">General</option>
                  <option value="feedback">Feedback</option>
                </Select>
                <FormErrorMessage>
                  {errors.type && errors.type.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.startDate}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                />
                <FormErrorMessage>
                  {errors.startDate && errors.startDate.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.endDate}>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                />
                <FormErrorMessage>
                  {errors.endDate && errors.endDate.message}
                </FormErrorMessage>
              </FormControl>

              {/* Questions */}
              <Box w="full">
                <Flex justify="space-between" align="center" mb={4}>
                  <FormLabel mb={0}>Questions</FormLabel>
                  <Button
                    size="sm"
                    leftIcon={<FaPlus />}
                    onClick={addQuestion}
                  >
                    Add Question
                  </Button>
                </Flex>

                <VStack spacing={4}>
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      w="full"
                      p={4}
                      borderWidth={1}
                      borderColor="gold.200"
                      borderRadius="md"
                    >
                      <Flex justify="space-between" mb={2}>
                        <Text>Question {index + 1}</Text>
                        <Flex gap={2}>
                          <IconButton
                            aria-label="Move up"
                            icon={<FaArrowUp />}
                            size="sm"
                            isDisabled={index === 0}
                            onClick={() => move(index, index - 1)}
                          />
                          <IconButton
                            aria-label="Move down"
                            icon={<FaArrowDown />}
                            size="sm"
                            isDisabled={index === fields.length - 1}
                            onClick={() => move(index, index + 1)}
                          />
                          <IconButton
                            aria-label="Remove question"
                            icon={<FaTrash />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => remove(index)}
                          />
                        </Flex>
                      </Flex>

                      <FormControl mb={2}>
                        <Input
                          {...register(`questions.${index}.text` as const, {
                            required: 'Question text is required',
                          })}
                          placeholder="Question text"
                        />
                      </FormControl>

                      <Flex gap={4} mb={2}>
                        <FormControl>
                          <Select
                            {...register(`questions.${index}.type` as const)}
                          >
                            <option value="text">Text</option>
                            <option value="choice">Multiple Choice</option>
                            <option value="rating">Rating</option>
                            <option value="boolean">Yes/No</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <Select
                            {...register(`questions.${index}.required` as const)}
                          >
                            <option value="true">Required</option>
                            <option value="false">Optional</option>
                          </Select>
                        </FormControl>
                      </Flex>

                      {watch(`questions.${index}.type`) === 'choice' && (
                        <Box>
                          <Flex justify="space-between" align="center" mb={2}>
                            <Text fontSize="sm">Options</Text>
                            <Button
                              size="xs"
                              onClick={() => addOption(index)}
                            >
                              Add Option
                            </Button>
                          </Flex>
                          <VStack spacing={2}>
                            {field.options?.map((_, optionIndex) => (
                              <Flex key={optionIndex} gap={2}>
                                <Input
                                  {...register(
                                    `questions.${index}.options.${optionIndex}` as const
                                  )}
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <IconButton
                                  aria-label="Remove option"
                                  icon={<FaTrash />}
                                  size="sm"
                                  onClick={() =>
                                    removeOption(index, optionIndex)
                                  }
                                />
                              </Flex>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              </Box>

              <FormControl isInvalid={!!errors.status}>
                <FormLabel>Status</FormLabel>
                <Select
                  {...register('status', { required: 'Status is required' })}
                  placeholder="Select status"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </Select>
                <FormErrorMessage>
                  {errors.status && errors.status.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                colorScheme="gold"
                isLoading={isSubmitting}
                type="submit"
                leftIcon={<FaSave />}
                w="full"
              >
                {survey ? 'Update Survey' : 'Create Survey'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
