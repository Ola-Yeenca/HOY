import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPreferences } from '@/services/recommendationService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  genres: z.array(z.string()).min(1, 'Select at least one genre'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  favorite_artists: z.array(z.string()),
  activity_score: z.number().min(0).max(1),
  diversity_score: z.number().min(0).max(1),
});

interface UserPreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  initialValues?: Partial<UserPreferences>;
  className?: string;
}

const AVAILABLE_GENRES = [
  'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical',
  'Electronic', 'R&B', 'Country', 'Blues', 'Metal'
];

export function UserPreferencesForm({
  onSubmit,
  initialValues,
  className
}: UserPreferencesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      genres: initialValues?.genres || [],
      location: initialValues?.location || '',
      favorite_artists: initialValues?.favorite_artists || [],
      activity_score: initialValues?.activity_score || 0.5,
      diversity_score: initialValues?.diversity_score || 0.5,
    },
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Genres</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    value={field.value[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genres" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AVAILABLE_GENRES.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can select multiple genres
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your location" {...field} />
                  </FormControl>
                  <FormDescription>
                    This helps us find events near you
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activity_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Level</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    How active are you in attending events?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diversity_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Music Diversity</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    How diverse is your music taste?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
