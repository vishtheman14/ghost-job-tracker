import { PrismaClient } from '@prisma/client'
import { companies, jobPostings } from '../lib/mockData'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.savedJob.deleteMany()
  await prisma.job.deleteMany()
  await prisma.company.deleteMany()

  // Seed companies
  for (const company of companies) {
    await prisma.company.create({
      data: {
        id: company.id,
        name: company.name,
        ghostScore: company.ghostScore,
        logo: company.logo,
      },
    })
  }
  console.log(`Created ${companies.length} companies`)

  // Seed jobs
  for (const job of jobPostings) {
    await prisma.job.create({
      data: {
        id: job.id,
        title: job.title,
        companyId: job.companyId,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        techStack: job.techStack,
        daysPosted: job.daysPosted,
        ghostScore: job.ghostScore,
        redFlags: job.redFlags,
        greenFlags: job.greenFlags,
      },
    })
  }
  console.log(`Created ${jobPostings.length} jobs`)

  console.log('Seeding finished!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })