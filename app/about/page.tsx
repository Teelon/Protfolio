import { sql, formatDate } from "@/lib/db"
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Calendar, 
  Building, 
  Clock, 
  User, 
  Star
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export const revalidate = 0

async function getProfile() {
  const profile = await sql`SELECT * FROM resume_profile ORDER BY id LIMIT 1`
  return profile[0] || null
}

async function getExperiences() {
  const experiences = await sql`SELECT * FROM experience ORDER BY start_date DESC`
  return experiences
}

async function getEducation() {
  const education = await sql`SELECT * FROM education ORDER BY start_date DESC`
  return education
}

async function getCertifications() {
  const certifications = await sql`SELECT * FROM certifications ORDER BY issue_date DESC`
  return certifications
}

export default async function AboutPage() {
  const profile = await getProfile()
  const experiences = await getExperiences()
  const education = await getEducation()
  const certifications = await getCertifications()

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {profile ? (
          <div className="mb-12 bg-card p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={profile.bio_photo} alt={profile.name} />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                <h2 className="text-2xl font-semibold mb-4 text-primary">{profile.title}</h2>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground mb-6">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  
                  {profile.email && (
                    <div className="flex items-center gap-1">
                      <Mail size={16} />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  
                  {profile.phone && (
                    <div className="flex items-center gap-1">
                      <Phone size={16} />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  
                  {profile.github_link && (
                    <div className="flex items-center gap-1">
                      <Github size={16} />
                      <a href={profile.github_link} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
                
                <p className="text-lg">{profile.summary}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">About Me</h1>
            <p className="text-lg">No profile information available yet.</p>
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center mb-6 bg-primary/5 p-3 rounded-lg">
            <Briefcase className="mr-2 text-primary" />
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>

          {experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((exp: any) => (
                <div key={exp.id} className="border-l-2 border-primary/30 pl-6 pb-4 hover:border-primary transition-colors">
                  <h3 className="text-xl font-semibold flex items-center">
                    <User className="mr-2 text-primary" size={18} />
                    {exp.position}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2 ml-6">
                    <span className="font-medium flex items-center">
                      <Building className="mr-1" size={14} />
                      {exp.company}
                    </span>
                    <span className="hidden sm:block mx-2">•</span>
                    <span className="flex items-center">
                      <MapPin className="mr-1" size={14} />
                      {exp.location}
                    </span>
                    {exp.employment_type && (
                      <>
                        <span className="hidden sm:block mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="mr-1" size={14} />
                          {exp.employment_type}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 ml-6 flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {formatDate(exp.start_date)} - {exp.current ? "Present" : formatDate(exp.end_date)}
                  </p>
                  
                  <ul className="list-none space-y-2 ml-6">
                    {exp.description?.map((item: string, i: number) => (
                      <li key={i} className="text-sm sm:text-base flex items-start">
                        <Star className="mr-2 mt-1 text-primary/70 flex-shrink-0" size={14} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No experience entries available yet.</p>
          )}
        </section>

        <section className="mb-12">
          <div className="flex items-center mb-6 bg-primary/5 p-3 rounded-lg">
            <GraduationCap className="mr-2 text-primary" />
            <h2 className="text-2xl font-bold">Education</h2>
          </div>

          {education.length > 0 ? (
            <div className="space-y-8">
              {education.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-primary/30 pl-6 pb-4 hover:border-primary transition-colors">
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                    <span className="font-medium flex items-center">
                      <Building className="mr-1" size={14} />
                      {edu.institution}
                    </span>
                    <span className="hidden sm:block mx-2">•</span>
                    <span className="flex items-center">
                      <MapPin className="mr-1" size={14} />
                      {edu.location}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Calendar className="mr-1" size={14} />
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm flex items-center">
                      <Star className="mr-1 text-primary" size={14} />
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No education entries available yet.</p>
          )}
        </section>

        <section>
          <div className="flex items-center mb-6 bg-primary/5 p-3 rounded-lg">
            <Award className="mr-2 text-primary" />
            <h2 className="text-2xl font-bold">Certifications</h2>
          </div>

          {certifications.length > 0 ? (
            <div className="space-y-6">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="border-l-2 border-primary/30 pl-6 pb-4 hover:border-primary transition-colors">
                  <h3 className="text-xl font-semibold">{cert.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                    <span className="font-medium flex items-center">
                      <Building className="mr-1" size={14} />
                      {cert.issuer}
                    </span>
                    <span className="hidden sm:block mx-2">•</span>
                    <span className="flex items-center">
                      <Calendar className="mr-1" size={14} />
                      Issued {formatDate(cert.issue_date)}
                    </span>
                    {cert.expiry_date && (
                      <span className="sm:ml-2 flex items-center">
                        <Clock className="mr-1" size={14} />
                        Expires {formatDate(cert.expiry_date)}
                      </span>
                    )}
                  </div>
                  {cert.description && (
                    <p className="text-sm flex items-start mt-2">
                      <Star className="mr-2 mt-1 text-primary/70 flex-shrink-0" size={14} />
                      {cert.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No certifications available yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}