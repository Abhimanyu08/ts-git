import { existsSync, mkdirSync } from "fs";
import { cwd, exit } from "process";
import { createFiles } from "../filecommands";

export function init() {

    const currentWorkingDir = cwd()
    // init doesn't take in any arguments. It just initializes a .git folder with following structure (if the cwd doesn't already have one)
    // .git
    //    objects -empty folder
    //    HEAD -file
    //    refs
    //      heads -empty folder


    createFiles({
        rootPath: currentWorkingDir,
        structure: {
            ".tsgit": {
                "objects": {},
                "HEAD": "ref: refs/heads/master",
                "refs": {
                    "heads": {}
                }
            }
        }
    })

    console.log("tsgit repository initialized")

}


