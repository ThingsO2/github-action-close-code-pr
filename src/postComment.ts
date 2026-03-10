import { Octokit } from "@octokit/core"
import { RequestError } from "@octokit/request-error"
import { Endpoints } from "@octokit/types"

type postCommentResponse = Endpoints["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"]["response"]

export async function postComment(octokit: Octokit, prNumber: number, repoName: string, owner: string, body: string): Promise<postCommentResponse['data']> {

    const res = await doRequest(octokit, prNumber, repoName, owner, body)

    if (res instanceof RequestError) {
        throw res
    }

    if (res.status === 201) {
        return res.data
    }

    return undefined
}

async function doRequest(octokit: Octokit, prNumber: number, repoName: string, owner: string, body: string): Promise<postCommentResponse | RequestError>{

    const request = "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"

    try {
        const { data: res } = await octokit.request(request, {
            owner: owner,
            repo: repoName,
            issue_number: prNumber,
            body: body
        })
        return {
            data: res,
            status: 201,
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
