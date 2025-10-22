import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code2,
  Palette,
  Database,
  Globe,
  Award,
  Download,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  const skills = [
    { icon: Code2, name: "Web Development", level: 95 },
    { icon: Palette, name: "UI/UX Design", level: 90 },
    { icon: Database, name: "Firebase & Backend", level: 85 },
    { icon: Globe, name: "Full-Stack Solutions", level: 92 },
  ];

  const timeline = [
    {
      year: "2018",
      title: "Started Professional Journey",
      description: "Began freelancing and building web solutions for local businesses",
    },
    {
      year: "2020",
      title: "Founded ESystemLK",
      description: "Assembled team of Sri Lanka's top developers to deliver enterprise solutions",
    },
    {
      year: "2022",
      title: "Expanded Services",
      description: "Added logo design, branding, and creative services to portfolio",
    },
    {
      year: "2024",
      title: "Marketplace Launch",
      description: "Developing comprehensive marketplace platform for users",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                About Me
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                R.M.T Vishwa Vidarshana
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Professional Web Developer | Creative Designer | Tech Entrepreneur
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-strong border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-full aspect-square bg-gradient-hero rounded-2xl shadow-strong flex items-center justify-center">
                      <span className="text-8xl font-bold text-primary-foreground">VV</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold">Hello! I'm Vishwa</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      With over 6 years of professional experience in the tech industry, I specialize
                      in creating innovative digital solutions that help businesses thrive in the
                      modern world.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      As the founder of ESystemLK, I lead a talented team of developers delivering
                      world-class software solutions. My expertise spans web development, UI/UX
                      design, branding, and business systems.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      I'm passionate about transforming ideas into reality through clean code,
                      beautiful design, and strategic thinking.
                    </p>
                    <div className="flex gap-4 pt-4">
                      <Button variant="hero">
                        <Download className="mr-2 h-4 w-4" />
                        Download CV
                      </Button>
                      <Link to="/contact">
                        <Button variant="outline">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Meeting
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                My <span className="bg-gradient-hero bg-clip-text text-transparent">Expertise</span>
              </h2>
              <p className="text-muted-foreground">
                Skills honed over years of professional experience
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, idx) => (
                <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-medium transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-medium">
                        <skill.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{skill.name}</h3>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary">{skill.level}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                My <span className="bg-gradient-hero bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-muted-foreground">
                6+ years of growth and achievements
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary hidden md:block"></div>
              
              <div className="space-y-8">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-0 md:pl-20">
                    <div className="absolute left-5 top-2 w-6 h-6 bg-gradient-primary rounded-full shadow-glow hidden md:flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
                    </div>
                    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-medium transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Briefcase className="h-6 w-6 text-primary flex-shrink-0 md:hidden" />
                          <div className="flex-1">
                            <span className="text-sm font-semibold text-primary">{item.year}</span>
                            <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Achievements & <span className="bg-gradient-hero bg-clip-text text-transparent">Certifications</span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "100+ Projects Completed", desc: "Successfully delivered" },
                { title: "50+ Happy Clients", desc: "Trusted partnerships" },
                { title: "6+ Years Experience", desc: "In the industry" },
              ].map((achievement, idx) => (
                <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
                  <CardContent className="p-8 space-y-4">
                    <Award className="h-12 w-12 text-primary mx-auto" />
                    <h3 className="text-2xl font-bold">{achievement.title}</h3>
                    <p className="text-muted-foreground">{achievement.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
