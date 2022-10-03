import { Octokit } from "@octokit/core"
import { RequestError } from "@octokit/request-error"
import { Endpoints } from "@octokit/types"

type mergePR = Endpoints["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"]["response"]

export async function mergePR(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<mergePR['data']> {

    const res = await doRequest(octokit, prNumber, repoName, owner)

    if (res instanceof RequestError) {
        throw res
    }

    if (res.status === 200) {
        return res.data
    }

    return undefined
}

async function doRequest(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<mergePR | RequestError>{

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
        return new RequestError(error.message, error.status, {
            request: error.request,
            response: error.response,
        })
    }
}
