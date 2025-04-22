import Link from "next/link"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/resume/profile-form"
import { TabNavigation } from "@/components/resume/tab-navigation"
import { PlusCircle, Briefcase, GraduationCap, Award } from "lucide-react"

export const revalidate = 0

interface Profile {
  id: number
  name: string
  location: string
  phone: string
  email: string
  linkedin: string
  github_link: string
  title: string
  summary: string
  bio_photo: string
}

async function getProfile(): Promise<Profile> {
  try {
    const profile = await sql`SELECT * FROM resume_profile ORDER BY id LIMIT 1`
    const firstProfile = profile[0] as Profile
    return firstProfile || {
      id: 0,
      name: "",
      location: "",
      phone: "",
      email: "",
      linkedin: "",
      github_link: "",
      title: "",
      summary: "",
      bio_photo: ""
    }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return {
      id: 0,
      name: "",
      location: "",
      phone: "",
      email: "",
      linkedin: "",
      github_link: "",
      title: "",
      summary: "",
      bio_photo: ""
    }
  }
}

async function getExperiences() {
  try {
    const experiences = await sql`
      SELECT id, position, company, start_date, end_date, current 
      FROM experience 
      ORDER BY start_date DESC
    `
    return experiences
  } catch (error) {
    console.error("Error fetching experiences:", error)
    return []
  }
}

async function getEducation() {
  try {
    const education = await sql`
      SELECT id, degree, institution, start_date, end_date 
      FROM education 
      ORDER BY start_date DESC
    `
    return education
  } catch (error) {
    console.error("Error fetching education:", error)
    return []
  }
}

async function getCertifications() {
  try {
    const certifications = await sql`
      SELECT id, title, issuer, issue_date 
      FROM certifications 
      ORDER BY issue_date DESC
    `
    return certifications
  } catch (error) {
    console.error("Error fetching certifications:", error)
    return []
  }
}

// Update the page component to use the TabNavigation component with query parameters
export default async function ResumeAdminPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  // Add error handling for data fetching
  const [profile, experiences, education, certifications] = await Promise.all([
    getProfile(),
    getExperiences(),
    getEducation(),
    getCertifications(),
  ])

  // Get the tab from search params or default to "profile" - handle async properly
  const activeTab = searchParams && 'tab' in searchParams 
    ? (Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab) 
    : "profile"

  // Render the appropriate content based on the active tab
  let tabContent
  switch (activeTab) {
    case "profile":
      tabContent = <ProfileForm profile={profile} />
      break
    case "experience":
      tabContent = (
        <>
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href="/admin/resume/experience/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Experience
              </Link>
            </Button>
          </div>

          {experiences.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {experiences.map((exp: any) => (
                <Card key={exp.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <CardTitle className="text-lg font-medium">{exp.position}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{exp.company}</CardDescription>
                    <div className="text-sm text-muted-foreground mt-2">
                      {new Date(exp.start_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {exp.current
                        ? "Present"
                        : new Date(exp.end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href={`/admin/resume/experience/${exp.id}`}>Edit</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No experience entries yet</p>
                <Button asChild>
                  <Link href="/admin/resume/experience/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Experience
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )
      break
    case "education":
      tabContent = (
        <>
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href="/admin/resume/education/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Education
              </Link>
            </Button>
          </div>

          {education.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {education.map((edu: any) => (
                <Card key={edu.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      <CardTitle className="text-lg font-medium">{edu.degree}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{edu.institution}</CardDescription>
                    <div className="text-sm text-muted-foreground mt-2">
                      {new Date(edu.start_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}{" "}
                      -{" "}
                      {edu.end_date
                        ? new Date(edu.end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                          })
                        : "Present"}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href={`/admin/resume/education/${edu.id}`}>Edit</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No education entries yet</p>
                <Button asChild>
                  <Link href="/admin/resume/education/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Education
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )
      break
    case "certifications":
      tabContent = (
        <>
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href="/admin/resume/certifications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Certification
              </Link>
            </Button>
          </div>

          {certifications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {certifications.map((cert: any) => (
                <Card key={cert.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      <CardTitle className="text-lg font-medium">{cert.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{cert.issuer}</CardDescription>
                    <div className="text-sm text-muted-foreground mt-2">
                      Issued:{" "}
                      {new Date(cert.issue_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </div>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href={`/admin/resume/certifications/${cert.id}`}>Edit</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground mb-4">No certifications yet</p>
                <Button asChild>
                  <Link href="/admin/resume/certifications/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Certification
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )
      break
    default:
      tabContent = <ProfileForm profile={profile} />
  }

  return (
    <div className="container mx-auto py-10">
      <TabNavigation />
      <div className="space-y-6 mt-6">
        <h1 className="text-3xl font-bold">Resume Management</h1>
        <div>{tabContent}</div>
      </div>
    </div>
  )
}
