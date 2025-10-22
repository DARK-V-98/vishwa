import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { profile, skills, experience, achievements } from "@/lib/data";
import { Briefcase, Award, ArrowRight } from "lucide-react";

export default function ProfileShowcase() {
  const profileImage = PlaceHolderImages.find(img => img.id === 'profile-picture');

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {profileImage && (
              <div className="mb-4 rounded-full overflow-hidden shadow-lg ring-4 ring-primary/20">
                <Image
                  src={profileImage.imageUrl}
                  alt="Profile Picture"
                  width={150}
                  height={150}
                  className="object-cover"
                  data-ai-hint={profileImage.imageHint}
                />
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{profile.name}</h1>
            <h2 className="text-lg text-primary font-semibold mt-1">{profile.title}</h2>
            <p className="mt-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {profile.bio}
            </p>
            <Button asChild className="mt-6" size="lg">
              <a href="/appointments">
                Book a Meeting <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Briefcase />Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.company}>
                      <h3 className="font-bold">{exp.role}</h3>
                      <p className="font-semibold text-sm text-primary">{exp.company}</p>
                      <p className="text-xs text-muted-foreground">{exp.period}</p>
                      <p className="text-sm mt-1">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Award />Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((ach) => (
                    <div key={ach.title}>
                      <h3 className="font-bold">{ach.title}</h3>
                      <p className="text-sm mt-1">{ach.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
