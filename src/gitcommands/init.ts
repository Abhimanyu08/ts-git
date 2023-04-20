import { existsSync, mkdirSync } from "fs";
import { cwd, exit } from "process";
import { treeToFiles } from "../filecommands";

export function init() {

    const currentWorkingDir = cwd()
    // init doesn't take in any arguments. It just initializes a .tsgit folder with following structure (if the cwd doesn't already have one)
    // .git
    //    objects -empty folder
    //    HEAD -file
    //    refs
    //      heads -empty folder

    if (existsSync(`${currentWorkingDir}/.tsgit`)) {
        console.log("already a tsgit repository")
        exit(0)
    }

    treeToFiles({
        fileTree: {
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


