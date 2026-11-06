export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    const CLIENT_ID = env.DISCORD_CLIENT_ID;
    const CLIENT_SECRET = env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = `${url.origin}/auth/discord`;

    if (!code) {
        const discordLoginUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
        return Response.redirect(discordLoginUrl, 302);
    }

    try {
        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const tokenData = await tokenRes.json();

        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const userData = await userRes.json();

        await env.DB.prepare(
            `INSERT INTO users (discord_id, username, avatar) VALUES (?, ?, ?) 
             ON CONFLICT(discord_id) DO UPDATE SET username = excluded.username, avatar = excluded.avatar`
        ).bind(userData.id, userData.username, userData.avatar).run();

        return Response.redirect(`/?logged=true&id=${userData.id}&name=${encodeURIComponent(userData.username)}&avatar=${userData.avatar}`, 302);
    } catch (err) {
        return new Response("Erro na Autenticação: " + err.message, { status: 500 });
    }
}