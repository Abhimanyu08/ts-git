import { createHash } from "crypto";
import { readFileSync, readdirSync, statSync, } from "fs";
import path, { resolve } from "path";
import { FileTree, treeToFiles } from "../filecommands";

export function add(paths: string[]) {


    // on add
    //1. git computes the hash of all the files using their content
    //2. stores them in .git/objects folder
    //3. writes the hash of the files along with filenames to .git/index
    let files: Set<string> = new Set()

    const addFiles = (folderPath: string) => {
        const absolutePath = resolve(folderPath)
        const filesAndFolders = readdirSync(folderPath)
        for (let objectName of filesAndFolders) {
            if (objectName === ".tsgit") continue
            const fullName = `${absolutePath}/${objectName}`
            if (statSync(fullName).isFile()) {

                files.add(fullName)
                continue
            }

            addFiles(fullName)
        }
    }

    for (let path of paths) {
        addFiles(path)
    }

    const objects: Record<string, FileTree> = {}
    let indexString = ""
    for (let file of Array.from(files)) {
        const content = readFileSync(file)
        const hash = calculateHash(content)

        //we use first two letters of hash as folder name and rest of the hash as filename to store the contents in objects dir
        const hashFolder = hash.slice(0, 2)
        const hashFilename = hash.slice(2,)


        objects[hashFolder] = {
            [hashFilename]: content.toString()
        }

        indexString += `${file}\t${hash}\n`

    }
    const treeToWrite: FileTree = {
        ".tsgit": {
            objects,
            index: indexString
        }
    }


    treeToFiles({ fileTree: treeToWrite })
}



function calculateHash(content: Buffer) {
    const shasum = createHash("sha256")
    shasum.update(content)
    return shasum.digest('hex').slice(0, 8)
}