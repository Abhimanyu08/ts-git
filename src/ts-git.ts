#! /usr/local/bin/node


import { exit } from "process";
import * as funcs from "./gitcommands";


const arg = process.argv[2]

if (!Object.hasOwn(funcs, arg)) {
    console.log("bad")
    exit(0)
}

const command = arg as keyof typeof funcs

funcs[command]()


