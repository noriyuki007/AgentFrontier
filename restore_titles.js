const config = require('./autopost/config');
const { callGeminiDynamic, callGroqDynamic } = require('./autopost/gemini-client');

function extractJson(text) {
    try {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) return null;
        let clean = match[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, ""); // Remove control characters
        return JSON.parse(clean);
    } catch (e) {
        console.error('JSON Extraction failed:', e.message, text.slice(0, 100));
        return null;
    }
}

async function generateTitle(content) {
    const prompt = `以下の記事内容から、読者がクリックしたくなるような洗練された日本語のタイトル（32文字以内）を考えてください。
JSON形式で {"title": "..."} とのみ出力してください。他の一切のテキストを含めないでください。

[内容要約]
${content.replace(/<[^>]*>?/gm, '').slice(0, 800)}...`;

    try {
        let text;
        if (config.gemini.groqKey) {
            text = await callGroqDynamic(prompt, { responseMimeType: 'application/json' });
        } else {
            text = await callGeminiDynamic(config.gemini.model, prompt, { responseMimeType: 'application/json' });
        }
        const data = extractJson(text);
        return data ? data.title : null;
    } catch (e) {
        console.error('Title generation failed:', e.message);
        return null;
    }
}

async function translateContent(content) {
    const prompt = `以下の記事内容は英語ですが、これを洗練された日本語のビジネスメディア「エージェント・フロンティア」のトーンで翻訳・リライトしてください。
HTMLタグは保持してください。
JSON形式で {"content": "...", "title": "..."} とのみ出力してください。

[元記事]
${content}`;

    try {
        let text;
        if (config.gemini.groqKey) {
            text = await callGroqDynamic(prompt, { responseMimeType: 'application/json' });
        } else {
            text = await callGeminiDynamic(config.gemini.model, prompt, { responseMimeType: 'application/json' });
        }
        return extractJson(text);
    } catch (e) {
        console.error('Translation failed:', e.message);
        return null;
    }
}

async function restore() {
    const url = `${config.wp.baseUrl}/posts?per_page=100&_embed`;
    const res = await fetch(url);
    const posts = await res.json();
    const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

    for (const post of posts) {
        let needsUpdate = false;
        let updateData = { id: post.id };

        // 1. Check for empty title
        if (!post.title.rendered || post.title.rendered.trim() === "" || post.slug.includes('article-')) {
            console.log(`Post ${post.id}: Title missing or placeholder found.`);

            // Try decoding slug
            let decodedTitle = "";
            try {
                if (post.slug.includes('%')) {
                    decodedTitle = decodeURIComponent(post.slug).replace(/-/g, ' ');
                }
            } catch (e) { }

            if (decodedTitle && decodedTitle.length > 5 && !decodedTitle.includes('article-')) {
                console.log(`  Restoring title from slug: ${decodedTitle}`);
                updateData.title = decodedTitle;
                needsUpdate = true;
            } else {
                console.log(`  Generating title from content...`);
                const title = await generateTitle(post.content.rendered);
                if (title) {
                    updateData.title = title;
                    needsUpdate = true;
                }
            }
        }

        // 2. Check for English content (heuristic: high density of Latin characters in content)
        const textOnly = post.content.rendered.replace(/<[^>]*>?/gm, '').slice(0, 500);
        const latinCount = (textOnly.match(/[a-zA-Z]/g) || []).length;
        if (latinCount > textOnly.length * 0.4 && textOnly.length > 50) {
            console.log(`Post ${post.id}: Possible English article detected.`);
            const result = await translateContent(post.content.rendered);
            if (result) {
                updateData.title = result.title;
                updateData.content = result.content;
                needsUpdate = true;
                console.log(`  Translated to Japanese.`);
            }
        }

        if (needsUpdate) {
            const updateUrl = `${config.wp.bridgeUrl}?action=posts&key=${config.wp.bridgeKey}`;
            const updateRes = await fetch(updateUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${WP_AUTH}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
            console.log(`  ${updateRes.ok ? '✅' : '❌'} Updated ${post.id}`);
        }

        // Wait a bit to avoid rate limits
        await new Promise(r => setTimeout(r, 2000));
    }
}

restore().catch(console.error);
