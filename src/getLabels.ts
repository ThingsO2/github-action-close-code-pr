import { Octokit } from "@octokit/core"
import { Endpoints } from "@octokit/types";

type listLabelsOnIssueResponse = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"]["response"]

export async function getLabels(octokit: Octokit, prNumber: string, repoName: string, owner: string): Promise<listLabelsOnIssueResponse> {

    const request = `GET /repos/${owner}/${repoName}/issues/${prNumber}/labels`

    try {
        const {data: res } = await octokit.request(request, {
            owner: owner,
            repo: repoName,
            issue_number: prNumber
          })
        return res
    } catch (error) {
        return error
    }
}
