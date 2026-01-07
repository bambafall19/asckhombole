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
  Timestamp,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState, useEffect, useMemo } from 'react';
import { LoaderCircle, LogOut, PlusCircle, Trash2, Pencil, List, Users, Trophy, Image as ImageIcon, Handshake, Mail, Shield, Map, Link as LinkIcon } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth, useCollection, useDocument, useFirestore as useFirestoreHook } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Article, Player, Match, Photo, Partner, ClubInfo } from '@/lib/types';
import { format, setHours, setMinutes } from 'date-fns';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';


const tagsItems = [
    { id: 'featured', label: 'À la une (principal)' },
    { id: 'trendy', label: 'Tendance' },
    { id: 'top', label: 'Top nouvelle (sidebar)' },
] as const;

const articleFormSchema = z.object({
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
  tags: z.array(z.string()).optional(),
});

function AddArticleForm({ article, onFinish }: { article?: Article, onFinish?: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();
  const isEditing = !!article;

  const form = useForm<z.infer<typeof articleFormSchema>>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: isEditing ? {
      title: article.title,
      content: article.content,
      category: article.category,
      imageUrl: article.imageUrl,
      tags: article.tags || [],
    } : {
      title: 'ASC Khombole en lice pour le Championnat Régional de Thiès',
      content: `## ASC Khombole en lice pour le Championnat Régional de Thiès

La saison 2025/2026 marque un nouveau défi pour l’ASC Khombole, engagée dans le Championnat Régional de Thiès, au sein de la Poule D. Cette poule regroupe des équipes compétitives, prêtes à en décrasser pour décrocher la montée et marquer l’histoire du football régional.

### Composition de la Poule D
- Académie Tim
- ASC Khombole
- Kael de Ngaparou
- Ndersakh de Guereo
- Ocean
- Taiba FC

Chaque équipe part avec 0 point, et la bataille s’annonce intense dès les premières journées. L’ASC Khombole, forte de son histoire et de ses ambitions, vise à dominer cette poule et se rapprocher de l’élite.

## Objectif : La montée

Après des saisons de travail et de reconstruction, l’ASC Khombole affiche une ambition claire : retrouver les sommets et offrir à la commune une place de choix dans le football sénégalais. Avec un effectif jeune et motivé, un staff expérimenté et le soutien indéfectible des supporters, le club veut faire de cette saison un tournant historique.

> "Cette saison est celle de la détermination. Nous voulons montrer que Khombole a sa place parmi les meilleurs. Ensemble, avec nos supporters et partenaires, nous allons écrire une nouvelle page de notre histoire."
> Adama DIOP DIA – Président ASC Khombole`,
      category: 'Club',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/450`,
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof articleFormSchema>) {
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
        if (isEditing) {
            const articleRef = doc(firestore, 'articles', article.id);
            updateDoc(articleRef, {
              ...values,
              createdAt: serverTimestamp(),
            }).catch(async (error) => {
              console.error("Erreur lors de la modification de l'article: ", error);
              const permissionError = new FirestorePermissionError({
                  path: `articles/${article.id}`,
                  operation: 'update',
                  requestResourceData: values,
              });
              errorEmitter.emit('permission-error', permissionError);
              toast({
                  variant: 'destructive',
                  title: 'Oh non ! Une erreur est survenue.',
                  description: "Impossible de modifier l'article. Veuillez réessayer.",
              });
            }).then(() => {
                toast({
                    title: 'Article modifié !',
                    description: 'L\'article a été mis à jour avec succès.',
                });
            });
        } else {
            const articlesCollection = collection(firestore, 'articles');
            addDoc(articlesCollection, {
                ...values,
                createdAt: serverTimestamp(),
            }).catch(async (error) => {
                console.error("Erreur lors de la sauvegarde de l'article: ", error);
                const permissionError = new FirestorePermissionError({
                    path: 'articles',
                    operation: 'create',
                    requestResourceData: values,
                });
                errorEmitter.emit('permission-error', permissionError);
                toast({
                    variant: 'destructive',
                    title: 'Oh non ! Une erreur est survenue.',
                    description: "Impossible de sauvegarder l'article. Veuillez réessayer.",
                });
            }).then(() => {
                toast({
                    title: 'Article publié !',
                    description: 'Votre nouvel article a été ajouté avec succès.',
                });
                form.reset({
                    ...form.getValues(),
                    title: '',
                    content: '',
                    imageUrl: `https://picsum.photos/seed/${Math.random()}/800/450`,
                    tags: [],
                });
            });
        }
        onFinish?.();
    } catch (error) {
        console.error("Général error: ", error);
        toast({
            variant: 'destructive',
            title: 'Oh non ! Une erreur inattendue est survenue.',
            description: "Veuillez réessayer.",
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
              name="tags"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Mise en page</FormLabel>
                    <FormDescription>
                      Sélectionnez où cet article doit apparaître sur la page d'accueil.
                    </FormDescription>
                  </div>
                  {tagsItems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="tags"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? (isEditing ? 'Modification...' : 'Publication...') : (isEditing ? 'Modifier l\'article' : 'Publier l\'article')}
            </Button>
          </form>
        </Form>
  )
}

function ArticlesList() {
    const firestore = useFirestoreHook();
    const { toast } = useToast();
    const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

    const articlesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'articles'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: articles, loading } = useCollection<Article>(articlesQuery);
    
    const editingArticle = useMemo(() => {
        return articles?.find(a => a.id === editingArticleId) || null;
    }, [articles, editingArticleId]);


    const handleDelete = async (articleId: string) => {
        if (!firestore) return;
        const articleRef = doc(firestore, 'articles', articleId);
        deleteDoc(articleRef).then(() => {
             toast({
                title: 'Article supprimé',
                description: 'L\'article a été supprimé avec succès.',
            });
        }).catch(async (error) => {
            console.error('Error deleting article: ', error);
            const permissionError = new FirestorePermissionError({
                path: articleRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: 'Impossible de supprimer l\'article.',
            });
        });
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
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="icon" onClick={() => setEditingArticleId(article.id)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </DialogTrigger>

                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Êtes-vous absolutely sûr ?</AlertDialogTitle>
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
            
            <Dialog open={!!editingArticleId} onOpenChange={(open) => !open && setEditingArticleId(null)}>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Modifier l'article</DialogTitle>
                  <DialogDescription>
                    Apportez des modifications à votre article ici. Cliquez sur Enregistrer lorsque vous avez terminé.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {editingArticle && (
                    <AddArticleForm 
                        article={editingArticle} 
                        onFinish={() => setEditingArticleId(null)} 
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>
        </Card>
    )
}

const playerFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  position: z.string().min(2, { message: 'Le poste doit contenir au moins 2 caractères.' }),
  number: z.coerce.number().int().positive({ message: 'Le numéro doit être un nombre positif.' }),
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
});

function AddPlayerForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      name: '',
      position: 'Attaquant',
      number: 10,
      imageUrl: `https://picsum.photos/seed/${Math.random()}/400/400`,
    },
  });

  async function onSubmit(values: z.infer<typeof playerFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    const playersCollection = collection(firestore, 'players');
    addDoc(playersCollection, { ...values }).then(() => {
        toast({ title: 'Joueur ajouté !', description: `${values.name} a été ajouté à l'effectif.` });
        form.reset({
            ...form.getValues(),
            name: '',
            imageUrl: `https://picsum.photos/seed/${Math.random()}/400/400`,
        });
    }).catch(async (error) => {
        console.error("Erreur lors de l'ajout du joueur: ", error);
        const permissionError = new FirestorePermissionError({
            path: playersCollection.path,
            operation: 'create',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer le joueur." });
    }).finally(() => {
        setIsSubmitting(false);
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Ajouter un joueur</CardTitle>
            <CardDescription>Remplissez le formulaire pour ajouter un joueur à l'effectif.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nom du joueur</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="position" render={({ field }) => (
                <FormItem><FormLabel>Poste</FormLabel><FormControl><Input placeholder="Défenseur, Milieu, etc." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="number" render={({ field }) => (
                <FormItem><FormLabel>Numéro</FormLabel><FormControl><Input type="number" placeholder="10" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>URL de la photo</FormLabel>
                    <FormControl><Input placeholder="https://exemple.com/photo.jpg" {...field} /></FormControl>
                    <FormDescription>Utilisez une image au format portrait (carré ou vertical).</FormDescription>
                    <FormMessage />
                </FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Ajout...' : 'Ajouter le joueur'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}

function PlayersList() {
    const firestore = useFirestoreHook();
    const { toast } = useToast();
    const playersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'players'), orderBy('name', 'asc'));
    }, [firestore]);

    const { data: players, loading } = useCollection<Player>(playersQuery);

    const handleDelete = async (playerId: string) => {
        if (!firestore) return;
        const playerRef = doc(firestore, 'players', playerId);
        deleteDoc(playerRef).then(() => {
            toast({ title: 'Joueur supprimé', description: 'Le joueur a été retiré de l\'effectif.' });
        }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({
                path: playerRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le joueur.' });
        });
    };

    return (
         <Card>
            <CardHeader><CardTitle>Effectif actuel</CardTitle><CardDescription>Gérez les joueurs de votre équipe.</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead className="hidden md:table-cell">Poste</TableHead>
                            <TableHead className="hidden lg:table-cell">Numéro</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow><TableCell colSpan={4} className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                        )}
                        {!loading && players?.map((player) => (
                            <TableRow key={player.id}>
                                <TableCell className="font-medium">{player.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{player.position}</TableCell>
                                <TableCell className="hidden lg:table-cell">{player.number}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                          <AlertDialogDescription>Cette action est irréversible. Le joueur sera supprimé.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(player.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
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

const matchFormSchema = z.object({
  date: z.date({ required_error: 'La date du match est obligatoire.' }),
  time: z.object({
    hours: z.coerce.number().min(0).max(23),
    minutes: z.coerce.number().min(0).max(59),
  }),
  competition: z.string().min(3, { message: 'La compétition doit contenir au moins 3 caractères.' }),
  homeTeam: z.string().min(3, { message: 'Le nom de l\'équipe à domicile est obligatoire.' }),
  awayTeam: z.string().min(3, { message: 'Le nom de l\'équipe à l\'extérieur est obligatoire.' }),
  homeTeamLogoUrl: z.string().url({ message: "Veuillez entrer une URL de logo valide." }).optional().or(z.literal('')),
  awayTeamLogoUrl: z.string().url({ message: "Veuillez entrer une URL de logo valide." }).optional().or(z.literal('')),
  location: z.string().optional(),
  homeScore: z.coerce.number().int().optional(),
  awayScore: z.coerce.number().int().optional(),
  status: z.enum(['À venir', 'Terminé', 'Reporté']),
});

function AddMatchForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof matchFormSchema>>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      competition: 'Ligue 1',
      homeTeam: 'ASC Khombole',
      awayTeam: '',
      status: 'À venir',
      time: { hours: 16, minutes: 0 },
      location: '',
      homeTeamLogoUrl: '',
      awayTeamLogoUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof matchFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    
    const combinedDate = setMinutes(setHours(values.date, values.time.hours), values.time.minutes);

    const matchData = {
      ...values,
      date: Timestamp.fromDate(combinedDate),
      homeScore: values.status === 'Terminé' ? values.homeScore ?? null : null,
      awayScore: values.status === 'Terminé' ? values.awayScore ?? null : null,
    };
    delete (matchData as any).time;
    
    const matchesCollection = collection(firestore, 'matches');

    addDoc(matchesCollection, matchData).catch(async (error) => {
        console.error("Erreur lors de l'ajout du match: ", error);
        const permissionError = new FirestorePermissionError({
            path: matchesCollection.path,
            operation: 'create',
            requestResourceData: matchData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer le match." });
    }).then(() => {
        toast({ title: 'Match ajouté !', description: `Le match ${values.homeTeam} vs ${values.awayTeam} a été programmé.` });
        form.reset({
            ...form.getValues(),
            date: undefined,
            awayTeam: '',
            homeScore: undefined,
            awayScore: undefined,
            location: '',
            homeTeamLogoUrl: '',
            awayTeamLogoUrl: '',
        });
    }).finally(() => {
        setIsSubmitting(false);
    });
  }
  
  return (
    <Card>
        <CardHeader>
            <CardTitle>Ajouter un match</CardTitle>
            <CardDescription>Remplissez le formulaire pour programmer une nouvelle rencontre.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="homeTeam" render={({ field }) => (
                    <FormItem><FormLabel>Équipe à domicile</FormLabel><FormControl><Input placeholder="ASC Khombole" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="awayTeam" render={({ field }) => (
                    <FormItem><FormLabel>Équipe à l'extérieur</FormLabel><FormControl><Input placeholder="ASC Jaraaf" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="homeTeamLogoUrl" render={({ field }) => (
                      <FormItem><FormLabel>URL du logo (domicile)</FormLabel><FormControl><Input placeholder="https://exemple.com/logo1.png" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="awayTeamLogoUrl" render={({ field }) => (
                      <FormItem><FormLabel>URL du logo (extérieur)</FormLabel><FormControl><Input placeholder="https://exemple.com/logo2.png" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="homeScore" render={({ field }) => (
                    <FormItem><FormLabel>Score Domicile (si terminé)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="awayScore" render={({ field }) => (
                    <FormItem><FormLabel>Score Extérieur (si terminé)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="competition" render={({ field }) => (
                  <FormItem><FormLabel>Compétition</FormLabel><FormControl><Input placeholder="Ligue 1" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem><FormLabel>Lieu du match</FormLabel><FormControl><Input placeholder="Stade Ibrahima Boye" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date du match</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP", { locale: fr })
                                ) : (
                                    <span>Choisir une date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date("1900-01-01")}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className='space-y-2'>
                        <FormLabel>Heure du match</FormLabel>
                        <div className="flex items-center gap-2">
                           <FormField control={form.control} name="time.hours" render={({ field }) => (
                                <FormItem><FormControl><Input type="number" min="0" max="23" placeholder="HH" {...field} /></FormControl></FormItem>
                            )} />
                            <span>:</span>
                             <FormField control={form.control} name="time.minutes" render={({ field }) => (
                                <FormItem><FormControl><Input type="number" min="0" max="59" placeholder="MM" {...field} /></FormControl></FormItem>
                            )} />
                        </div>
                         <FormMessage>{form.formState.errors.time?.hours?.message || form.formState.errors.time?.minutes?.message}</FormMessage>
                    </div>

                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Statut du match" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="À venir">À venir</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="Reporté">Reporté</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage /></FormItem>
                )} />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Ajout...' : 'Ajouter le match'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}

function MatchesList() {
    const firestore = useFirestoreHook();
    const { toast } = useToast();
    const matchesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'matches'), orderBy('date', 'desc'));
    }, [firestore]);

    const { data: matches, loading } = useCollection<Match>(matchesQuery);

    const handleDelete = async (matchId: string) => {
        if (!firestore) return;
        const matchRef = doc(firestore, 'matches', matchId);
        deleteDoc(matchRef).then(() => {
            toast({ title: 'Match supprimé', description: 'Le match a été supprimé avec succès.' });
        }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({
                path: matchRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le match.' });
        });
    };

    return (
         <Card>
            <CardHeader><CardTitle>Liste des matchs</CardTitle><CardDescription>Gérez les matchs de votre équipe.</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Compétition</TableHead>
                            <TableHead>Rencontre</TableHead>
                            <TableHead>Score</TableHead>
                             <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow><TableCell colSpan={6} className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                        )}
                        {!loading && matches?.map((match) => (
                            <TableRow key={match.id}>
                                <TableCell>{match.date ? format(match.date.toDate(), "PPP 'à' HH:mm", { locale: fr }) : ''}</TableCell>
                                <TableCell>{match.competition}</TableCell>
                                <TableCell className="font-medium">{match.homeTeam} vs {match.awayTeam}</TableCell>
                                <TableCell>{match.status === 'Terminé' ? `${match.homeScore} - ${match.awayScore}` : '-'}</TableCell>
                                <TableCell>{match.status}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Êtes-vous absolutely sûr ?</AlertDialogTitle>
                                          <AlertDialogDescription>Cette action est irréversible. Le match sera supprimé.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(match.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
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

const photoFormSchema = z.object({
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
});

function AddPhotoForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof photoFormSchema>>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
    },
  });

  async function onSubmit(values: z.infer<typeof photoFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const title = `Photo du ${format(new Date(), 'PPP à HH:mm', { locale: fr })}`;
    
    const photosCollection = collection(firestore, 'photos');
    addDoc(photosCollection, {
        ...values,
        title: title,
        createdAt: serverTimestamp(),
    }).then(() => {
        toast({ title: 'Photo ajoutée !', description: 'La nouvelle photo a été ajoutée à la galerie.' });
        form.reset({
            imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        });
    }).catch(async (error) => {
        console.error("Erreur lors de l'ajout de la photo: ", error);
        const permissionError = new FirestorePermissionError({
            path: photosCollection.path,
            operation: 'create',
            requestResourceData: { ...values, title },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer la photo." });
    }).finally(() => {
        setIsSubmitting(false);
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Ajouter une photo</CardTitle>
            <CardDescription>Remplissez le formulaire pour ajouter une photo à la galerie.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>URL de la photo</FormLabel>
                    <FormControl><Input placeholder="https://exemple.com/photo.jpg" {...field} /></FormControl>
                    <FormDescription>Lien vers l'image à ajouter.</FormDescription>
                    <FormMessage />
                </FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Ajout...' : 'Ajouter la photo'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}

function PhotosList() {
    const firestore = useFirestoreHook();
    const { toast } = useToast();
    const photosQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'photos'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: photos, loading } = useCollection<Photo>(photosQuery);

    const handleDelete = async (photoId: string) => {
        if (!firestore) return;
        const photoRef = doc(firestore, 'photos', photoId);
        deleteDoc(photoRef).then(() => {
            toast({ title: 'Photo supprimée', description: 'La photo a été retirée de la galerie.' });
        }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({
                path: photoRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la photo.' });
        });
    };

    return (
         <Card>
            <CardHeader><CardTitle>Photos de la galerie</CardTitle><CardDescription>Gérez les photos de votre galerie.</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Aperçu</TableHead>
                            <TableHead>Titre</TableHead>
                            <TableHead className="hidden md:table-cell">Date d'ajout</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow><TableCell colSpan={4} className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                        )}
                        {!loading && photos?.map((photo) => (
                            <TableRow key={photo.id}>
                                <TableCell>
                                    <img src={photo.imageUrl} alt={photo.title} className="h-10 w-16 object-cover rounded-md" />
                                </TableCell>
                                <TableCell className="font-medium">{photo.title}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {photo.createdAt ? format(photo.createdAt.toDate(), 'PPP', { locale: fr }) : ''}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                          <AlertDialogDescription>Cette action est irréversible. La photo sera supprimée.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(photo.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
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

const partnerFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  logoUrl: z.string().url({ message: "Veuillez entrer une URL de logo valide." }),
  website: z.string().url({ message: "Veuillez entrer une URL de site web valide." }).optional().or(z.literal('')),
});

function AddPartnerForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      name: '',
      logoUrl: `https://picsum.photos/seed/${Math.random()}/200/100`,
      website: '',
    },
  });

  async function onSubmit(values: z.infer<typeof partnerFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const partnersCollection = collection(firestore, 'partners');
    addDoc(partnersCollection, { ...values }).then(() => {
        toast({ title: 'Partenaire ajouté !', description: `Le partenaire ${values.name} a été ajouté.` });
        form.reset();
    }).catch(async (error) => {
        console.error("Erreur lors de l'ajout du partenaire: ", error);
        const permissionError = new FirestorePermissionError({
            path: partnersCollection.path,
            operation: 'create',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer le partenaire." });
    }).finally(() => {
        setIsSubmitting(false);
    });
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Ajouter un partenaire</CardTitle>
            <CardDescription>Remplissez le formulaire pour ajouter un sponsor ou partenaire.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Nom du Partenaire</FormLabel><FormControl><Input placeholder="Nom de l'entreprise" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="logoUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>URL du Logo</FormLabel>
                    <FormControl><Input placeholder="https://exemple.com/logo.png" {...field} /></FormControl>
                    <FormDescription>Utilisez une image au format paysage (ratio 2:1 conseillé).</FormDescription>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="website" render={({ field }) => (
                <FormItem>
                    <FormLabel>Site Web (Optionnel)</FormLabel>
                    <FormControl><Input placeholder="https://exemple.com" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Ajout...' : 'Ajouter le partenaire'}
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}

function PartnersList() {
    const firestore = useFirestoreHook();
    const { toast } = useToast();
    const partnersQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'partners'), orderBy('name', 'asc'));
    }, [firestore]);

    const { data: partners, loading } = useCollection<Partner>(partnersQuery);

    const handleDelete = async (partnerId: string) => {
        if (!firestore) return;
        const partnerRef = doc(firestore, 'partners', partnerId);
        deleteDoc(partnerRef).then(() => {
            toast({ title: 'Partenaire supprimé', description: 'Le partenaire a été supprimé.' });
        }).catch(async (error) => {
            const permissionError = new FirestorePermissionError({
                path: partnerRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le partenaire.' });
        });
    };

    return (
         <Card>
            <CardHeader><CardTitle>Liste des partenaires</CardTitle><CardDescription>Gérez les partenaires et sponsors de votre club.</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead className="hidden md:table-cell">Site Web</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow><TableCell colSpan={4} className="text-center"><LoaderCircle className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
                        )}
                        {!loading && partners?.map((partner) => (
                            <TableRow key={partner.id}>
                                <TableCell>
                                    <img src={partner.logoUrl} alt={`Logo de ${partner.name}`} className="h-10 max-w-[100px] object-contain" />
                                </TableCell>
                                <TableCell className="font-medium">{partner.name}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{partner.website}</a>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" disabled><Pencil className="h-4 w-4" /></Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Êtes-vous absolutely sûr ?</AlertDialogTitle>
                                          <AlertDialogDescription>Cette action est irréversible. Le partenaire sera supprimé.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction onClick={() => handleDelete(partner.id)} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
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

const clubInfoFormSchema = z.object({
  logoUrl: z.string().url({ message: "Veuillez entrer une URL de logo valide." }).optional().or(z.literal('')),
  history: z.string().min(10, { message: "L'histoire doit contenir au moins 10 caractères." }),
  historyImageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  presidentWord: z.string().min(10, { message: 'Le mot du président doit contenir au moins 10 caractères.' }),
  presidentWordImageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  presidentWishes: z.string().min(10, { message: 'Les vœux doivent contenir au moins 10 caractères.' }),
  welcomeTitle: z.string().optional(),
  welcomeSubtitle: z.string().optional(),
  welcomeImageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  welcomeImageUrl2: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  welcomeImageUrl3: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  contactEmail: z.string().email({ message: "Veuillez entrer un email valide." }).optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().url({ message: "Veuillez entrer une URL Google Maps valide." }).optional().or(z.literal('')),
  facebookUrl: z.string().url({ message: "Veuillez entrer une URL Facebook valide." }).optional().or(z.literal('')),
  twitterUrl: z.string().url({ message: "Veuillez entrer une URL Twitter valide." }).optional().or(z.literal('')),
  instagramUrl: z.string().url({ message: "Veuillez entrer une URL Instagram valide." }).optional().or(z.literal('')),
  youtubeUrl: z.string().url({ message: "Veuillez entrer une URL YouTube valide." }).optional().or(z.literal('')),
});

function ClubInfoForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();
  
  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);
  
  const { data: clubInfo, loading } = useDocument<ClubInfo>(clubInfoRef);

  const form = useForm<z.infer<typeof clubInfoFormSchema>>({
    resolver: zodResolver(clubInfoFormSchema),
    values: {
        logoUrl: clubInfo?.logoUrl || '',
        history: clubInfo?.history || '',
        historyImageUrl: clubInfo?.historyImageUrl || '',
        presidentWord: clubInfo?.presidentWord || '',
        presidentWordImageUrl: clubInfo?.presidentWordImageUrl || '',
        presidentWishes: clubInfo?.presidentWishes || '',
        welcomeTitle: clubInfo?.welcomeTitle || '',
        welcomeSubtitle: clubInfo?.welcomeSubtitle || '',
        welcomeImageUrl: clubInfo?.welcomeImageUrl || '',
        welcomeImageUrl2: clubInfo?.welcomeImageUrl2 || '',
        welcomeImageUrl3: clubInfo?.welcomeImageUrl3 || '',
        contactEmail: clubInfo?.contactEmail || '',
        contactPhone: clubInfo?.contactPhone || '',
        address: clubInfo?.address || '',
        googleMapsUrl: clubInfo?.googleMapsUrl || '',
        facebookUrl: clubInfo?.facebookUrl || '',
        twitterUrl: clubInfo?.twitterUrl || '',
        instagramUrl: clubInfo?.instagramUrl || '',
        youtubeUrl: clubInfo?.youtubeUrl || '',
    }
  });

  useEffect(() => {
    if (clubInfo) {
      form.reset({
        logoUrl: clubInfo.logoUrl || '',
        history: clubInfo.history || '',
        historyImageUrl: clubInfo.historyImageUrl || '',
        presidentWord: clubInfo.presidentWord || '',
        presidentWordImageUrl: clubInfo.presidentWordImageUrl || '',
        presidentWishes: clubInfo.presidentWishes || '',
        welcomeTitle: clubInfo.welcomeTitle || '',
        welcomeSubtitle: clubInfo.welcomeSubtitle || '',
        welcomeImageUrl: clubInfo.welcomeImageUrl || '',
        welcomeImageUrl2: clubInfo.welcomeImageUrl2 || '',
        welcomeImageUrl3: clubInfo.welcomeImageUrl3 || '',
        contactEmail: clubInfo?.contactEmail || '',
        contactPhone: clubInfo?.contactPhone || '',
        address: clubInfo?.address || '',
        googleMapsUrl: clubInfo?.googleMapsUrl || '',
        facebookUrl: clubInfo?.facebookUrl || '',
        twitterUrl: clubInfo?.twitterUrl || '',
        instagramUrl: clubInfo?.instagramUrl || '',
        youtubeUrl: clubInfo?.youtubeUrl || '',
      });
    }
  }, [clubInfo, form]);

  async function onSubmit(values: z.infer<typeof clubInfoFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    setDoc(clubInfoRef!, values, { merge: true }).then(() => {
        toast({ title: 'Informations mises à jour !', description: 'Les informations du club ont été enregistrées.' });
    }).catch(async (error) => {
        console.error("Erreur lors de la mise à jour des infos du club: ", error);
        const permissionError = new FirestorePermissionError({
            path: clubInfoRef!.path,
            operation: 'update',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de sauvegarder les informations.' });
    }).finally(() => {
        setIsSubmitting(false);
    });
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8"><LoaderCircle className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations Générales du Club</CardTitle>
        <CardDescription>Gérez le contenu des pages "Club", de l'accueil et les informations de contact.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <Collapsible defaultOpen>
                <CollapsibleTrigger className='text-xl font-headline text-primary'>Identité du Club</CollapsibleTrigger>
                <CollapsibleContent className='space-y-6 pt-4 border-l pl-4 ml-2'>
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL du Logo du Club</FormLabel>
                          <FormControl><Input placeholder="https://exemple.com/logo.png" {...field} /></FormControl>
                           <FormDescription>Ce logo apparaîtra dans l'en-tête et le pied de page du site.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
                <CollapsibleTrigger className='text-xl font-headline text-primary'>Page d'Accueil (Diaporama)</CollapsibleTrigger>
                <CollapsibleContent className='space-y-6 pt-4 border-l pl-4 ml-2'>
                    <FormField
                      control={form.control}
                      name="welcomeTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titre de Bienvenue</FormLabel>
                          <FormControl><Input placeholder="Bienvenue sur le site de l'ASC Khombole" {...field} /></FormControl>
                          <FormDescription>S'affiche sur le diaporama de la page d'accueil.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="welcomeSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sous-titre de Bienvenue</FormLabel>
                          <FormControl><Input placeholder="Toute l'actualité du club, les matchs et plus encore." {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2 p-4 border rounded-md">
                        <h4 className="font-medium">Image 1</h4>
                        <FormField
                          control={form.control}
                          name="welcomeImageUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL de l'image de Bienvenue 1</FormLabel>
                              <FormControl><Input placeholder="https://exemple.com/image1.jpg" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>

                    <div className="space-y-2 p-4 border rounded-md">
                        <h4 className="font-medium">Image 2</h4>
                        <FormField
                          control={form.control}
                          name="welcomeImageUrl2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL de l'image de Bienvenue 2</FormLabel>
                              <FormControl><Input placeholder="https://exemple.com/image2.jpg" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>

                    <div className="space-y-2 p-4 border rounded-md">
                        <h4 className="font-medium">Image 3</h4>
                        <FormField
                          control={form.control}
                          name="welcomeImageUrl3"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL de l'image de Bienvenue 3</FormLabel>
                              <FormControl><Input placeholder="https://exemple.com/image3.jpg" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    </div>
                </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
                <CollapsibleTrigger className='text-xl font-headline text-primary'>Page Club</CollapsibleTrigger>
                <CollapsibleContent className='space-y-4 pt-4 border-l pl-4 ml-2'>
                    <FormField
                      control={form.control}
                      name="history"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Histoire du club</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Racontez l'histoire de l'ASC Khombole..." rows={8} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="historyImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de l'image (Histoire)</FormLabel>
                          <FormControl><Input placeholder="https://exemple.com/image.jpg" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="presidentWord"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot du président</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Le message du président aux supporters et partenaires..." rows={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="presidentWordImageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de l'image (Mot du président)</FormLabel>
                          <FormControl><Input placeholder="https://exemple.com/president.jpg" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="presidentWishes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vœux et vision du président</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Les ambitions et les vœux pour le futur du club..." rows={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </CollapsibleContent>
            </Collapsible>
            
            <Collapsible>
                <CollapsibleTrigger className='text-xl font-headline text-primary'>Contact, Réseaux &amp; Carte</CollapsibleTrigger>
                <CollapsibleContent className='space-y-6 pt-4 border-l pl-4 ml-2'>
                    <FormField control={form.control} name="contactEmail" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Contact</FormLabel>
                        <FormControl><Input type="email" placeholder="contact@asckhombole.sn" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="contactPhone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone de Contact</FormLabel>
                        <FormControl><Input placeholder="+221 33 123 45 67" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse du Club</FormLabel>
                        <FormControl><Input placeholder="Stade Ibrahima Boye, Khombole, Sénégal" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="googleMapsUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL d'intégration Google Maps</FormLabel>
                        <FormControl><Input placeholder="https://www.google.com/maps/embed?..." {...field} /></FormControl>
                        <FormDescription>Allez sur Google Maps, cherchez votre lieu, cliquez sur "Partager" puis "Intégrer une carte" et copiez l'URL depuis le code iframe.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="facebookUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Facebook</FormLabel>
                        <FormControl><Input placeholder="https://facebook.com/asckhombole" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="twitterUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Twitter</FormLabel>
                        <FormControl><Input placeholder="https://twitter.com/asckhombole" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="instagramUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Instagram</FormLabel>
                        <FormControl><Input placeholder="https://instagram.com/asckhombole" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="youtubeUrl" render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL YouTube</FormLabel>
                        <FormControl><Input placeholder="https://youtube.com/asckhombole" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                </CollapsibleContent>
            </Collapsible>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les informations'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
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
    <Dialog>
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

        <Tabs defaultValue="actus" className="w-full">
          <TabsList className="overflow-x-auto w-full justify-start md:justify-center bg-background">
            <TabsTrigger value="actus">Actualités</TabsTrigger>
            <TabsTrigger value="equipe">Équipe</TabsTrigger>
            <TabsTrigger value="matchs">Matchs</TabsTrigger>
            <TabsTrigger value="galerie">Galerie</TabsTrigger>
            <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
            <TabsTrigger value="club">Club & Accueil</TabsTrigger>
            <TabsTrigger value="boutique" disabled>Boutique</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="webtv" disabled>Web TV</TabsTrigger>
          </TabsList>

          <TabsContent value="actus" className="mt-6 space-y-6">
              <ArticlesList />
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un article
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card>
                      <CardHeader>
                          <CardTitle>Ajouter un article</CardTitle>
                          <CardDescription>Remplissez le formulaire ci-dessous pour publier une nouvelle actualité.</CardDescription>
                      </CardHeader>
                      <CardContent>
                          <AddArticleForm onFinish={() => {}} />
                      </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
          </TabsContent>
          
          <TabsContent value="equipe" className="mt-6 space-y-6">
              <PlayersList />
               <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un joueur
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <AddPlayerForm />
                </CollapsibleContent>
              </Collapsible>
          </TabsContent>

          <TabsContent value="matchs" className="mt-6 space-y-6">
               <MatchesList />
               <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un match
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <AddMatchForm />
                </CollapsibleContent>
              </Collapsible>
          </TabsContent>

          <TabsContent value="galerie" className="mt-6 space-y-6">
               <PhotosList />
               <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une photo
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <AddPhotoForm />
                </CollapsibleContent>
              </Collapsible>
          </TabsContent>

          <TabsContent value="partenaires" className="mt-6 space-y-6">
                <PartnersList />
                <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un partenaire
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <AddPartnerForm />
                </CollapsibleContent>
              </Collapsible>
          </TabsContent>
          
          <TabsContent value="club" className="mt-6">
              <ClubInfoForm />
          </TabsContent>
          <TabsContent value="boutique">
              <Card>
                  <CardHeader>
                      <CardTitle>Boutique</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">La gestion de la boutique sera bientôt disponible.</p>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="contact">
              <Card>
                  <CardHeader>
                      <CardTitle>Contact</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">La gestion des messages de contact sera bientôt disponible.</p>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent value="webtv">
              <Card>
                  <CardHeader>
                      <CardTitle>Web TV</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground">La gestion de la Web TV sera bientôt disponible.</p>
                  </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
      </main>
    </Dialog>
  );
}
