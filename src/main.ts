import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { getLabels } from './getLabels'
import { searchPRwithLabels } from './searchPRwithLabels'
import { searchCodePR } from './searchCodePR'
import { mergePR } from './mergePR'

interface Input {
    prNumber: string
    repoName: string
    owner: 'ThingsO2'
}

export const main = (input: Input): void => {

    const prNumber = input.prNumber
    const repoName = input.repoName
    const owner = input.owner

    core.info(`PR Number: ${prNumber}`)
    core.info(`Repo Name: ${repoName}`)

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    })

    getLabels(octokit, prNumber, repoName, owner).then((labels) => {
        core.info(`Labels: ${labels}`)
        if (labels === undefined) {
            core.setFailed(`Request label failed`)
        }
        searchPRwithLabels(octokit, repoName, owner, labels).then((PRs) => {
            core.info(`PRs: ${PRs}`)
            if (PRs === undefined) {
                core.setFailed(`Request PRs failed`)
            }
            if (PRs.length > 0) {
                core.info('PRs found, nothing to merge')
                core.ExitCode.Success
            } else {
                core.info('No PRs found, merge original code PR')
                searchCodePR(octokit, prNumber, repoName, owner).then((codePR) => {
                    core.info(`Repo: ${codePR.base.repo.name} PR: ${codePR?.number}`)
                    if (codePR === undefined) {
                        core.setFailed(`Request code PR failed`)
                    }
                    mergePR(octokit, codePR.number.toString(), codePR.base.repo.name, owner).then((mergeResult) => {
                        core.info(`Merge Result: ${mergeResult}`)
                        if (mergeResult === undefined) {
                            core.setFailed(`Merge PR failed`)
                        }
                        core.ExitCode.Success
                    })
                })
            }
        })
    })
}