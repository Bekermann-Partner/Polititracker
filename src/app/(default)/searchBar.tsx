'use client'

import {findPolitician} from "@/_actions/findPolitician";
import React from "react";

export function SearchBar() {
    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.preventDefault();

        const results = await findPolitician(e.target.value);
        console.log(results);
    }

    return (
        <div className={"relative mt-4"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"
                 className={"h-6 mt-3.5 ml-3.5 absolute stroke-gray-50 opacity-80"}>
                <path
                    d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"/>
            </svg>
            <input onChange={handleChange}
                   className={"h-12 w-full border rounded-xl pl-14"}
                   type={"text"}
                   placeholder={"Marie Agnes Strack Zimmermann"}/>
        </div>
    )
}