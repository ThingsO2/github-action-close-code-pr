import * as core from '@actions/core'
import { Octokit } from "@octokit/core"
import { Endpoints } from "@octokit/types"

type pullRequest = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]

export async function searchCodePR(octokit: Octokit, prNumber: string, repoName: string, owner: string): Promise<pullRequest['data'] | undefined> {

    const res = await doRequest(octokit, prNumber, repoName, owner)

    if (res.status === 200) {
        const re = /^([a-z\-1-9]+)\s([a-z-]+)\s\#pr(\d+)$/
        const match = res.data.title.match(re)
        if (match) {
            const originalRepoName = match[1]
            const originalPrNumber = match[3]
            const original = await doRequest(octokit, originalPrNumber, originalRepoName, owner)
            if (original.status === 200) {
                return original.data
            }
        }
    }
    core.error(`Error: ${res}`)
    return undefined
}

async function doRequest(octokit: Octokit, prNumber: string, repoName: string, owner: string): Promise<pullRequest> {
    const request = `GET /repos/${owner}/${repoName}/pulls/${prNumber}`

    try {
        const {data: res } = await octokit.request(request, {
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
