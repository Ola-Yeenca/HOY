'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/services/adminApi';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await adminAuthApi.login({ email, password });
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      });
      router.push('/admin/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.detail || 'Invalid credentials',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={10}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <VStack spacing={8} as="form" onSubmit={handleSubmit}>
          <VStack spacing={2} w="100%" align="center">
            <Heading size="lg">HOY Admin</Heading>
            <Text color="gray.600">Sign in to access the dashboard</Text>
          </VStack>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            width="full"
            isLoading={isLoading}
            loadingText="Signing in..."
          >
            Sign in
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
