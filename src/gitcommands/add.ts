import { createHash } from "crypto";
import { existsSync, readFileSync, readdirSync, statSync, } from "fs";
import { cwd, exit } from "process";
import { calculateHash, getTsgitRootPath, isInsideWorkingDirectory } from "../utils";
import { FileTree, treeToFiles } from "../filecommands";
import { resolve } from "path";

export function add(paths: string[]) {


    // on add
    //1. git computes the hash of all the files using their content
    //2. stores them in .git/objects folder
    //3. writes the hash of the files along with filenames to .git/index
    const tsgitRootPath = getTsgitRootPath(cwd())
    if (!tsgitRootPath) {
        console.log("Not a tsgit repository")
        exit(1)
    }


    let files: Set<string> = new Set()

    const addFiles = (path: string) => {
        if (!isInsideWorkingDirectory({ pathToCheck: resolve(path), rootDirPath: tsgitRootPath })) {
            console.log(`${path} isn't inside a tsgit repository`)
            return
        }
        const filesAndFolders = readdirSync(path)
        for (let objectName of filesAndFolders) {
            if (objectName === ".tsgit") continue
            const fullName = `${path}/${objectName}`
            if (statSync(fullName).isFile()) {

                files.add(fullName)
                continue
            }

            addFiles(fullName)
        }
    }

    for (let path of paths) {
        if (!existsSync(path)) {
            console.log(`${path} doesn't exist`)
            continue
        }
        if (statSync(path).isFile()) {
            files.add(path)
            continue
        }
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



