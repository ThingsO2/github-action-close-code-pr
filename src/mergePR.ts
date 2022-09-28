import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { Endpoints } from "@octokit/types"

type mergePR = Endpoints["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"]["response"]

export async function mergePR(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<mergePR['data'] | undefined> {

    const res = await doRequest(octokit, prNumber, repoName, owner)

    if (res.status === 200) {
        return res.data
    }
    core.error(`Error: ${res}`)
    return undefined
}

async function doRequest(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<mergePR> {
    const request = "PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"

    try {
        const { data: res } = await octokit.request(request, {
            owner: owner,
            repo: repoName,
            pull_number: prNumber,
        })
        return {
            data: res,
            status: 200,
            url: request,
            headers: {}
        }
    } catch (error) {
        return error
    }
}
