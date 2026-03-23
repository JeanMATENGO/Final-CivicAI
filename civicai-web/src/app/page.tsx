import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold text-civic-info">CivicAI</h1>
        <p className="text-gray-600 text-lg">
          La plateforme intelligente pour la sécurité et le développement citoyen en République Démocratique du Congo.
        </p>
        
        <div className="grid grid-cols-1 gap-4 pt-10">
          <Link href="/login" className="bg-civic-info text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition shadow-lg">
            Se connecter
          </Link>
          <Link href="/register" className="border-2 border-civic-info text-civic-info py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
