import { Octokit } from "@octokit/core"
import { getLabels } from '../src/getLabels'

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
})

const prNumber = '15'
const repoName = 'monom-manifests'
const owner = 'ThingsO2'

test('getLabels', async () => {
    const labels = await getLabels(octokit, prNumber, repoName, owner)
    expect(labels).toEqual([{"color": "ededed", "default": false, "description": null, "id": 4323254495, "name": "test", "node_id": "LA_kwDOHR6z9M8AAAABAa-g3w", "url": "https://api.github.com/repos/ThingsO2/monom-manifests/labels/test"}])
})