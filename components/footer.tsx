import Link from "next/link"
import { Github, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About W2C */}
          <div>
            <h3 className="text-red-500 font-bold text-lg mb-4">About W2C</h3>
            <p className="text-gray-400 mb-4">
              W2C is your trusted platform for finding high-quality replica products from verified sellers around the
              world.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-red-500 font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/sellers" className="text-gray-400 hover:text-white">
                  Sellers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/how-to" className="text-gray-400 hover:text-white">
                  How To
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-gray-400 hover:text-white">
                  Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-red-500 font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-red-500 font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">contact@w2c.ro</li>
              <li>
                <Link href="/discord" className="text-gray-400 hover:text-white">
                  Join Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2025 W2C.RO. All rights reserved</p>
          <p className="mt-4 max-w-4xl mx-auto text-xs">
            Disclaimer: Painy.Cash is not affiliated with Weidian.com, Taobao.com, 1688.com, tmall.com or any other
            shopping site ("platforms"). This website is not an official offer of those platforms.
          </p>
          <p className="mt-4 max-w-4xl mx-auto text-xs">
            Advertisement transparency: All shopping agent links, namely cnfans.com, achive.com, uabuy.com, wegobuy.com,
            superbuy.com, pandabuy.com, hagobuy.com, sugargoo.com, cssbuy.com, basetao.com, kameymall.com,
            hypebuyco.com, ezbuycn.com, hicustom.com, alichinabuy.com, ponyxbuy.com, spazmalibuy.com, hubbuyco.com,
            joysbuy.com, cshandji.com, oobuy.com, bilbuy.com, hagobuy.com, sfbuy.com, bongbuy.com, kakabuy.com,
            jogoobuy.com and flaobuy.com, are affiliate links for agents. This includes the price tag buttons, * tagged
            links and the links embedded in images. We do not get a commission for the sale of the item, only for their
            function as a freight forwarder.
          </p>
          <p className="mt-4 max-w-4xl mx-auto text-xs">
            All information disclosed on this page is disclosed "as is" and without any representation, warranty,
            implied or otherwise, regarding its accuracy or completeness and, in particular, with respect to the
            non-infringement of trademarks, patents, copyrights or any other intellectual property rights, or any other
            rights of third parties.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
