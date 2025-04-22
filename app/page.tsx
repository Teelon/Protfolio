import Link from "next/link"
import { ArrowRight, Github, MessageSquare, Rocket, Code, Database, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects, sql } from "@/lib/db"

async function getProfile() {
  const profile = await sql`SELECT * FROM resume_profile ORDER BY id LIMIT 1`
  return profile[0] || null
}

export default async function Home() {
  const [featuredProjects, profile] = await Promise.all([
    getProjects({ featured: true, limit: 3 }),
    getProfile()
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full min-h-[80vh] flex items-center justify-center py-12 md:py-24 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center px-4">
        {profile?.bio_photo && (
        <div className="relative h-64 w-64 mb-4 overflow-hidden">
          {/* Hexagon-like shape with clip-path */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 p-2 rotate-45">
            <div className="h-full w-full bg-white"></div>
          </div>
          <div className="absolute inset-3 overflow-hidden" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <img 
              src="https://i.imgur.com/UZk9tQn.jpg" 
              alt={profile.name} 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}
          
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            {profile?.name || "Welcome to My Portfolio"}
          </h1>
          
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            { "🕵️‍♂️ Detective of business needs by day, architect of data systems by night! I'm the translator who speaks both \"stakeholder\" and \"tech\" fluently. Need someone to crack the code of what your business really needs? I'll uncover those hidden requirements and transform them into backend magic ✨. From database wizardry to ETL sorcery, I turn data chaos into digital harmony. Let's make your systems sing!"}
          </p>
          
          <div className="flex flex-col gap-4 min-[400px]:flex-row">
            <Link href="/projects">
              <Button size="lg" className="w-full min-[400px]:w-auto">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                Contact Me
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {profile?.github_link && (
            <Link href={profile.github_link} target="_blank" rel="noopener noreferrer" className="mt-4">
              <Button variant="ghost" size="sm">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="w-full py-12 md:py-24">
        <div className="container space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold sm:text-4xl">Featured Projects</h2>
            <p className="text-muted-foreground">Recent work I've done</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.summary}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {project.tags && project.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link href={`/projects/${project.slug}`} className="w-full">
                    <Button variant="ghost" className="w-full justify-between">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Link href="/projects">
              <Button variant="outline" size="lg">
                View All Projects
                <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="w-full py-12 md:py-24 bg-muted/50">
        <div className="container space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold sm:text-4xl">Skills & Technologies</h2>
            <p className="text-muted-foreground">Technologies I work with</p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Frontend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>React/Next.js</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Node.js</li>
                  <li>PostgreSQL</li>
                  <li>REST APIs</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Git</li>
                  <li>VS Code</li>
                  <li>Docker</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[58rem] text-center space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl">Let's Work Together</h2>
            <p className="text-muted-foreground">Have a project in mind? I'd love to help you bring it to life.</p>
            
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Link href="/contact">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Get in Touch
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}