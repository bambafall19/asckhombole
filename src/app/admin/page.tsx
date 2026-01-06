'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Le titre doit contenir au moins 10 caractères.',
  }),
  content: z.string().min(20, {
    message: 'Le contenu doit contenir au moins 20 caractères.',
  }),
  category: z.string().min(3, {
    message: 'La catégorie doit contenir au moins 3 caractères.',
  }),
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
  imageHint: z.string().optional(),
});

export default function AdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = getFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Club',
      imageUrl: 'https://picsum.photos/seed/news/800/450',
      imageHint: 'soccer match',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Firestore n\'est pas initialisé.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'articles'), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Article publié !',
        description: 'Votre nouvel article a été ajouté avec succès.',
      });
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article: ", error);
      toast({
        variant: 'destructive',
        title: 'Oh non ! Une erreur est survenue.',
        description: "Impossible d'enregistrer l'article. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Panneau d'Administration</CardTitle>
            <FormDescription>
              Ajouter un nouvel article d'actualité.
            </FormDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'article</FormLabel>
                      <FormControl>
                        <Input placeholder="L'ASC Khombole gagne le championnat..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Écrivez le contenu de votre article ici..."
                          rows={10}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Match, Club, Interview" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemple.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        Le lien vers l'image principale de l'article.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="imageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indice pour l'image (Optionnel)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: soccer celebration" {...field} />
                      </FormControl>
                      <FormDescription>
                        Un ou deux mots en anglais pour décrire l'image (utile pour l'IA).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Publication...' : 'Publier l\'article'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
