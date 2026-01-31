"use client";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-6 border  bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-black-700 text-center">Login to SmartTrade Hub</h2>

            <form className="flex flex-col gap-4 text-black">
                <input
                    type="email"
                    placeholder="Email"
                    className=" px-3 border rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className=" px-3 py-2 border rounded"
                />
                <button className="bg-black text-white py-2 rounded-xl"
                >Login
                </button>
            </form>
        </div>
    </main>
  );
}