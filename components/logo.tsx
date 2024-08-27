import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import localFont from "next/font/local";

const headingFont = localFont({
    src:"../public/fonts/font.woff2",
});

const Logo = () => {
  return (
    <Link href={"/"}>
        <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
            <Image alt="logo" height={30} width={30} src="/logo.svg"/>
            <p className={cn("text-lg text-neutral-700", headingFont.className)}>TrelloDev</p>
        </div>
    </Link>
  )
}

export default Logo;