import { signIn, signOut } from "auth";
import { auth } from "auth";

export default async function Index() {
  const session = await auth();
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Welcome to Next.JS Example</h1>
      <p>This example demonstrates how to configure OpenPass with NextAuth plugin for Next.js.</p>
      <p>
        <a href="/protected">Click to view protected content.</a>
      </p>

      {session?.user ? (
        <div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}>
            <button>Sign Out</button>
          </form>
        </div>
      ) : (
        <div>
          <form
            action={async () => {
              "use server";
              await signIn("openpass");
            }}>
            <button>Sign in</button>
          </form>
        </div>
      )}

      {session?.user ? (
        <div className="w-full space-y-2 overflow-auto">
          <h2 className="text-xl font-bold">Current Session Data</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
}
