import { sql, formatDate } from "@/lib/db"
import { Briefcase, GraduationCap, Award } from "lucide-react"

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
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <span>{profile.location}</span>
              <span className="mx-2">•</span>
              <span>{profile.email}</span>
              {profile.phone && (
                <>
                  <span className="mx-2">•</span>
                  <span>{profile.phone}</span>
                </>
              )}
            </div>
            <h2 className="text-2xl font-semibold mb-4">{profile.title}</h2>
            <p className="text-lg">{profile.summary}</p>
          </div>
        ) : (
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">About Me</h1>
            <p className="text-lg">No profile information available yet.</p>
          </div>
        )}

        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Briefcase className="mr-2" />
            <h2 className="text-2xl font-bold">Experience</h2>
          </div>

          {experiences.length > 0 ? (
            <div className="space-y-8">
              {experiences.map((exp: any) => (
                <div key={exp.id} className="border-l-2 border-muted pl-4 pb-2">
                  <h3 className="text-xl font-semibold">{exp.position}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                    <span className="font-medium">{exp.company}</span>
                    <span className="hidden sm:block mx-2">•</span>
                    <span>{exp.location}</span>
                    {exp.employment_type && (
                      <>
                        <span className="hidden sm:block mx-2">•</span>
                        <span>{exp.employment_type}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {formatDate(exp.start_date)} - {exp.current ? "Present" : formatDate(exp.end_date)}
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {exp.description?.map((item: string, i: number) => (
                      <li key={i} className="text-sm sm:text-base">
                        {item}
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
          <div className="flex items-center mb-6">
            <GraduationCap className="mr-2" />
            <h2 className="text-2xl font-bold">Education</h2>
          </div>

          {education.length > 0 ? (
            <div className="space-y-8">
              {education.map((edu: any) => (
                <div key={edu.id} className="border-l-2 border-muted pl-4 pb-2">
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                    <span className="font-medium">{edu.institution}</span>
                    <span className="hidden sm:block mx-2">•</span>
                    <span>{edu.location}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                  </p>
                  {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No education entries available yet.</p>
          )}
        </section>

        <section>
          <div className="flex items-center mb-6">
            <Award className="mr-2" />
            <h2 className="text-2xl font-bold">Certifications</h2>
          </div>

          {certifications.length > 0 ? (
            <div className="space-y-6">
              {certifications.map((cert: any) => (
                <div key={cert.id} className="border-l-2 border-muted pl-4 pb-2">
                  <h3 className="text-xl font-semibold">{cert.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground mb-2">
                    <span className="font-medium">{cert.issuer}</span>
                    <span className="hidden sm:block mx-2">•</span>
                    <span>Issued {formatDate(cert.issue_date)}</span>
                    {cert.expiry_date && <span className="sm:ml-2">(Expires {formatDate(cert.expiry_date)})</span>}
                  </div>
                  {cert.description && <p className="text-sm">{cert.description}</p>}
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
