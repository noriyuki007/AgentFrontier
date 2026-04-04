const fs = require('fs');
const path = require('path');

const files = [
    'src/app/news/[id]/page.tsx',
    'src/app/features/[id]/page.tsx',
    'src/app/insights/[id]/page.tsx',
    'src/app/startups/[id]/page.tsx',
    'src/app/reviews/[id]/page.tsx'
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) return;

    let content = fs.readFileSync(fullPath, 'utf8');

    // Add newspicks-wrapper to <article className="...">
    content = content.replace(/<article\s+className="([^"]+)"/, (match, p1) => {
        if (!p1.includes('newspicks-wrapper')) {
            // Replace max-w-4xl if exists
            p1 = p1.replace('max-w-4xl', '').trim();
            // Replace px-5 sm:px-6 if we want to rely on the CSS, but let's just keep them and let !important override
            return `<article className="${p1} newspicks-wrapper"`;
        }
        return match;
    });

    // Add newspicks-prose to <div className="prose ...">
    content = content.replace(/className="prose\s+([^"]+)"/, (match, p1) => {
        if (!p1.includes('newspicks-prose')) {
            return `className="prose ${p1} newspicks-prose"`;
        }
        return match;
    });

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Modified', file);
});
