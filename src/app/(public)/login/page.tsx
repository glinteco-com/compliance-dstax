import { LoginForm } from '@/app/(public)/login/login-form'

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#292929]">
      {/* Background patterns simulating the waves */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <svg
          className="preserve-3d h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Wave paths based on a generic wave pattern */}
          <path
            d="M0 200 C 400 400, 1000 0, 1440 200 L 1440 800 L 0 800 Z"
            fill="#3a3a3a"
          />
          <path
            d="M0 400 C 500 600, 900 100, 1440 400 L 1440 800 L 0 800 Z"
            fill="#4a4a4a"
          />
          <path
            d="M0 600 C 600 800, 800 300, 1440 600 L 1440 800 L 0 800 Z"
            fill="#1f1f1f"
          />
          {/* Angled stripes in the background mimicking the user's image */}
          <path
            d="M-200 800 L800 -200 L900 -200 L-100 800 Z"
            fill="#505050"
            opacity="0.3"
          />
          <path
            d="M0 1000 L1000 0 L1100 0 L100 1000 Z"
            fill="#404040"
            opacity="0.3"
          />
          <path
            d="M200 1200 L1200 200 L1300 200 L300 1200 Z"
            fill="#606060"
            opacity="0.2"
          />
          <path
            d="M-400 600 L600 -400 L700 -400 L-300 600 Z"
            fill="#353535"
            opacity="0.4"
          />
        </svg>
      </div>

      <div className="z-10 w-full px-4">
        <LoginForm />
      </div>

      <div className="pointer-events-none absolute right-0 bottom-4 left-0 z-10 text-center">
        <span className="text-xs text-gray-400">Version</span>
      </div>
    </main>
  )
}
