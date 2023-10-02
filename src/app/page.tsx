import Link from "next/link"
import Button from "@/components/ui/Button"

export default async function Home() {
  
  return (
    <Link href="/login">
        <Button size="lg" variant="default">go to /login</Button>
    </Link>
  )
}
