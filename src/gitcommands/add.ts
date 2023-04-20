import { createHash } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";
import { FileTree, treeToFiles } from "../filecommands";

export function add(files: string[]) {


    // on add
    //1. git computes the hash of all the files using their content
    //2. stores them in .git/objects folder
    //3. writes the hash of the files along with filenames to .git/index

    for (let file of files) {
        const resolvedFileName = resolve(file)
        const content = readFileSync(resolvedFileName)
        const hash = calculateHash(content)

        //we use first two letters of hash as folder name and rest of the hash as filename to store the contents in objects dir
        const hashFolder = hash.slice(0, 2)
        const hashFilename = hash.slice(2,)

        const treeToWrite: FileTree = {
            ".tsgit": {
                "objects": {
                    [hashFolder]: {
                        [hashFilename]: content.toString()
                    }
                }
            }
        }

        treeToFiles({ fileTree: treeToWrite })

    }

}


const shasum = createHash("sha256")

function calculateHash(content: Buffer) {
    shasum.update(content)
    return shasum.digest('hex').slice(0, 8)
}