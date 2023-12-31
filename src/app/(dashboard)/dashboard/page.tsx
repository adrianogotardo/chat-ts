import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function DashboardPage(): Promise<JSX.Element> {
    const session = await getServerSession(authOptions);
    return <pre>{JSON.stringify(session)}</pre>
}


