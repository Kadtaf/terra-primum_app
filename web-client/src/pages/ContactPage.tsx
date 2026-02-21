export default function ContactPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
        <h1 className="text-4xl font-bold">Contact</h1>

        <p className="text-muted">
            Une question ? Une demande ? Nous sommes là pour vous aider.
        </p>

        <form className="card p-6 space-y-4 max-w-xl">
            <input
            type="text"
            placeholder="Votre nom"
            className="w-full px-4 py-2 border border-border rounded-lg"
            />

            <input
            type="email"
            placeholder="Votre email"
            className="w-full px-4 py-2 border border-border rounded-lg"
            />

            <textarea
            placeholder="Votre message"
            className="w-full px-4 py-2 border border-border rounded-lg h-32"
            />

            <button className="btn btn-primary w-full">Envoyer</button>
        </form>
        </div>
    );
}