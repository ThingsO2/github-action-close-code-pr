import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { getLabels } from './getLabels'

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

    const labels = getLabels(octokit, prNumber, repoName, owner)
}