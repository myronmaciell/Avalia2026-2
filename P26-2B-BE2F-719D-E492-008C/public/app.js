let currentUser = null;

function calculateModifier(value) {
    return Math.floor((parseInt(value) - 10) / 2);
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logged') === 'true') {
        currentUser = {
            id: urlParams.get('id'),
            name: urlParams.get('name'),
            avatar: urlParams.get('avatar')
        };
        localStorage.setItem('discord_user', JSON.stringify(currentUser));
        window.history.replaceState({}, document.title, "/");
    } else {
        const saved = localStorage.getItem('discord_user');
        if (saved) currentUser = JSON.parse(saved);
    }

    if (currentUser) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('user-section').innerHTML += `<span>Logado como: <strong>${currentUser.name}</strong></span>`;
    }
});

document.getElementById('char-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return alert('Faça login com o Discord primeiro!');

    const payload = {
        discord_id: currentUser.id,
        name: document.getElementById('char-name').value,
        class: document.getElementById('char-class').value,
        strength: parseInt(document.getElementById('attr-str').value),
        dexterity: parseInt(document.getElementById('attr-dex').value),
        constitution: parseInt(document.getElementById('attr-con').value),
        intelligence: parseInt(document.getElementById('attr-int').value),
        wisdom: parseInt(document.getElementById('attr-wis').value),
        charisma: parseInt(document.getElementById('attr-cha').value),
    };

    const res = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
        alert('Personagem salvo com sucesso no Cloudflare D1!');
    } else {
        alert('Erro ao salvar: ' + data.error);
    }
});

async function rollDice(diceType) {
    if (!currentUser) return alert('Faça login para rolar os dados!');
    
    const strVal = document.getElementById('attr-str').value || 10;
    const modifier = calculateModifier(strVal);

    const res = await fetch('/api/roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            discord_id: currentUser.id,
            username: currentUser.name,
            dice_type: diceType,
            modifier: modifier
        })
    });

    const data = await res.json();
    if (data.success) {
        document.getElementById('roll-result').innerHTML = `
            <p>Dado: <strong>${diceType}</strong> | Rolagem Pura: <strong>${data.roll}</strong> | Modificador: <strong>${data.modifier >= 0 ? '+' + data.modifier : data.modifier}</strong></p>
            <p>Resultado Total: <strong>${data.total}</strong> (Auditado com sucesso)</p>
        `;
    }
}