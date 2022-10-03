import { Octokit } from "@octokit/core"
import { RequestError } from "@octokit/request-error"
import { Endpoints } from "@octokit/types"

type listLabelsOnIssueResponse = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"]["response"]

export async function getLabels(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<string[]>  {

    const res = await doRequest(octokit, prNumber, repoName, owner)

    if (res instanceof RequestError) {
        throw res
    }
    if (res.status === 200) {
        return res.data.map((label) => label.name)
    }

    return undefined
}

async function doRequest(octokit: Octokit, prNumber: number, repoName: string, owner: string): Promise<listLabelsOnIssueResponse | RequestError> {

    const request = "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"

    try {
        const {data: res} = await octokit.request(request, {
            owner: owner,
            repo: repoName,
            issue_number: prNumber
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
