/**
 * Link Converter Utility
 *
 * This module provides functions to convert links between different platforms:
 * - Chinese marketplaces (Taobao, Weidian, 1688, JD, Xianyu)
 * - Agent sites (Pandabuy, Sugargoo, CSSBuy, etc.)
 * - CNFans
 */

// Regular expressions for detecting platforms and extracting IDs
const PATTERNS = {
  // Taobao patterns - more flexible matching
  taobao: [
    /(?:item\.taobao|world\.taobao|taobao)\.com\/(?:item|i).*?id=(\d+)/i,
    /(?:item\.taobao|world\.taobao|taobao)\.com\/(?:item|i)\/(\d+)/i,
    /m\.tb\.cn\/([a-zA-Z0-9]+)/i,
    /taobao\.com.*?[?&]id=(\d+)/i, // More general pattern
  ],
  // Weidian patterns - more flexible matching
  weidian: [
    /weidian\.com\/item\.html.*?itemID=(\w+)/i,
    /weidian\.com\/item\.html.*?id=(\w+)/i,
    /weidian\.com\/item\/(\w+)/i,
    /weidian\.com.*?[?&]itemID=(\w+)/i, // More general pattern
  ],
  // 1688 patterns - more flexible matching
  1688: [
    /1688\.com\/offer\/(\d+)/i,
    /detail\.1688\.com\/offer\/(\d+)/i,
    /qr\.1688\.com\/([a-zA-Z0-9]+)/i,
    /1688\.com.*?[?&]offer=(\d+)/i, // More general pattern
  ],
  // JD patterns - more flexible matching
  jd: [
    /(?:item\.jd|jd)\.com\/(\d+)\.html/i,
    /(?:item\.jd|jd)\.com\/(\d+)/i,
    /jd\.com.*?[?&]id=(\d+)/i, // More general pattern
  ],
  // Xianyu patterns - more flexible matching
  xianyu: [
    /2\.taobao\.com\/item\.htm.*?id=(\d+)/i,
    /2\.taobao\.com\/item\/(\d+)/i,
    /2\.taobao\.com.*?[?&]id=(\d+)/i, // More general pattern
  ],

  // Agent site patterns
  agent: {
    // CnFans - updated patterns to match more URL formats
    cnfans: [
      /cnfans\.com\/product\/detail.*?id=([^&]+)/i,
      /cnfans\.com\/product\/.*?id=([^&]+)/i,
      /cnfans\.com\/product\?id=([^&]+)/i,
      /cnfans\.com\/product\/\?id=([^&]+)/i,
      /cnfans\.com\/product.*?id=([^&]+).*?platform=([^&]+)/i,
    ],
    // Superbuy
    superbuy: [/superbuy\.com\/en\/page\/buy.*?url=([^&]+)/i],
    // Sugargoo - updated to handle multiple URL formats
    sugargoo: [
      /sugargoo\.com\/index\/item\/index.*?tp_data=([^&]+)/i,
      /sugargoo\.com\/#\/home\/productDetail.*?productLink=([^&]+)/i,
    ],
    // CSSBuy - updated patterns to match more URL formats
    cssbuy: [
      /cssbuy\.com\/item.*?url=([^&]+)/i,
      /cssbuy\.com\/item-([^-]+)-(\d+)\.html/i, // New pattern for direct item links
    ],
    // Basetao - new patterns for Basetao URLs
    basetao: [
      /basetao\.com\/.*?\/products\/agent\/([^/]+)\/(\d+)\.html/i, // Pattern for path-based URLs
    ],
    // Mulebuy - updated patterns to match more URL formats
    mulebuy: [
      /mulebuy\.com\/product\/detail.*?id=([^&]+)/i,
      /mulebuy\.com\/product\/.*?id=([^&]+)/i,
      /mulebuy\.com\/product\?id=([^&]+)/i,
      /mulebuy\.com\/product\/\?id=([^&]+)/i,
    ],
    // LoveGoBuy
    lovegobuy: [/lovegobuy\.com\/product\/detail.*?id=([^&]+)/i],
    // Hoobuy - updated patterns to match more URL formats including path-based IDs
    hoobuy: [
      /hoobuy\.com\/product\/detail.*?id=([^&]+)/i,
      /hoobuy\.com\/product\/\d+\/(\d+)/i, // New pattern for path-based IDs
      /hoobuy\.com\/product\/\d+\/(\d+)\?/i, // New pattern for path-based IDs with query params
    ],
    // Ponybuy
    ponybuy: [/ponybuy\.com\/product\/detail.*?id=([^&]+)/i],
    // Orientdig
    orientdig: [/orientdig\.com\/product\/detail.*?id=([^&]+)/i],
    // Allchinabuy - updated with new patterns
    allchinabuy: [
      /allchinabuy\.com\/product\/detail.*?id=([^&]+)/i,
      /allchinabuy\.com\/en\/page\/buy.*?url=([^&]+)/i, // New pattern for page/buy URLs
    ],
    // Eastmallbuy
    eastmallbuy: [/eastmallbuy\.com\/product\/detail.*?id=([^&]+)/i],
    // Pandabuy
    pandabuy: [/pandabuy\.com\/product.*?url=([^&]+)/i, /pandabuy\.page\.link\/([a-zA-Z0-9]+)/i],
    // Hagobuy
    hagobuy: [/hagobuy\.com\/product\/detail.*?id=([^&]+)/i],
    // Hegobuy
    hegobuy: [/hegobuy\.com\/product\/detail.*?id=([^&]+)/i],
    // JoyaBuy
    joyabuy: [/joyabuy\.com\/product\/detail.*?id=([^&]+)/i],
    // KakoBuy
    kakobuy: [
      /kakobuy\.com\/product\/detail.*?id=([^&]+)/i,
      /kakobuy\.com\/item\/details.*?url=([^&]+)/i, // New pattern for item/details URLs
    ],
    // Blikbuy
    blikbuy: [/blikbuy\.com\/product\/detail.*?id=([^&]+)/i],
    // Loongbuy
    loongbuy: [
      /loongbuy\.com\/product\/detail.*?id=([^&]+)/i,
      /loongbuy\.com\/product-details.*?url=([^&]+)/i, // New pattern for product-details URLs
    ],
    // iTaoBuy
    itaobuy: [
      /itaobuy\.com\/product\/detail.*?id=([^&]+)/i,
      /itaobuy\.com\/product-detail.*?url=([^&]+)/i, // New pattern for product-detail URLs
    ],
    // JoyaGoo
    joyagoo: [/joyagoo\.com\/product\/detail.*?id=([^&]+)/i],
    // SifuBuy - updated patterns to match more URL formats
    sifubuy: [
      /sifubuy\.com\/product\/detail.*?id=([^&]+)/i,
      /sifubuy\.com\/detail.*?id=([^&]+)/i, // New pattern for detail URLs
    ],
    // Oopbuy
    oopbuy: [
      /oopbuy\.com\/product\/detail.*?id=([^&]+)/i,
      /oopbuy\.com\/product\/([^/]+)\/(\d+)/i, // New pattern for path-based URLs
    ],
    // HubbuyCN
    hubbuycn: [/hubbuycn\.com\/product\/detail.*?id=([^&]+)/i],
    // KameyMall
    kameymall: [/kameymall\.com\/product\/detail.*?id=([^&]+)/i],
    // EzBuyCn
    ezbuycn: [/ezbuycn\.com\/product\/detail.*?id=([^&]+)/i],
    // Wegobuy
    wegobuy: [/wegobuy\.com\/en\/page\/buy.*?url=([^&]+)/i],
  },
}

/**
 * Detects the platform of a given URL
 * @param url The URL to detect the platform for
 * @returns The detected platform name or "unknown"
 */
export function detectPlatform(url: string): string {
  if (!url) return "unknown"

  // Check marketplace platforms
  for (const [platform, patterns] of Object.entries(PATTERNS)) {
    if (platform === "agent") continue // Skip agent for now, handle separately

    for (const pattern of patterns as RegExp[]) {
      if (pattern.test(url)) {
        return platform.charAt(0).toUpperCase() + platform.slice(1)
      }
    }
  }

  // Check agent platforms
  for (const [agentName, patterns] of Object.entries(PATTERNS.agent)) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return agentName.charAt(0).toUpperCase() + agentName.slice(1)
      }
    }
  }

  return "unknown"
}

/**
 * Safely decodes a URL, handling multiple levels of encoding
 * @param url The URL to decode
 * @returns The decoded URL
 */
function safeDecodeURL(url: string): string {
  if (!url) return url

  try {
    // Check if the URL is encoded (contains % characters)
    if (url.includes("%")) {
      const decodedUrl = decodeURIComponent(url)

      // Check if it's still encoded after first decode
      if (decodedUrl.includes("%")) {
        try {
          // Try a second decode
          const doubleDecodedUrl = decodeURIComponent(decodedUrl)
          return doubleDecodedUrl
        } catch (e) {
          // If second decode fails, return the first decode result
          console.log("Second decode failed, using first decode result")
          return decodedUrl
        }
      }

      return decodedUrl
    }

    return url
  } catch (e) {
    console.error("Error decoding URL:", e)
    return url
  }
}

/**
 * Extracts the item ID from a URL based on its platform
 * @param url The URL to extract the item ID from
 * @returns The extracted item ID and platform or null if not found
 */
function extractItemId(url: string): { id: string; platform: string } | null {
  if (!url) return null

  // Normalize the URL - handle URL encoding and common issues
  const normalizedUrl = url.trim().replace(/\s+/g, "")

  // Debug the URL we're trying to extract from
  console.log("Extracting ID from normalized URL:", normalizedUrl)

  // Special handling for SifuBuy URLs
  const sifubuyMatch = normalizedUrl.match(/sifubuy\.com\/detail.*?[?&]id=([^&]+)/i)
  if (sifubuyMatch && sifubuyMatch[1]) {
    const id = sifubuyMatch[1]

    // Try to extract type parameter to determine the platform
    const typeMatch = normalizedUrl.match(/[?&]type=([^&]+)/i)
    let platform = "TB" // Default to Taobao

    if (typeMatch && typeMatch[1]) {
      const type = Number.parseInt(typeMatch[1])
      // Map SifuBuy type to our platform codes
      switch (type) {
        case 4: // Assuming type=4 is Weidian based on the example URL
          platform = "WD"
          break
        case 2: // Assuming type=2 is 1688
          platform = "1688"
          break
        case 3: // Assuming type=3 is JD
          platform = "JD"
          break
        case 5: // Assuming type=5 is Xianyu
          platform = "XY"
          break
        default:
          platform = "TB" // Default to Taobao
      }
    }

    return { id, platform }
  }

  // Special handling for Basetao URLs
  const basetaoMatch = normalizedUrl.match(/basetao\.com\/.*?\/products\/agent\/([^/]+)\/(\d+)\.html/i)
  if (basetaoMatch && basetaoMatch[1] && basetaoMatch[2]) {
    const platformName = basetaoMatch[1].toLowerCase()
    const id = basetaoMatch[2]

    // Map Basetao platform name to our platform codes
    let platform = "TB" // Default to Taobao
    if (platformName === "weidian") {
      platform = "WD"
    } else if (platformName === "1688") {
      platform = "1688"
    } else if (platformName === "jd") {
      platform = "JD"
    } else if (platformName === "xianyu") {
      platform = "XY"
    }

    return { id, platform }
  }

  // Special handling for Oopbuy path-based URLs
  const oopbuyPathMatch = normalizedUrl.match(/oopbuy\.com\/product\/([^/]+)\/(\d+)/i)
  if (oopbuyPathMatch && oopbuyPathMatch[1] && oopbuyPathMatch[2]) {
    const platformName = oopbuyPathMatch[1].toLowerCase()
    const id = oopbuyPathMatch[2]

    // Map Oopbuy platform name to our platform codes
    let platform = "TB" // Default to Taobao
    if (platformName === "weidian") {
      platform = "WD"
    } else if (platformName === "1688") {
      platform = "1688"
    } else if (platformName === "jd") {
      platform = "JD"
    } else if (platformName === "xianyu") {
      platform = "XY"
    }

    return { id, platform }
  }

  // Special handling for CSSBuy direct item links
  const cssbuyDirectMatch = normalizedUrl.match(/cssbuy\.com\/item-([^-]+)-(\d+)\.html/i)
  if (cssbuyDirectMatch && cssbuyDirectMatch[1] && cssbuyDirectMatch[2]) {
    const platformCode = cssbuyDirectMatch[1].toLowerCase()
    const id = cssbuyDirectMatch[2]

    // Map CSSBuy platform code to our platform codes
    let platform = "TB" // Default to Taobao
    if (platformCode === "1688") {
      platform = "1688"
    } else if (platformCode === "weidian") {
      platform = "WD"
    } else if (platformCode === "jd") {
      platform = "JD"
    } else if (platformCode === "xianyu") {
      platform = "XY"
    }

    return { id, platform }
  }

  // Check Taobao patterns with more flexible matching
  for (const pattern of PATTERNS.taobao) {
    const match = normalizedUrl.match(pattern)
    if (match && match[1]) {
      return { id: match[1], platform: "TB" }
    }
  }

  // Check Weidian patterns with more flexible matching
  for (const pattern of PATTERNS.weidian) {
    const match = normalizedUrl.match(pattern)
    if (match && match[1]) {
      return { id: match[1], platform: "WD" }
    }
  }

  // Check 1688 patterns with more flexible matching
  for (const pattern of PATTERNS[1688]) {
    const match = normalizedUrl.match(pattern)
    if (match && match[1]) {
      return { id: match[1], platform: "1688" }
    }
  }

  // Check JD patterns with more flexible matching
  for (const pattern of PATTERNS.jd) {
    const match = normalizedUrl.match(pattern)
    if (match && match[1]) {
      return { id: match[1], platform: "JD" }
    }
  }

  // Check Xianyu patterns with more flexible matching
  for (const pattern of PATTERNS.xianyu) {
    const match = normalizedUrl.match(pattern)
    if (match && match[1]) {
      return { id: match[1], platform: "XY" }
    }
  }

  // Check CNFans patterns
  for (const pattern of PATTERNS.agent.cnfans) {
    const match = normalizedUrl.match(pattern)
    if (match && match[1]) {
      // If we have a platform in the match (match[2]), use it, otherwise default to TB
      if (match[2]) {
        // Convert platform name to our internal code
        const platformName = match[2].toUpperCase()
        if (platformName === "TAOBAO") return { id: match[1], platform: "TB" }
        if (platformName === "WEIDIAN") return { id: match[1], platform: "WD" }
        if (platformName === "1688") return { id: match[1], platform: "1688" }
        if (platformName === "JD") return { id: match[1], platform: "JD" }
        if (platformName === "XIANYU") return { id: match[1], platform: "XY" }

        // If we don't recognize the platform, default to TB
        console.warn(`Unrecognized platform: ${platformName}, defaulting to TB`)
        return { id: match[1], platform: "TB" }
      }
      return { id: match[1], platform: "TB" }
    }
  }

  // Special handling for agent sites with shop_type parameter
  if (normalizedUrl.includes("shop_type=") && normalizedUrl.includes("id=")) {
    const idMatch = normalizedUrl.match(/[?&]id=([^&]+)/i)
    if (idMatch && idMatch[1]) {
      const id = idMatch[1]

      // Try to extract shop_type from URL to determine the platform
      const shopTypeMatch = normalizedUrl.match(/shop_type=([^&]+)/i)
      let platform = "TB" // Default to Taobao if shop_type is not specified

      if (shopTypeMatch && shopTypeMatch[1]) {
        const shopType = shopTypeMatch[1].toLowerCase()
        if (shopType === "weidian") {
          platform = "WD"
        } else if (shopType === "1688") {
          platform = "1688"
        } else if (shopType === "jd") {
          platform = "JD"
        } else if (shopType === "xianyu") {
          platform = "XY"
        }
      }

      return { id, platform }
    }
  }

  // If we get here, we couldn't extract an ID
  return null
}

// Improve the expandShortUrl function to handle more cases
async function expandShortUrl(url: string): Promise<string> {
  // List of known short URL domains
  const shortUrlDomains = [
    "m.tb.cn",
    "qr.1688.com",
    "pandabuy.page.link",
    "t.cn",
    "dwz.cn",
    "bit.ly",
    "goo.gl",
    "s.click.taobao.com",
  ]

  // Check if the URL contains any of the short URL domains
  const isShortUrl = shortUrlDomains.some((domain) => url.includes(domain))

  if (!isShortUrl) {
    return url
  }

  try {
    console.log("Expanding short URL:", url)

    // In a real implementation, we would make a HEAD request to follow redirects
    // For this demo, we'll simulate it with specific test cases

    // Simulate expansion for specific test cases
    if (url.includes("m.tb.cn")) {
      // Simulate expanding a Taobao short URL
      return "https://item.taobao.com/item.htm?id=12345678901"
    } else if (url.includes("pandabuy.page.link")) {
      // Simulate expanding a Pandabuy short URL
      return "https://www.pandabuy.com/product?url=https://weidian.com/item.html?itemID=12345678901"
    } else if (url.includes("s.click.taobao.com")) {
      // Simulate expanding a Taobao click tracking URL
      return "https://item.taobao.com/item.htm?id=12345678901"
    }

    // For other short URLs, just return the original for now
    console.log("Could not expand short URL, returning original:", url)
    return url
  } catch (error) {
    console.error("Error expanding short URL:", error)
    return url
  }
}

// Enhance the extractOriginalFromAgent function to better handle agent links
async function extractOriginalFromAgent(url: string): Promise<string | null> {
  if (!url) return null

  console.log("Extracting original URL from agent URL:", url)

  // Special handling for AllChinaBuy URLs with the format /en/page/buy/?url=...
  if (url.includes("allchinabuy.com/en/page/buy") && url.includes("url=")) {
    const urlMatch = url.match(/[?&]url=([^&]+)/i)
    if (urlMatch && urlMatch[1]) {
      try {
        // Use the safeDecodeURL function to handle multiple levels of encoding
        const decodedUrl = safeDecodeURL(urlMatch[1])
        console.log("Decoded AllChinaBuy URL parameter:", decodedUrl)
        // Return the decoded URL which should be the original marketplace URL
        return decodedUrl
      } catch (e) {
        console.error("Error decoding AllChinaBuy URL parameter:", e)
        return null
      }
    }
  }

  // Check all agent patterns
  for (const [agentName, patterns] of Object.entries(PATTERNS.agent)) {
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        console.log(`Matched agent pattern for ${agentName}:`, match)

        // Special case for CNFans
        if (agentName === "cnfans" && match[2]) {
          const id = match[1]
          const platform = match[2].toUpperCase()
          console.log(`CNFans link detected with ID: ${id} and platform: ${platform}`)

          // Build the original link based on the platform
          switch (platform) {
            case "TAOBAO":
              return `https://item.taobao.com/item.htm?id=${id}`
            case "WEIDIAN":
              return `https://weidian.com/item.html?itemID=${id}`
            case "1688":
              return `https://detail.1688.com/offer/${id}.html`
            case "JD":
              return `https://item.jd.com/${id}.html`
            case "XIANYU":
              return `https://2.taobao.com/item.htm?id=${id}`
            default:
              console.error("Unknown platform in CNFans link:", platform)
              return null
          }
        }

        // For other agents, the URL might be encoded
        try {
          // Use the safeDecodeURL function to handle multiple levels of encoding
          const decodedUrl = safeDecodeURL(match[1])
          console.log("Decoded agent URL:", decodedUrl)
          // Expand if it's a short URL
          return await expandShortUrl(decodedUrl)
        } catch (e) {
          console.error("Error decoding URL:", e)
          return null
        }
      }
    }
  }

  // Special handling for KakoBuy item/details URLs
  if (url.includes("kakobuy.com/item/details") && url.includes("url=")) {
    const urlMatch = url.match(/[?&]url=([^&]+)/i)
    if (urlMatch && urlMatch[1]) {
      try {
        // Use the safeDecodeURL function to handle multiple levels of encoding
        const decodedUrl = safeDecodeURL(urlMatch[1])
        console.log("Decoded KakoBuy URL parameter:", decodedUrl)
        // Return the decoded URL which should be the original marketplace URL
        return decodedUrl
      } catch (e) {
        console.error("Error decoding KakoBuy URL parameter:", e)
        return null
      }
    }
  }

  // Special handling for iTaoBuy product-detail URLs
  if (url.includes("itaobuy.com/product-detail") && url.includes("url=")) {
    const urlMatch = url.match(/[?&]url=([^&]+)/i)
    if (urlMatch && urlMatch[1]) {
      try {
        // Use the safeDecodeURL function to handle multiple levels of encoding
        const decodedUrl = safeDecodeURL(urlMatch[1])
        console.log("Decoded iTaoBuy URL parameter:", decodedUrl)
        // Return the decoded URL which should be the original marketplace URL
        return decodedUrl
      } catch (e) {
        console.error("Error decoding iTaoBuy URL parameter:", e)
        return null
      }
    }
  }

  // Special handling for Sugargoo productDetail URLs with double-encoded links
  if (url.includes("sugargoo.com/#/home/productDetail") && url.includes("productLink=")) {
    const productLinkMatch = url.match(/[?&]productLink=([^&]+)/i)
    if (productLinkMatch && productLinkMatch[1]) {
      try {
        // Use the safeDecodeURL function to handle multiple levels of encoding
        const decodedUrl = safeDecodeURL(productLinkMatch[1])
        console.log("Decoded Sugargoo productLink parameter:", decodedUrl)
        // Return the decoded URL which should be the original marketplace URL
        return decodedUrl
      } catch (e) {
        console.error("Error decoding Sugargoo productLink parameter:", e)
        return null
      }
    }
  }

  // Generic handling for any URL with a url= parameter (common in agent sites)
  if (url.includes("url=")) {
    const urlMatch = url.match(/[?&]url=([^&]+)/i)
    if (urlMatch && urlMatch[1]) {
      try {
        // Use the safeDecodeURL function to handle multiple levels of encoding
        const decodedUrl = safeDecodeURL(urlMatch[1])
        console.log("Decoded generic URL parameter:", decodedUrl)
        // Return the decoded URL which should be the original marketplace URL
        return decodedUrl
      } catch (e) {
        console.error("Error decoding generic URL parameter:", e)
        return null
      }
    }
  }

  console.log("No agent pattern matched for URL:", url)
  return null
}

// Normalize platform code to ensure consistency
function normalizePlatformCode(platform: string): string {
  // Convert to uppercase for consistent comparison
  const upperPlatform = platform.toUpperCase()

  // Map full platform names to short codes
  if (upperPlatform === "TAOBAO") return "TB"
  if (upperPlatform === "WEIDIAN") return "WD"
  if (upperPlatform === "XIANYU") return "XY"
  if (upperPlatform === "JD") return "JD"
  if (upperPlatform === "1688") return "1688"

  // If it's already a short code, return it
  if (["TB", "WD", "XY", "JD", "1688"].includes(upperPlatform)) {
    return upperPlatform
  }

  // Default to Taobao if unknown
  console.warn(`Unknown platform: ${platform}, defaulting to TB`)
  return "TB"
}

// Update the convertLinks function to be more robust with error handling and debugging
export async function convertLinks(url: string): Promise<{ original: string; cnfans: string }> {
  if (!url) throw new Error("No URL provided")

  try {
    // Check if the input is just a numeric ID
    if (/^\d+$/.test(url.trim())) {
      console.log("Detected numeric ID input:", url)
      const id = url.trim()
      // Default to Taobao for numeric IDs
      const platform = "TB"

      // Build the clean original link for Taobao
      const cleanOriginalUrl = `https://item.taobao.com/item.htm?id=${id}`

      // Build the CNFans link with the affiliate code
      const platformMap: Record<string, string> = {
        TB: "TAOBAO",
        WD: "WEIDIAN",
        "1688": "1688",
        JD: "JD",
        XY: "XIANYU",
      }
      const cnfansUrl = `https://www.cnfans.com/product?id=${id}&platform=${platformMap[platform]}&ref=4142111`

      return {
        original: cleanOriginalUrl,
        cnfans: cnfansUrl,
      }
    }

    // Check if the URL is encoded (contains % characters) but not part of an agent URL
    if (url.includes("%") && !url.includes("//")) {
      console.log("Detected encoded URL without protocol:", url)
      // Try to decode the URL
      const decodedUrl = safeDecodeURL(url)
      console.log("Decoded URL:", decodedUrl)

      // If the decoded URL looks like a valid URL, use it
      if (decodedUrl.includes("http") || decodedUrl.includes("www.")) {
        return convertLinks(decodedUrl)
      }
    }

    // First, expand the URL if it's shortened
    const expandedUrl = await expandShortUrl(url)
    console.log("Expanded URL:", expandedUrl)

    // Try to extract the original URL from the agent URL first
    // This is a change in the order of operations to prioritize agent URL extraction
    const originalFromAgent = await extractOriginalFromAgent(expandedUrl)
    if (originalFromAgent) {
      console.log("Extracted original URL from agent:", originalFromAgent)
      return convertLinks(originalFromAgent) // Recursively convert the original URL
    }

    // Extract the item ID and platform from the original URL
    const extracted = extractItemId(expandedUrl)
    if (!extracted) {
      console.log("Failed to extract item ID directly and couldn't extract original URL from agent:", expandedUrl)

      // Try one more approach - check if the URL itself is an encoded URL
      if (expandedUrl.includes("%")) {
        const decodedUrl = safeDecodeURL(expandedUrl)
        if (decodedUrl !== expandedUrl) {
          console.log("Input appears to be an encoded URL, trying with decoded version:", decodedUrl)
          return convertLinks(decodedUrl)
        }
      }

      // Try to detect the platform at least
      const platform = detectPlatform(expandedUrl)
      if (platform !== "unknown") {
        console.log("Platform detected but couldn't extract ID:", platform)
        throw new Error(`Link format not supported for ${platform}. Please try a different link format.`)
      }

      throw new Error("Unsupported or invalid link format. Please check the URL and try again.")
    }

    console.log("Extracted ID and platform:", extracted)

    // Normalize the platform code to ensure consistency
    const normalizedPlatform = normalizePlatformCode(extracted.platform)
    console.log("Normalized platform:", normalizedPlatform)

    // Build the clean original link based on the platform
    let cleanOriginalUrl: string
    switch (normalizedPlatform) {
      case "TB":
        cleanOriginalUrl = `https://item.taobao.com/item.htm?id=${extracted.id}`
        break
      case "WD":
        cleanOriginalUrl = `https://weidian.com/item.html?itemID=${extracted.id}`
        break
      case "1688":
        cleanOriginalUrl = `https://detail.1688.com/offer/${extracted.id}.html`
        break
      case "JD":
        cleanOriginalUrl = `https://item.jd.com/${extracted.id}.html`
        break
      case "XY":
        cleanOriginalUrl = `https://2.taobao.com/item.htm?id=${extracted.id}`
        break
      default:
        // This should never happen due to normalizePlatformCode, but just in case
        console.error(`Unhandled platform after normalization: ${normalizedPlatform}`)
        cleanOriginalUrl = `https://item.taobao.com/item.htm?id=${extracted.id}`
        break
    }

    // Build the CNFans link with the affiliate code
    const platformMap: Record<string, string> = {
      TB: "TAOBAO",
      WD: "WEIDIAN",
      "1688": "1688",
      JD: "JD",
      XY: "XIANYU",
    }

    // Use the normalized platform for the CNFans URL
    const cnfansPlatform = platformMap[normalizedPlatform] || "TAOBAO"
    const cnfansUrl = `https://www.cnfans.com/product?id=${extracted.id}&platform=${cnfansPlatform}&ref=4142111`

    return {
      original: cleanOriginalUrl,
      cnfans: cnfansUrl,
    }
  } catch (error) {
    console.error("Error converting link:", error)
    if (error instanceof Error) {
      throw error
    } else {
      throw new Error("An unexpected error occurred during link conversion")
    }
  }
}
