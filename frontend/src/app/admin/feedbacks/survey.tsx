'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Heading,
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { feedbackAdminApi } from '@/services/adminApi';

export default function SurveyForm({ surveyId = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: '',
    is_active: true,
  });
  const toast = useToast();

  useEffect(() => {
    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  const loadSurvey = async () => {
    try {
      const data = await feedbackAdminApi.getSurvey(surveyId);
      setFormData({
        title: data.title,
        description: data.description,
        questions: JSON.stringify(data.questions, null, 2),
        is_active: data.is_active,
      });
    } catch (error) {
      toast({
        title: 'Error loading survey',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const surveyData = {
        ...formData,
        questions: JSON.parse(formData.questions),
      };

      if (surveyId) {
        await feedbackAdminApi.updateSurvey(surveyId, surveyData);
      } else {
        await feedbackAdminApi.createSurvey(surveyData);
      }

      toast({
        title: `Survey ${surveyId ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: `Error ${surveyId ? 'updating' : 'creating'} survey`,
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <Box p={4}>
      <Heading mb={6}>{surveyId ? 'Edit Survey' : 'Create Survey'}</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Survey Title"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Survey Description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Questions (JSON format)</FormLabel>
            <Textarea
              name="questions"
              value={formData.questions}
              onChange={handleChange}
              placeholder='[{"type": "text", "question": "Your question here"}]'
              minHeight="200px"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Active</FormLabel>
            <Switch
              name="is_active"
              isChecked={formData.is_active}
              onChange={handleChange}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            {surveyId ? 'Update Survey' : 'Create Survey'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
