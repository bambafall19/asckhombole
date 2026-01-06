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
  query,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect, useMemo } from 'react';
import { LoaderCircle, LogOut, PlusCircle, Trash2, Pencil, Newspaper, List } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth, useCollection, useFirestore as useFirestoreHook } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Article } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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

function AddArticleForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Club',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/450`,
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
      form.reset({
        ...form.getValues(),
        imageUrl: `https://picsum.photos/seed/${Math.random()}/800/450`,
      });
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
  )
}

function ArticlesList() {
    const firestore = useFirestoreHook();
    const { toast } = useToast();
    const articlesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: articles, loading } = useCollection<Article>(articlesQuery);

    const handleDelete = async (articleId: string) => {
        if (!firestore) return;
        try {
            await deleteDoc(doc(firestore, 'articles', articleId));
            toast({
                title: 'Article supprimé',
                description: 'L\'article a été supprimé avec succès.',
            });
        } catch (error) {
            console.error('Error deleting article: ', error);
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Impossible de supprimer l\'article.',
            });
        }
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>Liste des articles</CardTitle>
                <CardDescription>Consultez, modifiez ou supprimez les articles existants.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                            <TableHead className="hidden lg:table-cell">Date de création</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">
                                    <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" />
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && articles?.map((article) => (
                            <TableRow key={article.id}>
                                <TableCell className="font-medium">{article.title}</TableCell>
                                <TableCell className="hidden md:table-cell">{article.category}</TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    {article.createdAt ? format(article.createdAt.toDate(), 'PPP', { locale: fr }) : ''}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Cette action est irréversible. Elle supprimera définitivement l'article.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}


export default function AdminPage() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);


  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Panneau d'Administration</h1>
          <p className="text-muted-foreground">Gérez le contenu de votre site ici.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="actus">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-9 mb-4">
          <TabsTrigger value="actus">Actualités</TabsTrigger>
          <TabsTrigger value="equipe" disabled>Équipe</TabsTrigger>
          <TabsTrigger value="matchs" disabled>Matchs</TabsTrigger>
          <TabsTrigger value="galerie" disabled>Galerie</TabsTrigger>
          <TabsTrigger value="partenaires" disabled>Partenaires</TabsTrigger>
          <TabsTrigger value="boutique" disabled>Boutique</TabsTrigger>
          <TabsTrigger value="webtv" disabled>Web TV</TabsTrigger>
        </TabsList>

        <TabsContent value="actus">
            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list"><List className="w-4 h-4 mr-2" />Voir les articles</TabsTrigger>
                    <TabsTrigger value="add"><PlusCircle className="w-4 h-4 mr-2" />Ajouter un article</TabsTrigger>
                </TabsList>
                <TabsContent value="list" className="pt-6">
                    <ArticlesList />
                </TabsContent>
                <TabsContent value="add" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ajouter un nouvel article</CardTitle>
                            <CardDescription>Remplissez le formulaire ci-dessous pour publier une nouvelle actualité.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddArticleForm />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </TabsContent>
        {/* Placeholder for other tabs */}
        <TabsContent value="equipe">Bientôt disponible.</TabsContent>
        <TabsContent value="matchs">Bientôt disponible.</TabsContent>
        <TabsContent value="galerie">Bientôt disponible.</TabsContent>
        <TabsContent value="partenaires">Bientôt disponible.</TabsContent>
        <TabsContent value="boutique">Bientôt disponible.</TabsContent>
        <TabsContent value="webtv">Bientôt disponible.</TabsContent>
      </Tabs>
    </main>
  );
}
