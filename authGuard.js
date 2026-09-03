// Prüft beim Laden der Seite, ob eine gültige Session existiert,
// und optional, ob die Rolle passt (REQUIRED_ROLE muss vor diesem Script gesetzt sein).

async function checkSession() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        window.location.href = "login.html";
        return null;
    }

    if (typeof REQUIRED_ROLE !== "undefined") {
        const userId = data.session.user.id;

        const { data: profile, error: profileError } = await supabaseClient
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (profileError || !profile || profile.role !== REQUIRED_ROLE) {
            window.location.href = "album.html";
            return null;
        }
    }

    return data.session;
}

const sessionPromise = checkSession();