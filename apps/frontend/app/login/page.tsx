import Image from 'next/image';
import LoginForm from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex justify-center mb-4">
          <Image src="/mantestock-logo.png" alt="ManteStock" width={180} height={138} priority />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-6 text-center">Iniciar sesión</h1>
        <LoginForm />
      </div>
    </main>
  );
}
