export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const { discord_id, username, dice_type, modifier } = await request.json();

        const faces = parseInt(dice_type.replace('d', ''));

        const rawRoll = Math.floor(Math.random() * faces) + 1;
        const mod = parseInt(modifier) || 0;
        const total = rawRoll + mod;

        await env.DB.prepare(
            `INSERT INTO audit_rolls (discord_id, username, dice_type, result, modifier, total) 
             VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(discord_id, username, dice_type, rawRoll, mod, total).run();

        return Response.json({ success: true, roll: rawRoll, modifier: mod, total });
    } catch (err) {
        return Response.json({ success: false, error: err.message }, { status: 500 });
    }
}