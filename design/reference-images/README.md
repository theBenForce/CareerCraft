# Reference Images

This folder contains reference images, design mockups, and visual inspiration for the Career Craft application.

## Purpose

Reference images help maintain design consistency and provide visual context for:
- UI component designs
- Layout references
- Design inspiration
- Before/after comparisons
- Component variations

## Folder Organization

### Recommended Structure
```
reference-images/
├── components/           # Individual component references
│   ├── buttons/
│   ├── forms/
│   ├── tables/
│   └── cards/
├── pages/               # Full page layout references
│   ├── contacts/
│   ├── companies/
│   ├── applications/
│   └── dashboard/
├── mobile/              # Mobile-specific designs
├── wireframes/          # Low-fidelity wireframes
├── mockups/            # High-fidelity mockups
└── inspiration/        # External design inspiration
```

## Image Types

### Component References
- Individual component designs
- Component states (hover, active, disabled)
- Component variations and alternatives
- Before/after implementation comparisons

### Layout References
- Full page screenshots
- Responsive layout examples
- Navigation patterns
- Content organization examples

### Design Inspiration
- External design references
- Color palette inspirations
- Typography examples
- Interaction patterns from other applications

## File Naming Convention

Use descriptive, kebab-case file names:
- `contacts-table-reference.png`
- `button-primary-states.png`
- `mobile-navigation-wireframe.png`
- `dashboard-layout-v2.png`

## Image Specifications

### Preferred Formats
- **PNG** - For screenshots and UI mockups
- **JPG** - For photographs and complex images
- **SVG** - For icons and simple graphics
- **WebP** - For optimized web images

### Resolution Guidelines
- **Screenshots**: Native resolution (don't scale down)
- **Mockups**: High resolution (at least 1920px wide for desktop)
- **Mobile**: Include actual device dimensions
- **Components**: Large enough to show detail clearly

## Usage Guidelines

### Adding New Images
1. Use descriptive file names
2. Include date in filename for versions (e.g., `dashboard-2025-06-30.png`)
3. Add brief description in commit message
4. Consider creating subfolders for organization

### Referencing Images
When referencing these images in documentation:
- Use relative paths from the design folder
- Include alt text for accessibility
- Provide context about what the image shows

Example:
```markdown
![Contacts table layout reference](./reference-images/pages/contacts/contacts-table-reference.png)
*Reference image showing the table-based layout for the contacts page*
```

## Current Images

### Page Layouts
- **`pages/contacts/contacts-page.png`** - Table-based contacts listing with search, filters, and pagination
- **`pages/contacts/contact-details-page.png`** - Individual contact detail view with card-based layout
- **`pages/applications/list-applications-page.png`** - Job applications listing page
- **`pages/applications/application-details-page.png`** - Individual application detail view

### Components
- (No component-specific images yet - add references as needed)

### Mobile Designs
- (No mobile-specific images yet - add references as needed)

---

*Add your reference images to appropriate subfolders in this directory*
