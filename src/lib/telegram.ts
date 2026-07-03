import "server-only";

const clean = (v?: string) => (v || "").replace(/\\n$/, "").trim();

// Fire-and-forget operator notification to the Telegram chat. No-op if the bot
// token / chat id aren't configured, and never throws — notifications must not
// break the request that triggered them.
export async function notifyTelegram(text: string): Promise<void> {
  const token = clean(process.env.TELEGRAM_BOT_TOKEN);
  const chatId = clean(process.env.TELEGRAM_CHAT_ID);
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch {
    /* ignore — best effort */
  }
}
