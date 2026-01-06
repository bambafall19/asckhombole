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
import { LoaderCircle, LogOut, PlusCircle, Trash2, Pencil, List, Users, Trophy, Image as ImageIcon, Handshake } from 'lucide-react';
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
import { Article, Player, Match, Photo, Partner } from '@/lib/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


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
  imageHint: z.string().optional(),
});

function AddArticleForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof articleFormSchema>>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'Club',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/450`,
      imageHint: 'soccer match',
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
        title: '',
        content: '',
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
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un article</CardTitle>
        <CardDescription>Remplissez le formulaire ci-dessous pour publier une nouvelle actualité.</CardDescription>
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

const playerFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  position: z.string().min(2, { message: 'Le poste doit contenir au moins 2 caractères.' }),
  number: z.coerce.number().int().positive({ message: 'Le numéro doit être un nombre positif.' }),
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
  imageHint: z.string().optional(),
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
      imageHint: 'soccer player',
    },
  });

  async function onSubmit(values: z.infer<typeof playerFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'players'), { ...values });
      toast({ title: 'Joueur ajouté !', description: `${values.name} a été ajouté à l'effectif.` });
      form.reset({
        ...form.getValues(),
        name: '',
        imageUrl: `https://picsum.photos/seed/${Math.random()}/400/400`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du joueur: ", error);
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer le joueur." });
    } finally {
      setIsSubmitting(false);
    }
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
                <FormField control={form.control} name="imageHint" render={({ field }) => (
                <FormItem>
                    <FormLabel>Indice pour l'image (Optionnel)</FormLabel>
                    <FormControl><Input placeholder="soccer player portrait" {...field} /></FormControl>
                    <FormDescription>Un ou deux mots en anglais pour l'IA.</FormDescription>
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
        try {
            await deleteDoc(doc(firestore, 'players', playerId));
            toast({ title: 'Joueur supprimé', description: 'Le joueur a été retiré de l\'effectif.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le joueur.' });
        }
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
  competition: z.string().min(3, { message: 'La compétition doit contenir au moins 3 caractères.' }),
  homeTeam: z.string().min(3, { message: 'Le nom de l\'équipe à domicile est obligatoire.' }),
  awayTeam: z.string().min(3, { message: 'Le nom de l\'équipe à l\'extérieur est obligatoire.' }),
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
    },
  });

  async function onSubmit(values: z.infer<typeof matchFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'matches'), { ...values });
      toast({ title: 'Match ajouté !', description: `Le match ${values.homeTeam} vs ${values.awayTeam} a été programmé.` });
      form.reset({
        ...values,
        awayTeam: '',
        homeScore: undefined,
        awayScore: undefined,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du match: ", error);
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer le match." });
    } finally {
      setIsSubmitting(false);
    }
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
                    <FormField control={form.control} name="homeScore" render={({ field }) => (
                    <FormItem><FormLabel>Score Domicile (Optionnel)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="awayScore" render={({ field }) => (
                    <FormItem><FormLabel>Score Extérieur (Optionnel)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="competition" render={({ field }) => (
                <FormItem><FormLabel>Compétition</FormLabel><FormControl><Input placeholder="Ligue 1" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date et heure du match</FormLabel>
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
                                    format(field.value, "PPP 'à' HH:mm", { locale: fr })
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
        try {
            await deleteDoc(doc(firestore, 'matches', matchId));
            toast({ title: 'Match supprimé', description: 'Le match a été supprimé avec succès.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le match.' });
        }
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
                                <TableCell>{match.date ? format(match.date.toDate(), 'P', { locale: fr }) : ''}</TableCell>
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
                                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
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
  title: z.string().min(3, { message: 'Le titre doit contenir au moins 3 caractères.' }),
  imageUrl: z.string().url({ message: "Veuillez entrer une URL d'image valide." }),
  imageHint: z.string().optional(),
});

function AddPhotoForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firestore = useFirestoreHook();

  const form = useForm<z.infer<typeof photoFormSchema>>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      title: '',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
      imageHint: 'soccer game',
    },
  });

  async function onSubmit(values: z.infer<typeof photoFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'photos'), {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Photo ajoutée !', description: 'La nouvelle photo a été ajoutée à la galerie.' });
      form.reset({
        ...form.getValues(),
        title: '',
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo: ", error);
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer la photo." });
    } finally {
      setIsSubmitting(false);
    }
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
                <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Titre / Description</FormLabel><FormControl><Input placeholder="Célébration après le but" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                <FormItem>
                    <FormLabel>URL de la photo</FormLabel>
                    <FormControl><Input placeholder="https://exemple.com/photo.jpg" {...field} /></FormControl>
                    <FormDescription>Lien vers l'image à ajouter.</FormDescription>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="imageHint" render={({ field }) => (
                <FormItem>
                    <FormLabel>Indice pour l'image (Optionnel)</FormLabel>
                    <FormControl><Input placeholder="soccer celebration" {...field} /></FormControl>
                    <FormDescription>Un ou deux mots en anglais pour l'IA.</FormDescription>
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
        try {
            await deleteDoc(doc(firestore, 'photos', photoId));
            toast({ title: 'Photo supprimée', description: 'La photo a été retirée de la galerie.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer la photo.' });
        }
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
    try {
      await addDoc(collection(firestore, 'partners'), { ...values });
      toast({ title: 'Partenaire ajouté !', description: `Le partenaire ${values.name} a été ajouté.` });
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'ajout du partenaire: ", error);
      toast({ variant: 'destructive', title: 'Erreur', description: "Impossible d'enregistrer le partenaire." });
    } finally {
      setIsSubmitting(false);
    }
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
        try {
            await deleteDoc(doc(firestore, 'partners', partnerId));
            toast({ title: 'Partenaire supprimé', description: 'Le partenaire a été supprimé.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de supprimer le partenaire.' });
        }
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
                                          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
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

      <Tabs defaultValue="actus" className="w-full">
        <TabsList className="overflow-x-auto w-full justify-start md:justify-center">
          <TabsTrigger value="actus">Actualités</TabsTrigger>
          <TabsTrigger value="equipe">Équipe</TabsTrigger>
          <TabsTrigger value="matchs">Matchs</TabsTrigger>
          <TabsTrigger value="galerie">Galerie</TabsTrigger>
          <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
          <TabsTrigger value="boutique" disabled>Boutique</TabsTrigger>
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
                <AddArticleForm />
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
  );
}
