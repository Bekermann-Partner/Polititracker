import {cookies} from "next/headers";
import {USER_SESSION_COOKIE_NAME} from "@/app/auth/config";
import {permanentRedirect} from "next/navigation";

export async function GET() {
    const cookieStore = await cookies();
    cookieStore.delete(USER_SESSION_COOKIE_NAME);

    // TODO: this needs to be fixed that the sign-out is actually properly displayed to the user. 
    return permanentRedirect("/");
}