
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/social-icons";

export default function ContactPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOUS CONTACTER</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Une question, une suggestion ou une demande ? Nous sommes à votre écoute.
        </p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Envoyer un message</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="mailto:khomboleasc@gmail.com" method="post" encType="text/plain" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Votre nom</Label>
                  <Input id="name" name="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Votre email</Label>
                  <Input id="email" name="email" type="email" placeholder="john.doe@exemple.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Votre message</Label>
                <Textarea id="message" name="message" placeholder="Écrivez votre message ici..." rows={6} />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Envoyer par email
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <h2 className="text-3xl font-bold font-headline text-primary">Informations de Contact</h2>
            <div className="space-y-4 text-lg">
                <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-accent"/>
                    <a href="mailto:khomboleasc@gmail.com" className="hover:underline">khomboleasc@gmail.com</a>
                </div>
                <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-accent"/>
                    <span className="text-muted-foreground">(Numéro de téléphone)</span>
                </div>
                <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-accent mt-1"/>
                    <div>
                        <p>(Adresse du club)</p>
                        <p className="text-muted-foreground">Khombole, Sénégal</p>
                    </div>
                </div>
            </div>
             <div className="space-y-2">
                <h3 className="text-xl font-semibold font-headline">Suivez-nous</h3>
                <div className="flex space-x-2">
                    <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><FacebookIcon className="h-6 w-6 text-muted-foreground" /></a>
                    <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><TwitterIcon className="h-6 w-6 text-muted-foreground" /></a>
                    <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><InstagramIcon className="h-6 w-6 text-muted-foreground" /></a>
                    <a href="#" className="p-2 rounded-full bg-muted/50 hover:bg-muted"><YoutubeIcon className="h-6 w-6 text-muted-foreground" /></a>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
