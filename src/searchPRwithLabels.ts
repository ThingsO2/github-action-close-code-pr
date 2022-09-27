import { Octokit } from "@octokit/core"
import { Endpoints } from "@octokit/types"

type listIssues = Endpoints["GET /repos/{owner}/{repo}/issues"]["response"]

export async function searchPRwithLabels(octokit: Octokit, repoName: string, owner: string, labels: string[]): Promise<number[] | undefined> {

    const res = await doRequest(octokit, repoName, owner, labels)

    if (res.status === 200) {
        return res.data.map((issue) => issue.number)
    }
    return undefined
}

async function doRequest(octokit: Octokit, repoName: string, owner: string, labels: string[]): Promise<listIssues> {
    const request = `GET /repos/${owner}/${repoName}/issues`

    try {
        const {data: res } = await octokit.request(request, {
            owner: owner,
            repo: repoName,
            labels: labels
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
