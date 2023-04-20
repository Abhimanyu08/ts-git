// We'd be fiddling with the filesystem extensively. So it's better to write down some helper functions which make
// creating folders, files, and writing content to that file easy.

import { cwd } from "process"
import { existsSync, mkdirSync, write } from "fs"
import { writeFile } from "fs/promises"

//A good abstraction of our filesystem can be a map. The keys of the map are names of files and folders. If value for a key
//is an object then it's a folder name, if it's a string then it's a filename.

export interface FileTree {
    [key: string]: string | FileTree
}

export const treeToFiles = ({ rootPath, fileTree: structure }: { rootPath?: string, fileTree: FileTree }) => {

    if (!rootPath) rootPath = cwd()

    for (let [key, val] of Object.entries(structure)) {

        const objectPath = `${rootPath}/${key}`

        if (typeof val === "string") {

            writeFile(objectPath, val)
            continue
        }

        if (!existsSync(objectPath)) {

            mkdirSync(objectPath)
        }

        treeToFiles({ rootPath: objectPath, fileTree: val })
    }

}
