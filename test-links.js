const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLinks() {
  console.log('Testing Link model...');

  try {
    // Test creating a link for a company
    console.log('1. Creating a test link...');
    const testLink = await prisma.link.create({
      data: {
        url: 'https://linkedin.com/company/test',
        label: 'LinkedIn Page',
        companyId: 1,
      },
    });
    console.log('✓ Link created:', testLink);

    // Test fetching links
    console.log('\n2. Fetching all links...');
    const allLinks = await prisma.link.findMany({
      include: {
        company: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        jobApplication: { select: { position: true } },
      },
    });
    console.log('✓ Links found:', allLinks);

    // Test updating a link
    console.log('\n3. Updating the link...');
    const updatedLink = await prisma.link.update({
      where: { id: testLink.id },
      data: { label: 'Company LinkedIn' },
    });
    console.log('✓ Link updated:', updatedLink);

    // Clean up - delete the test link
    console.log('\n4. Cleaning up...');
    await prisma.link.delete({
      where: { id: testLink.id },
    });
    console.log('✓ Test link deleted');

    console.log('\n✅ All tests passed! Link model is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLinks();
