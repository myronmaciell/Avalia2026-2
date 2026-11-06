export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const data = await request.json();
        const id = 'char_' + Date.now();

        await env.DB.prepare(
            `INSERT INTO characters (id, discord_id, name, class, strength, dexterity, constitution, intelligence, wisdom, charisma) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
            id, data.discord_id, data.name, data.class,
            data.strength, data.dexterity, data.constitution,
            data.intelligence, data.wisdom, data.charisma
        ).run();

        return Response.json({ success: true, id });
    } catch (err) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const discord_id = url.searchParams.get("discord_id");

    const { results } = await env.DB.prepare(
        "SELECT * FROM characters WHERE discord_id = ?"
    ).bind(discord_id).all();

    return Response.json(results);
}