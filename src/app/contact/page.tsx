'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, LoaderCircle } from "lucide-react";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/social-icons";
import { useMemo, useState } from "react";
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useDocument, useFirestore } from "@/firebase";
import { ClubInfo } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  subject: z.string().min(5, { message: "Le sujet doit contenir au moins 5 caractères." }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères." }),
});


function ContactPageSkeleton() {
    return (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <Card>
                <CardHeader>
                    <CardTitle>Envoyer un message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-24 w-full" /></div>
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
            <div className="space-y-8">
                <Skeleton className="h-9 w-64" />
                <div className="space-y-4">
                    <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-5 w-48" /></div>
                    <div className="flex items-center gap-4"><Skeleton className="h-6 w-6 rounded-full" /><Skeleton className="h-5 w-32" /></div>
                    <div className="flex items-start gap-4"><Skeleton className="h-6 w-6 rounded-full mt-1" /><div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-24" /></div></div>
                </div>
                 <Skeleton className="h-7 w-40" />
                <div className="flex space-x-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
                <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
        </div>
    );
}

export default function ContactPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
        name: '',
        email: '',
        subject: '',
        message: '',
    }
  });

  const clubInfoRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, 'clubInfo', 'main');
  }, [firestore]);

  const { data: clubInfo, loading } = useDocument<ClubInfo>(clubInfoRef);

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);

    const messagesCollection = collection(firestore, 'contactMessages');
    addDoc(messagesCollection, {
      ...values,
      createdAt: serverTimestamp(),
      isRead: false,
    }).then(() => {
      toast({ title: "Message envoyé !", description: "Merci, nous vous répondrons dans les plus brefs délais." });
      form.reset();
    }).catch(async (error) => {
      console.error("Erreur lors de l'envoi du message: ", error);
        const permissionError = new FirestorePermissionError({
            path: messagesCollection.path,
            operation: 'create',
            requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'envoyer votre message. Veuillez réessayer." });
    }).finally(() => {
      setIsSubmitting(false);
    });
  }

  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOUS CONTACTER</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Une question, une suggestion ou une demande ? Nous sommes à votre écoute.
        </p>
      </div>
      
      {loading && <ContactPageSkeleton />}

      {!loading && (
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Votre nom</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Votre email</FormLabel><FormControl><Input type="email" placeholder="john.doe@exemple.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Sujet</FormLabel><FormControl><Input placeholder="Sujet de votre message" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Votre message</FormLabel><FormControl><Textarea placeholder="Écrivez votre message ici..." rows={6} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                   {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <h2 className="text-3xl font-bold font-headline text-primary">Informations de Contact</h2>
            <div className="space-y-4 text-lg">
                {clubInfo?.contactEmail && (
                    <div className="flex items-center gap-4">
                        <Mail className="w-6 h-6 text-accent"/>
                        <a href={`mailto:${clubInfo.contactEmail}`} className="hover:underline">{clubInfo.contactEmail}</a>
                    </div>
                )}
                {clubInfo?.contactPhone && (
                    <div className="flex items-center gap-4">
                        <Phone className="w-6 h-6 text-accent"/>
                        <span>{clubInfo.contactPhone}</span>
                    </div>
                )}
                {clubInfo?.address && (
                    <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-accent mt-1"/>
                        <div>
                            <p>{clubInfo.address}</p>
                            <p className="text-sm text-muted-foreground">Khombole, Sénégal</p>
                        </div>
                    </div>
                )}
            </div>
             <div className="space-y-2">
                <h3 className="text-xl font-semibold font-headline">Suivez-nous</h3>
                <div className="flex space-x-2">
                    {clubInfo?.facebookUrl && <a href={clubInfo.facebookUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><FacebookIcon className="h-6 w-6 text-muted-foreground" /></a>}
                    {clubInfo?.twitterUrl && <a href={clubInfo.twitterUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><TwitterIcon className="h-6 w-6 text-muted-foreground" /></a>}
                    {clubInfo?.instagramUrl && <a href={clubInfo.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><InstagramIcon className="h-6 w-6 text-muted-foreground" /></a>}
                    {clubInfo?.youtubeUrl && <a href={clubInfo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><YoutubeIcon className="h-6 w-6 text-muted-foreground" /></a>}
                </div>
            </div>

            {clubInfo?.googleMapsUrl && (
              <div className="space-y-2">
                  <h3 className="text-xl font-semibold font-headline">Localisation</h3>
                  <div className="aspect-video w-full overflow-hidden rounded-xl border">
                    <iframe 
                      src={clubInfo.googleMapsUrl}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
              </div>
            )}
        </div>
      </div>
      )}
    </main>
  );
}

    