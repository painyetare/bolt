"use server"

// Translation service using DeepL API
export async function translateText(text: string, targetLang: string, sourceLang?: string) {
  try {
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY

    if (!DEEPL_API_KEY) {
      console.warn("DeepL API key not found, using fallback translation")
      return fallbackTranslate(text, targetLang)
    }

    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang.toUpperCase(),
        source_lang: sourceLang?.toUpperCase(),
        preserve_formatting: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`DeepL API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.translations[0].text
  } catch (error) {
    console.error("Translation error:", error)
    return fallbackTranslate(text, targetLang)
  }
}

// Fallback translation function when DeepL API is not available
function fallbackTranslate(text: string, targetLang: string): string {
  // Simple English to Chinese translations for common phrases
  const enToCh: Record<string, string> = {
    hello: "你好",
    hi: "嗨",
    "thank you": "谢谢",
    thanks: "谢谢",
    "good morning": "早上好",
    "good afternoon": "下午好",
    "good evening": "晚上好",
    goodbye: "再见",
    bye: "拜拜",
    yes: "是的",
    no: "不是",
    ok: "好的",
    please: "请",
    sorry: "对不起",
    "excuse me": "打扰了",
    "how are you": "你好吗",
    "i am fine": "我很好",
    welcome: "欢迎",
    "nice to meet you": "很高兴认识你",
    "what is your name": "你叫什么名字",
    "my name is": "我的名字是",
    "i don't understand": "我不明白",
    "can you help me": "你能帮我吗",
    "how much is this": "这个多少钱",
    "where is": "在哪里",
    when: "什么时候",
    why: "为什么",
    who: "谁",
    which: "哪个",
    what: "什么",
    how: "怎么样",
  }

  // Simple Chinese to English translations
  const chToEn: Record<string, string> = {
    你好: "hello",
    嗨: "hi",
    谢谢: "thank you",
    早上好: "good morning",
    下午好: "good afternoon",
    晚上好: "good evening",
    再见: "goodbye",
    拜拜: "bye",
    是的: "yes",
    不是: "no",
    好的: "ok",
    请: "please",
    对不起: "sorry",
    打扰了: "excuse me",
    你好吗: "how are you",
    我很好: "i am fine",
    欢迎: "welcome",
    很高兴认识你: "nice to meet you",
    你叫什么名字: "what is your name",
    我的名字是: "my name is",
    我不明白: "i don't understand",
    你能帮我吗: "can you help me",
    这个多少钱: "how much is this",
    在哪里: "where is",
    什么时候: "when",
    为什么: "why",
    谁: "who",
    哪个: "which",
    什么: "what",
    怎么样: "how",
    收到您的消息: "I received your message",
    我会尽快回复: "I will respond as soon as possible",
  }

  if (targetLang.toLowerCase() === "zh") {
    // English to Chinese
    let result = text.toLowerCase()

    // Replace phrases (longest first to avoid partial matches)
    const phrases = Object.keys(enToCh).sort((a, b) => b.length - a.length)
    for (const phrase of phrases) {
      const regex = new RegExp(`\\b${phrase}\\b`, "gi")
      result = result.replace(regex, enToCh[phrase])
    }

    // If no translation happened, add a prefix
    if (result === text.toLowerCase()) {
      return `[中文: ${text}]`
    }

    return result
  } else {
    // Chinese to English
    let result = text

    // Replace phrases
    const phrases = Object.keys(chToEn).sort((a, b) => b.length - a.length)
    for (const phrase of phrases) {
      result = result.replace(new RegExp(phrase, "g"), chToEn[phrase])
    }

    // If no translation happened, add a prefix
    if (result === text) {
      return `[English: ${text}]`
    }

    return result
  }
}

// Detect language of text
export function detectLanguage(text: string): string {
  // Simple language detection based on character sets
  const chineseRegex = /[\u4e00-\u9fff]/
  const japaneseRegex = /[\u3040-\u30ff]/
  const koreanRegex = /[\uac00-\ud7af]/
  const cyrillicRegex = /[\u0400-\u04ff]/

  if (chineseRegex.test(text)) return "zh"
  if (japaneseRegex.test(text)) return "ja"
  if (koreanRegex.test(text)) return "ko"
  if (cyrillicRegex.test(text)) return "ru"

  // Default to English
  return "en"
}
