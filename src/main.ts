import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { getLabels } from './getLabels'
import { searchPRwithLabels } from './searchPRwithLabels'
import { searchCodePR } from './searchCodePR'
import { mergePR } from './mergePR'

interface Input {
    prNumber: number
    repoName: string
    owner: string
}

export async function main(octokit: Octokit, input: Input, merge: boolean): Promise<core.ExitCode>{

    const prNumber = input.prNumber
    const repoName = input.repoName
    const owner = input.owner

    core.info(`PR Number: ${prNumber}`)
    core.info(`Repo Name: ${repoName}`)

    try {
        const labels = await getLabels(octokit, prNumber, repoName, owner)
        core.info(`Labels: ${labels}`)
        const labelsToSearch = labels.filter((label) => !label.endsWith("-pro"))
        const PRs = await searchPRwithLabels(octokit, repoName, owner, labelsToSearch)
        core.info(`PRs: ${PRs}`)
        if (PRs.length > 0) {
            core.info('PRs found, nothing to merge')
            return core.ExitCode.Success
        } else {
            core.info('No PRs found, merge original code PR')
            const codePR = await searchCodePR(octokit, prNumber, repoName, owner)
            core.info(`Repo: ${codePR.base.repo.name} PR: ${codePR?.number}`)
            if (merge) {
                return mergePR(octokit, codePR.number, codePR.base.repo.name, owner).then((mergeResult) => {
                    core.info(`Merge Result: ${mergeResult}`)
                    if (mergeResult === undefined) {
                        core.setFailed(`Merge PR failed`)
                        return core.ExitCode.Failure
                    }
                    return core.ExitCode.Success
                })
            }
            return core.ExitCode.Success
        }
    } catch (error) {
        core.setFailed(error.message)
        return Promise.resolve(core.ExitCode.Failure)
    }
}

try {
    const prNumber = parseInt(core.getInput('pr_number'))
    const repoName = core.getInput('repo_name')
    const owner = core.getInput('owner')

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    })

    main(octokit, { prNumber, repoName, owner }, true)
} catch (error) {
    core.setFailed(error.message)
}
