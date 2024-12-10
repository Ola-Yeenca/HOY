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
  HStack,
} from '@chakra-ui/react';
import { feedbackAdminApi } from '@/services/adminApi';

interface SurveyProps {
  surveyId?: string;
}

interface FormData {
  title: string;
  description: string;
  questions: string[];
  isActive: boolean;
}

export default function SurveyForm({ surveyId }: SurveyProps) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    questions: [''],
    isActive: true,
  });
  const toast = useToast();

  useEffect(() => {
    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  const loadSurvey = async () => {
    try {
      if (!surveyId) return;
      const data = await feedbackAdminApi.getSurvey(surveyId);
      setFormData({
        title: data.title,
        description: data.description,
        questions: Array.isArray(data.questions) ? data.questions : [data.questions],
        isActive: data.is_active,
      });
    } catch (error) {
      toast({
        title: 'Error loading survey',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        questions: formData.questions.filter(q => q.trim() !== ''),
      };
      
      if (surveyId) {
        await feedbackAdminApi.updateSurvey(surveyId, payload);
        toast({
          title: 'Survey updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        await feedbackAdminApi.createSurvey(payload);
        toast({
          title: 'Survey created successfully',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error saving survey',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setFormData(prev => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = value;
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, ''],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Survey title"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Survey description"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Questions</FormLabel>
            <VStack spacing={4} align="stretch">
              {formData.questions.map((question, index) => (
                <HStack key={index}>
                  <Input
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    placeholder={`Question ${index + 1}`}
                  />
                  {formData.questions.length > 1 && (
                    <Button
                      colorScheme="red"
                      onClick={() => removeQuestion(index)}
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </HStack>
              ))}
              <Button onClick={addQuestion} size="sm">
                Add Question
              </Button>
            </VStack>
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Active</FormLabel>
            <Switch
              name="isActive"
              isChecked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
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
