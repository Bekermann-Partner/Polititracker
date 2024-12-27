import React from "react";
import {Header} from "@/app/(default)/header";
import {Footer} from "@/app/(default)/footer";

export default function layout({children}: {children: React.ReactNode}) {
    return (
        <>
            <Header/>

            {children}

            <Footer/>
        </>
    )
}