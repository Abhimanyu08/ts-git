import { createHash } from "crypto";
import { existsSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export function getTsgitRootPath(path: string): string {

    const tsgitPath = `${path}/.tsgit`
    const tsgitExists = existsSync(tsgitPath)
    if (path == "/" && !tsgitExists) {

        return ""
    }
    if (!tsgitExists) {

        const parentPath = join(path, '..')
        return getTsgitRootPath(parentPath)
    }
    return path
}

export function isInsideWorkingDirectory({ pathToCheck, rootDirPath }: { pathToCheck: string, rootDirPath: string }) {
    const rootPathArray = rootDirPath.split('/')
    const pathArray = pathToCheck.split('/')
    return rootPathArray.every((val, i) => val === pathArray[i])
}

export function calculateHash(content: Buffer) {
    const shasum = createHash("sha256")
    shasum.update(content)
    return shasum.digest('hex').slice(0, 8)
}