
"use client";
import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebaseClient";
import { getToken, deleteToken, onMessage } from "firebase/messaging";

export default function ReceiverPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  // Foreground listener
  useEffect(() => {
    if (!messaging) return;
    const unsub = onMessage(messaging, (payload) => {
      alert(`${payload.notification?.title} - ${payload.notification?.body}`);
    });
    return () => unsub();
  }, []);

  // Every refresh → delete old token + generate new
  useEffect(() => {
    const saved = localStorage.getItem("user_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setName(parsed.name || "");
      setEmail(parsed.email || "");

      (async () => {
        try {
          // 🔹 Force delete old token
          await deleteToken(messaging);

          // 🔹 Get new token
          const newToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });

          if (newToken) {
            setToken(newToken);

            // Update localStorage
            localStorage.setItem(
              "user_data",
              JSON.stringify({ ...parsed, token: newToken })
            );

            // Send to backend (3000)
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/save-token`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: parsed.name,
                email: parsed.email,
                token: newToken,
              }),
            });
          }
        } catch (err) {
          console.error("Token refresh error:", err);
        }
      })();
    }
  }, []);

  // First-time register
  async function register() {
    if (!name) return alert("Enter your name");

    try {
      // Always clear old token
      await deleteToken(messaging);

      const newToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      setToken(newToken);

      // Save to backend
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/save-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, token: newToken }),
      });

      // Save to localStorage
      localStorage.setItem(
        "user_data",
        JSON.stringify({ name, email, token: newToken })
      );

      alert("✅ Registered & Token Saved");
    } catch (err) {
      console.error("Registration error:", err);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1 className="font-bold">Receiver </h1>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={register} className="px-3 py-1 font-bold cursor-pointer bg-blue-400 hover:bg-blue-300 rounded-3xl"> Login</button>
      <div>
        <strong>Token:</strong> {token}
      </div>
    </main>
  );
}

