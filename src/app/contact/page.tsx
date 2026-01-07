import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-primary font-headline">NOUS CONTACTER</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          Une question, une suggestion ou une demande ? Nous sommes à votre écoute.
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
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
      </div>
    </main>
  );
}
