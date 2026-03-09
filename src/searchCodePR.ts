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
        let originalRepoName: string | undefined
        let originalPrNumber: number | undefined

        // Try title match (old format: "repo-name app-name #pr123")
        const titleRe = /^([a-z\-1-9]+)\s([a-z-]+)\s\#pr(\d+)$/
        const titleMatch = res.data.title.match(titleRe)
        if (titleMatch) {
            originalRepoName = titleMatch[1]
            originalPrNumber = parseInt(titleMatch[3])
        }

        // Try body match (new format: "Triggered by build PR: owner/repo#123")
        if (!originalRepoName && res.data.body) {
            const bodyRe = /Triggered by build PR:.*?([a-zA-Z0-9.\-_/]+)#(\d+)/
            const bodyMatch = res.data.body.match(bodyRe)
            if (bodyMatch) {
                const fullRepo = bodyMatch[1]
                originalRepoName = fullRepo.includes('/') ? fullRepo.split('/')[1] : fullRepo
                originalPrNumber = parseInt(bodyMatch[2])
            }
        }

        if (originalRepoName && originalPrNumber) {
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
