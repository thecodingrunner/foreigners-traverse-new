import GithubSlugger from "github-slugger";

export function extractHeadings(markdown: string, level = 2) {
    const slugger = new GithubSlugger();
    return [...markdown.matchAll(/^(#{1,6})\s+(.+)$/gm)]
    .map(([_, heading, text]) => ({ 
        level: heading.length, 
        text: text.trim(),
        id: slugger.slug(text.trim()), 
    }))
    .filter(heading => heading.level === level);
}