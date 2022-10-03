import { RequestError } from "@octokit/request-error"
import { Octokit } from "@octokit/core"
import { Endpoints } from "@octokit/types"

type pullRequest = Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}"]["response"]

export async function searchCodePR(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<pullRequest['data']> {

    const res = await doRequest(octokit, prNumber, repoName, owner)

    if (res instanceof RequestError) {
        throw res
    }

    if (res.status === 200) {
        const re = /^([a-z\-1-9]+)\s([a-z-]+)\s\#pr(\d+)$/
        const match = res.data.title.match(re)
        if (match) {
            const originalRepoName = match[1]
            const originalPrNumber = parseInt(match[3])
            const original = await doRequest(octokit, originalPrNumber, originalRepoName, owner)
            if (original instanceof RequestError) {
                throw res
            }
            if (original.status === 200) {
                return original.data
            }
        }
    }

    return undefined
}

async function doRequest(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<pullRequest | RequestError> {

    const request = "GET /repos/{owner}/{repo}/pulls/{pull_number}"

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
        return new RequestError(error.message, error.status, {
            request: error.request,
            response: error.response,
        })
    }
}
